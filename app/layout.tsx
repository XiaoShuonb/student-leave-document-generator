import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "学生请假材料生成器",
  description: "一次填写，生成请假申请书、家长知情同意书和安全告知书。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
