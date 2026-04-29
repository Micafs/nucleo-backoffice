import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nucleo — Back Office',
  description: 'Sistema de administración de usuarios y equipos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
