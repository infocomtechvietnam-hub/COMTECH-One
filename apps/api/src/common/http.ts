import {
  ArgumentsHost,
  CallHandler,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
  NestMiddleware,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { ERROR_CODES, type ApiEnvelope, type ErrorCode, type ErrorDetail } from '@comtech/contracts';
import { newId } from '@comtech/db';
import type { NextFunction, Request, Response } from 'express';
import { map, type Observable } from 'rxjs';

export interface RequestWithId extends Request {
  requestId: string;
}

/** X-Request-Id: nhận từ client nếu hợp lệ, ngược lại sinh mới; luôn trả về (SPEC 18.1). */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const incoming = req.header('x-request-id');
    const id = incoming && /^[A-Za-z0-9-]{8,64}$/.test(incoming) ? incoming : newId();
    (req as RequestWithId).requestId = id;
    res.setHeader('X-Request-Id', id);
    next();
  }
}

/** Lỗi nghiệp vụ có mã chuẩn SPEC 18.4. */
export class ApiException extends Error {
  constructor(
    readonly code: ErrorCode,
    readonly details?: ErrorDetail[],
    message?: string,
  ) {
    super(message ?? ERROR_CODES[code].message);
  }
}

/** Bọc kết quả thành công vào envelope SPEC 18.2. */
@Injectable()
export class EnvelopeInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<ApiEnvelope<unknown>> {
    const req = ctx.switchToHttp().getRequest<RequestWithId>();
    return next.handle().pipe(
      map((data) => ({ success: true as const, data, meta: { request_id: req.requestId }, error: null })),
    );
  }
}

/**
 * Chuyển mọi lỗi thành envelope chuẩn. Không bao giờ trả stack trace hay lỗi DB
 * cho client (SPEC 18.4); log nội bộ chỉ ghi request_id + loại lỗi, không ghi body.
 */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ApiExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<RequestWithId>();
    const res = ctx.getResponse<Response>();
    const requestId = req.requestId ?? newId();

    let code: ErrorCode = 'INTERNAL_ERROR';
    let details: ErrorDetail[] | undefined;
    let message: string | undefined;

    if (exception instanceof ApiException) {
      code = exception.code;
      details = exception.details;
      message = exception.message;
    } else if (exception instanceof ThrottlerException) {
      code = 'RATE_LIMITED';
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      if (status === 404) code = 'NOT_FOUND';
      else if (status === 400 || status === 413 || status === 415) code = 'VALIDATION_ERROR';
      else if (status === 429) code = 'RATE_LIMITED';
    } else if (isBodyParserError(exception)) {
      code = 'VALIDATION_ERROR';
      message = 'Dữ liệu gửi lên không đúng định dạng JSON.';
    }

    const def = ERROR_CODES[code];
    if (code === 'INTERNAL_ERROR') {
      this.logger.error(`request_id=${requestId} ${exception instanceof Error ? exception.name + ': ' + exception.message : 'unknown'}`);
    }
    const body: ApiEnvelope<null> = {
      success: false,
      data: null,
      meta: { request_id: requestId },
      error: {
        code,
        message: (message ?? def.message).replace('{request_id}', requestId),
        ...(details ? { details } : {}),
      },
    };
    res.status(def.http).json(body);
  }
}

function isBodyParserError(e: unknown): boolean {
  return typeof e === 'object' && e !== null && 'type' in e && typeof (e as { type: unknown }).type === 'string' &&
    ['entity.parse.failed', 'entity.too.large', 'encoding.unsupported'].includes((e as { type: string }).type);
}
