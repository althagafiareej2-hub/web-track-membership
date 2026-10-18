
import "./globals.css";

export const metadata = {
  title: "Web Track | بوابة العضوية",
  description: "بوابة تسجيل أعضاء المسار التقني",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
