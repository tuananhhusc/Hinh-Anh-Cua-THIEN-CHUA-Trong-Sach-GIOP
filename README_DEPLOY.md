# Hướng Dẫn Deploy Trang Web Lên GitHub Pages

Tài liệu này sẽ hướng dẫn bạn từng bước để đưa website Next.js này lên GitHub Pages hoàn toàn miễn phí.

## Cách 1: Deploy Tự Động (Khuyên Dùng) - Sử dụng GitHub Actions

Cách này sẽ tự động build và deploy mỗi khi bạn đẩy code lên GitHub.

### Bước 1: Cấu hình Next.js

Mở file `next.config.ts` và cập nhật nội dung sau để bật chế độ Static Export:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",  // Bắt buộc để xuất ra file tĩnh (HTML/CSS/JS)
  images: {
    unoptimized: true, // Bắt buộc nếu dùng next/image trên GitHub Pages
  },
  // Nếu bạn deploy vào thư mục con (ví dụ: username.github.io/ten-project), hãy bỏ comment dòng dưới:
  // basePath: "/ten-project",
};

export default nextConfig;
```

### Bước 2: Tạo Kho Chứa (Repository) trên GitHub

1. Đăng nhập GitHub và tạo một Repository mới (ví dụ: `sach-giop-web`).
2. Kết nối thư mục code hiện tại với GitHub (mở Terminal tại thư mục dự án):

```bash
git init
git add .
git commit -m "Khoi tao du an"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<TÊN-REPO>.git
git push -u origin main
```
*(Thay `<USERNAME>` và `<TÊN-REPO>` bằng thông tin của bạn)*

### Bước 3: Cấu hình GitHub Pages

1. Vào trang Repository trên GitHub.
2. Chọn **Settings** > **Pages** (ở menu bên trái).
3. Tại mục **Build and deployment**, phần **Source**, giữ nguyên là **Deploy from a branch** hoặc chọn **GitHub Actions** (Next.js có template sẵn).
   - **Cách đơn giản nhất:** Chọn **GitHub Actions**.
   - Tìm chữ **Next.js** và nhấn **Configure**.
   - GitHub sẽ tự tạo file `.github/workflows/nextjs.yml`. Bạn chỉ cần nhấn **Commit changes**.
   - Chờ vài phút, website sẽ được deploy tại `https://<USERNAME>.github.io/<TÊN-REPO>`.

---

## Cách 2: Deploy Thủ Công - Sử dụng gói `gh-pages`

Cách này phù hợp nếu bạn muốn tự chạy lệnh để deploy.

### Bước 1: Cài đặt gói hỗ trợ

Chạy lệnh sau trong Terminal:

```bash
npm install --save-dev gh-pages
```

### Bước 2: Cập nhật `package.json`

Thêm dòng `"deploy": "gh-pages -d out"` vào phần `scripts`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "deploy": "gh-pages -d out"  <-- Thêm dòng này
},
```

### Bước 3: Cấu hình Next.js (Giống Cách 1)

Cập nhật `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};
```

### Bước 4: Chạy Deploy

Mỗi khi muốn cập nhật web, bạn chạy 2 lệnh sau:

```bash
npm run build
npm run deploy
```

Code đã build (trong thư mục `out`) sẽ được đẩy lên nhánh `gh-pages`.

### Bước 5: Chọn nhánh hiển thị

1. Vào **Settings** > **Pages** trên GitHub.
2. Tại mục **Build and deployment** > **Branch**, chọn nhánh **gh-pages**.
3. Nhấn **Save**.

---

## Lưu ý quan trọng về Hình ảnh và Đường dẫn

Nếu trang web của bạn nằm ở địa chỉ `https://username.github.io/my-repo/`, bạn cần lưu ý:

1. **Cấu hình basePath**: Trong `next.config.ts`, thêm `basePath: "/my-repo"`.
2. **Đường dẫn ảnh**: Khi dùng thẻ `<img>` hoặc `background-image`, hãy đảm bảo đường dẫn có kèm prefix của repo, hoặc dùng biến môi trường.

Vậy là xong! Chúc bạn thành công.
