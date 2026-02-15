'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Website } from '@/types';

export default function DashboardPage() {
    const [websites, setWebsites] = useState<Website[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWebsites = async () => {
        try {
            const res = await api.get('/websites');
            setWebsites(res.data);
        } catch (error) {
            console.error('Failed to fetch websites');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWebsites();
        // Poll every 1 minute to refresh status
        const interval = setInterval(fetchWebsites, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Link href="/dashboard/add" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Add Website
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {websites.map((site) => (
                    <div key={site.id} className="bg-white rounded-lg shadow p-6 border-l-4"
                        style={{ borderColor: site.last_status === 'UP' ? '#10B981' : '#EF4444' }}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold">{site.name}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${site.last_status === 'UP' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {site.last_status}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">{site.url}</p>
                        <div className="text-sm text-gray-600">
                            <p>Checked: {site.last_checked_at ? new Date(site.last_checked_at).toLocaleTimeString() : 'Never'}</p>
                            <p>Uptime: {site.uptime_percentage}%</p>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Link href={`/dashboard/websites/${site.id}`} className="text-blue-600 hover:underline text-sm">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}

                {websites.length === 0 && (
                    <div className="col-span-3 text-center py-10 text-gray-500">
                        No websites monitored yet. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
