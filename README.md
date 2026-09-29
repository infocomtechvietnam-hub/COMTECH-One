# COMTECH One - Official Website

Website chính thức của COMTECH - Công ty cung cấp giải pháp viễn thông hàng đầu tại Việt Nam.

## 🌐 Công nghệ sử dụng

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend API**: Next.js API Routes
- **Database**: PostgreSQL (for production)
- **Deployment**: Vercel / Docker

## 📋 Tính năng

- ✅ Trang chủ (Homepage) với thông tin giới thiệu công ty
- ✅ Danh sách các giải pháp (Infrastructure, Services, Consulting)
- ✅ Trang chi tiết cho từng giải pháp
- ✅ Trang Giới thiệu (About)
- ✅ Form Liên hệ (Contact Form) với backend API
- ✅ Responsive Design (Mobile-first)
- ✅ Tối ưu SEO

## 🚀 Cách sử dụng

### Yêu cầu hệ thống

- Node.js 18+
- npm hoặc yarn
- PostgreSQL (cho production)

### Cài đặt và chạy local

```bash
# 1. Clone repo
git clone https://github.com/infocomtechvietnam-hub/COMTECH-One.git
cd COMTECH-One/comtech-website

# 2. Cài đặt dependencies
npm install

# 3. Tạo file .env.local
cp .env.example .env.local

# 4. Cấu hình các biến môi trường trong .env.local
# (tham khảo phần Configuration bên dưới)

# 5. Chạy development server
npm run dev

# 6. Mở browser và truy cập
# http://localhost:3000
```

### Build cho production

```bash
# Build project
npm run build

# Chạy production build
npm start

# Hoặc chạy với Docker
docker build -t comtech-website .
docker run -p 3000:3000 comtech-website
```

## ⚙️ Cấu hình (Configuration)

### 1. Environment Variables

Tạo file `.env.local` và cấu hình:

```
NEXT_PUBLIC_API_URL=https://www.comtechvietnam.vn
NEXT_PUBLIC_SITE_URL=https://www.comtechvietnam.vn

# Email configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Emails
ADMIN_EMAIL=admin@comtechvietnam.vn
SUPPORT_EMAIL=support@comtechvietnam.vn

# Database (production)
DATABASE_URL=postgresql://user:password@localhost:5432/comtech_leads
```

### 2. Cấu hình SMTP cho Email Notifications

Hiện tại, API chỉ log các lead. Để gửi email tự động:

1. Cài đặt thư viện email:
```bash
npm install nodemailer @types/nodemailer
```

2. Cập nhật file `app/api/leads/route.ts` để gửi email

### 3. Database Setup (PostgreSQL)

```sql
-- Tạo database
CREATE DATABASE comtech_leads;

-- Tạo table leads
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  company VARCHAR(255),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'new'
);

-- Tạo index
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
```

## 📁 Cấu trúc Thư mục

```
comtech-website/
├── app/
│   ├── api/
│   │   └── leads/
│   │       └── route.ts          # API endpoint cho form liên hệ
│   ├── about/
│   │   └── page.tsx              # Trang Giới thiệu
│   ├── contact/
│   │   └── page.tsx              # Trang Liên hệ (Contact Form)
│   ├── solutions/
│   │   ├── page.tsx              # Trang danh sách giải pháp
│   │   ├── infrastructure/
│   │   │   └── page.tsx
│   │   ├── services/
│   │   │   └── page.tsx
│   │   └── consulting/
│   │       └── page.tsx
│   ├── layout.tsx                # Layout chính (Header + Footer)
│   ├── page.tsx                  # Trang chủ (Homepage)
│   └── globals.css               # Styles toàn cục
├── components/                   # Reusable components (nếu cần)
├── public/                       # Static files (images, fonts, etc.)
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── .env.example
├── .gitignore
└── README.md
```

## 🎨 Styling

- Sử dụng **Tailwind CSS** cho styling
- Màu chính: `#FA9D0E` (Orange)
- Màu phụ: `#1a1a1a` (Dark)
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## 🔗 API Endpoints

### POST /api/leads

Gửi form liên hệ

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+84901234567",
  "company": "ABC Corp",
  "subject": "Cơ sở hạ tầng",
  "message": "Tôi muốn tư vấn về giải pháp cơ sở hạ tầng..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn sớm.",
  "lead": {
    "id": "1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-09-29T10:30:00Z"
  }
}
```

## 📱 Pages

1. **Home** (`/`) - Trang chủ
2. **Solutions** (`/solutions`) - Danh sách giải pháp
3. **Solutions - Infrastructure** (`/solutions/infrastructure`) - Chi tiết Cơ sở hạ tầng
4. **Solutions - Services** (`/solutions/services`) - Chi tiết Dịch vụ kỹ thuật
5. **Solutions - Consulting** (`/solutions/consulting`) - Chi tiết Tư vấn chuyên môn
6. **About** (`/about`) - Giới thiệu công ty
7. **Contact** (`/contact`) - Liên hệ

## 🚀 Triển khai (Deployment)

### Option 1: Vercel (Recommended)

```bash
# 1. Cài đặt Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Cấu hình environment variables trong Vercel Dashboard
```

### Option 2: Docker

```bash
# Build image
docker build -t comtech-website:latest .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://www.comtechvietnam.vn \
  -e DATABASE_URL=postgresql://... \
  comtech-website:latest
```

### Option 3: Self-hosted (Linux/Ubuntu)

```bash
# 1. SSH vào server
ssh user@your-server.com

# 2. Clone repo
git clone https://github.com/infocomtechvietnam-hub/COMTECH-One.git
cd COMTECH-One/comtech-website

# 3. Cài đặt dependencies
npm install

# 4. Build
npm run build

# 5. Cài đặt PM2
npm install -g pm2

# 6. Start với PM2
pm2 start "npm start" --name "comtech-website"

# 7. Cấu hình Nginx reverse proxy
# (tham khảo file nginx.conf.example)
```

## 📧 Email Notifications

Hiện tại API chỉ log leads. Để bật email notifications:

1. Cấu hình SMTP credentials trong `.env.local`
2. Cài đặt `nodemailer`:
```bash
npm install nodemailer @types/nodemailer
```

3. Cập nhật `app/api/leads/route.ts` để gửi email

## 🔒 Bảo mật

- ✅ Input validation trên form
- ✅ Email format validation
- ✅ HTTPS enforced trên production
- ✅ CORS configuration (nếu cần)
- ⚠️ TODO: Rate limiting cho API endpoints
- ⚠️ TODO: CAPTCHA cho form

## 📊 Monitoring & Analytics

- Setup Google Analytics (optional)
- Monitor API logs
- Database query monitoring

## 🐛 Troubleshooting

### Issue: "Module not found"
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Build fails"
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Issue: "Email không gửi"
- Check SMTP credentials
- Verify email provider settings
- Check firewall/port 587

## 📞 Hỗ trợ

Liên hệ: info@comtechvietnam.vn

## 📝 Changelog

### v1.0.0 (2026-09-29)
- Initial website launch
- Homepage, Solutions, About, Contact pages
- Lead form API
- Responsive design

## 📄 License

Copyright © 2026 COMTECH. All rights reserved.

---

**Next Steps:**
- [ ] Setup PostgreSQL database
- [ ] Configure SMTP for email notifications
- [ ] Setup Vercel/Deployment
- [ ] Configure custom domain (www.comtechvietnam.vn)
- [ ] Setup SSL certificate
- [ ] Add Google Analytics
- [ ] Add CAPTCHA to contact form
- [ ] Setup automated backups
- [ ] Monitor and optimize performance
