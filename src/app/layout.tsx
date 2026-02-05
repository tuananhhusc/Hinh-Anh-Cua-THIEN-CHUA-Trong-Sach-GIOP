import type { Metadata } from "next";
import { Playfair_Display, EB_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const ebGaramond = EB_Garamond({
  subsets: ["latin", "vietnamese"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Giáo lý Gióp | Digital Theological Exhibition",
  description: "Khảo luận toàn diện về Thần học Đau khổ, Chủ quyền và Công lý Vũ trụ trong sách Gióp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${playfair.variable} ${ebGaramond.variable}`}>
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)] selection:text-white">
        {children}
      </body>
    </html>
  );
}
