import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Stuart Exchange',
  description: 'Stuart Exchange',
  keywords: "обменник, крипта, криптообменник, обменять крипту, стюарт обменник, стюарт литтл, обмен валют, обмен крипты"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children 
}
