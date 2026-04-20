import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "K-IREA | Kenneth의 지능형 부동산 AI 플랫폼",
  description: "데이터로 증명하는 세부 부동산, 0.1%의 오차도 허용하지 않습니다. AI 기반 투명한 부동산 투자 플랫폼",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-inter antialiased">
        {children}
        <Script
          src="https://unpkg.com/@elevenlabs/convai-widget-embed"
          strategy="afterInteractive"
          async
        />
      </body>
    </html>
  );
}
