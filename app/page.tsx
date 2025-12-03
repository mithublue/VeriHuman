import { Header } from '@/components/Header';
import { HomeClient } from './HomeClient';

export default async function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <HomeClient />
        </div>
    );
}
