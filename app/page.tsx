import { Header } from '@/components/Header';
import { HomeClient } from './HomeClient';

// Force dynamic rendering - Header uses auth()
export const dynamic = 'force-dynamic';

export default async function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-purple-100">
            <Header />
            <HomeClient />
        </div>
    );
}
