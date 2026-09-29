-- COMTECH One: migration khởi tạo (website-first)
-- Loại: expand (chỉ tạo mới). Đảo ngược: DROP các bảng dưới đây (chưa có dữ liệu phụ thuộc).

CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Lead (SPEC 10.5)
CREATE TABLE "leads" (
    "id" UUID NOT NULL,
    "lead_code" VARCHAR(20) NOT NULL,
    "full_name" VARCHAR(160) NOT NULL,
    "company_name" VARCHAR(255),
    "email" CITEXT,
    "phone" VARCHAR(20),
    "industry_code" VARCHAR(40),
    "service_interest" VARCHAR(80)[],
    "project_type" VARCHAR(40),
    "province_id" UUID,
    "location_text" TEXT,
    "estimated_timeline" VARCHAR(40),
    "message" TEXT,
    "attachment_file_id" UUID,
    "source" VARCHAR(20) NOT NULL,
    "utm" JSONB,
    "landing_page" TEXT,
    "consent_at" TIMESTAMPTZ(6),
    "consent_version" VARCHAR(20),
    "status" VARCHAR(20) NOT NULL DEFAULT 'NEW',
    "owner_employee_id" UUID,
    "customer_id" UUID,
    "opportunity_id" UUID,
    "spam_score" DECIMAL(4,2),
    "ip_address" INET,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "deleted_by" UUID,
    "deleted_reason" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "data_origin" VARCHAR(10) NOT NULL DEFAULT 'REAL',
    CONSTRAINT "leads_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ck_leads_source" CHECK ("source" IN ('WEBSITE','REFERRAL','EVENT','PHONE','EMAIL','IMPORT')),
    CONSTRAINT "ck_leads_status" CHECK ("status" IN ('NEW','CONTACTED','QUALIFIED','DISQUALIFIED','CONVERTED')),
    CONSTRAINT "ck_leads_data_origin" CHECK ("data_origin" IN ('REAL','DEMO','TEST','IMPORT')),
    -- Lead từ website bắt buộc có đồng ý xử lý dữ liệu (SPEC 17)
    CONSTRAINT "ck_leads_website_consent" CHECK ("source" <> 'WEBSITE' OR ("consent_at" IS NOT NULL AND "consent_version" IS NOT NULL))
);
CREATE UNIQUE INDEX "ux_leads_code" ON "leads" ("lead_code") WHERE "deleted_at" IS NULL;
CREATE INDEX "ix_leads_status_created" ON "leads" ("status", "created_at" DESC) WHERE "deleted_at" IS NULL;

-- Bộ đếm mã (SPEC 10.4)
CREATE TABLE "code_sequences" (
    "entity" VARCHAR(30) NOT NULL,
    "period" VARCHAR(10) NOT NULL,
    "last_value" BIGINT NOT NULL,
    CONSTRAINT "code_sequences_pkey" PRIMARY KEY ("entity", "period")
);

-- Outbox (SPEC 10.13, 20.1)
CREATE TABLE "domain_events" (
    "id" UUID NOT NULL,
    "event_type" VARCHAR(60) NOT NULL,
    "aggregate_type" VARCHAR(30) NOT NULL,
    "aggregate_id" UUID NOT NULL,
    "payload" JSONB NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMPTZ(6),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "last_error" TEXT,
    "next_attempt_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "domain_events_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ix_outbox_unpublished" ON "domain_events" ("next_attempt_at") WHERE "published_at" IS NULL;

-- Idempotency (SPEC 10.13, 18.5)
CREATE TABLE "idempotency_keys" (
    "key" VARCHAR(80) NOT NULL,
    "user_id" UUID NOT NULL,
    "endpoint" VARCHAR(120) NOT NULL,
    "request_hash" CHAR(64) NOT NULL,
    "response_status" SMALLINT NOT NULL,
    "response_body" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("key", "user_id", "endpoint")
);
CREATE INDEX "ix_idempotency_created" ON "idempotency_keys" ("created_at");
