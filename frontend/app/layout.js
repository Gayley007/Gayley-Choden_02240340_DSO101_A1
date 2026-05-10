import "./globals.css";

export const metadata = {
  title: "Task Manager",
  description: "Task manager with Next.js + Express + PostgreSQL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
