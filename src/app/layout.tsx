import "../styles/globals.css";

export const metadata = {
  title: "NeuraVia Academy",
  description: "Lesson page design",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
