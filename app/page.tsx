import { Header } from '@/components/Header';
import { HomeClient } from './HomeClient';

// Force dynamic rendering - Header uses auth()
export const dynamic = 'force-dynamic';

export default async function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <HomeClient />
        </div>
    );
}
