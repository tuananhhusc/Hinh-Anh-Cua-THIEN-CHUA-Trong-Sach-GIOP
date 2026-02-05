import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Đảm bảo đường dẫn này khớp chính xác với URL của bạn
  basePath: "/Hinh-Anh-Cua-THIEN-CHUA-Trong-Sach-GIOP",
  assetPrefix: "/Hinh-Anh-Cua-THIEN-CHUA-Trong-Sach-GIOP",
};

export default nextConfig;
