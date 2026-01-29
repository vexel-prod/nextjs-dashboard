import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts'
import { Metadata } from 'next'

const emojiFavicon = (emoji: string) =>
  `data:image/svg+xml,` +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <text y=".9em" font-size="90">${emoji}</text>
    </svg>`,
  )


export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  icons: {
    icon: emojiFavicon('🌐'),
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
