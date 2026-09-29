import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: {
    // Chỉ đọc từ biến môi trường; không có giá trị mặc định chứa mật khẩu.
    url: process.env.DATABASE_URL ?? '',
  },
});
