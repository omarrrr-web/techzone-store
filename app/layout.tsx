import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// Configuramos la fuente
const onest = Onest({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "TechZone Store | Hardware Premium",
  description: "La mejor tienda de componentes de PC en Perú",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${onest.className} bg-gray-50 text-slate-900`}> {/* Agregamos bg-gray-50 base */}
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}