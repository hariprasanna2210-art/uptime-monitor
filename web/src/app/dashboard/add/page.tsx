'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AddWebsitePage() {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [interval, setInterval] = useState(5);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/websites', { name, url, check_interval: Number(interval) });
            router.push('/dashboard');
        } catch (error) {
            console.error('Failed to add website', error);
            alert('Failed to add website');
        }
    };

    return (
        <div className="p-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Monitor New Website</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Website Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="My Awesome Site"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">URL to Monitor</label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="https://example.com"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2">Check Interval (minutes)</label>
                        <select
                            value={interval}
                            onChange={(e) => setInterval(Number(e.target.value))}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="1">1 Minute</option>
                            <option value="5">5 Minutes</option>
                            <option value="15">15 Minutes</option>
                            <option value="30">30 Minutes</option>
                            <option value="60">1 Hour</option>
                        </select>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold">
                        Start Monitoring
                    </button>
                </form>
            </div>
        </div>
    );
}
