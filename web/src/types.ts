export interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    created_at: string;
    _count?: {
        websites: number;
    };
}

export interface Website {
    id: string;
    user_id: string;
    name: string;
    url: string;
    check_interval: number;
    last_status: 'UP' | 'DOWN';
    last_checked_at: string | null;
    uptime_percentage: number;
    created_at: string;
    logs?: StatusLog[];
}

export interface StatusLog {
    id: string;
    website_id: string;
    status: 'UP' | 'DOWN';
    status_code: number;
    response_time: number;
    checked_at: string;
}

export interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    token: string;
}
