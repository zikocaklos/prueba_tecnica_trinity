import '../src/globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Banking Admin',
  description: 'Admin dashboard for banking system',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}
