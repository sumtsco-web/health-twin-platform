import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Health Twin™ Corporate Dashboard',
    description: 'AI-Driven Occupational Health Monitoring',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} bg-background text-white overflow-hidden`}>
                <div className="flex h-screen">
                    {/* Sidebar Navigation */}
                    <Sidebar />

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col overflow-hidden relative">
                        {/* Background Glow Effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-hero-glow opacity-40 pointer-events-none z-0" />

                        <Header />

                        <main className="flex-1 overflow-y-auto p-6 z-10 relative scrollbar-hide">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    )
}
