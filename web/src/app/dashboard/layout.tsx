import Link from 'next/link';
import { Home, Globe, Settings, LogOut, Users } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">UptimeMon</h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-slate-800 transition">
                        <Home size={20} />
                        Dashboard
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-slate-800 transition">
                        <Globe size={20} />
                        Websites
                    </Link>
                    <Link href="/dashboard/users" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-slate-800 transition">
                        <Users size={20} />
                        Users
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-slate-800 transition">
                        <Settings size={20} />
                        Settings
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-slate-800 rounded transition text-red-400">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
