import "./globals.css";

export const metadata = {
  title: "ApplySense",
  description: "Calm guidance for GCC job seekers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
