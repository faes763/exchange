import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Stuart Exchange',
  description: 'Stuart Exchange',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
