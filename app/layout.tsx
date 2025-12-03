import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ProgressBar } from '@/components/ProgressBar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'AI Text Humanizer - Transform AI Content',
    description: 'Bypass AI detection and refine your content with our advanced humanization engine',
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
            </body>
        </html>
    )
}
