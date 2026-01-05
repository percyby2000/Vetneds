import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "./lib/auth-context"

export const metadata: Metadata = {
  title: "VETNEDS - Productos para Mascotas",
  description:
    "Comida, ropa y servicios de calidad para tus mascotas. Envío rápido, precios justos y atención personalizada.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
