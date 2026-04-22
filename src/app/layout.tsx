import "../styles/globals.css";
import {Bricolage_Grotesque} from "next/font/google";
import { Providers } from "../components/Providers";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata = {
  title: "NeuraVia Academy",
  description: "Lesson page design",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={bricolage.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
