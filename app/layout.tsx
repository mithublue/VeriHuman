import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ProgressBar } from '@/components/ProgressBar'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import './styles/animations.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'VeriHuman - AI Detection & Text Humanization',
    description: 'Detect AI-generated content and humanize text with advanced IVEM analysis. Transform AI writing into natural, human-like content.',
    icons: {
        icon: '/favicon.ico',
        apple: '/logo.png',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ProgressBar />
                {children}
                <Analytics />
            </body>
        </html>
    )
}
