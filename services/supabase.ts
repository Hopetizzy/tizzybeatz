
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);

export const createCollaboration = async (data: any) => {
    const { data: result, error } = await supabase
        .from('collaborations')
        .insert([
            {
                sender_name: data.senderName,
                sender_email: data.senderEmail,
                project_type: data.projectType,
                message: data.message,
                demo_url: data.demoUrl
            }
        ])
        .select()
        .single();

    if (error) {
        console.error('Error creating collaboration:', error);
        return null;
    }
    return result;
};

export const fetchCollaborations = async () => {
    const { data, error } = await supabase
        .from('collaborations')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching collaborations:', error);
        return [];
    }

    return data.map((item: any) => ({
        id: item.id,
        senderName: item.sender_name,
        senderEmail: item.sender_email,
        projectType: item.project_type,
        message: item.message,
        demoUrl: item.demo_url,
        status: item.status,
        createdAt: item.created_at
    }));
};

export const updateCollaborationStatus = async (id: string, status: string) => {
    const { data, error } = await supabase
        .from('collaborations')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating collaboration status:', error);
        return null;
    }
    return data;
};

export const recordTransaction = async (data: any) => {
    // Ensure amount is stored as a number (e.g. 5000.00)
    // Paystack sends kobo (500000), but frontend might pass the original price (5000).
    // We will trust the passed 'amount' is what we want to display.
    const { data: result, error } = await supabase
        .from('transactions')
        .insert([{
            reference: data.reference,
            email: data.email,
            amount: data.amount,
            products: data.products
        }])
        .select()
        .single();

    if (error) {
        console.error('Error recording transaction:', error);
        return null;
    }
    return result;
};

export const fetchRevenueStats = async () => {
    const { data, error } = await supabase
        .from('transactions')
        .select('amount, created_at, products')
        .order('created_at', { ascending: true }); // Order by date for chart

    if (error) {
        console.error('Error fetching revenue stats:', error);
        return { totalRevenue: 0, chartData: [], totalUnits: 0 };
    }

    let totalRevenue = 0;
    let totalUnits = 0;
    const salesByDay: Record<string, number> = {};

    // Initialize last 7 days with 0 to make chart look better
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(d => salesByDay[d] = 0);

    data.forEach((txn: any) => {
        const amount = Number(txn.amount);
        totalRevenue += amount;

        if (Array.isArray(txn.products)) {
            totalUnits += txn.products.length;
        }

        const date = new Date(txn.created_at).toLocaleDateString('en-US', { weekday: 'short' });
        // Use += incase multiple sales on same day
        if (salesByDay[date] !== undefined) {
            salesByDay[date] += amount;
        }
    });

    const chartData = Object.keys(salesByDay).map(day => ({
        name: day,
        sales: salesByDay[day]
    }));

    // Sort chart data slightly by week order for display (optional/simple approach)
    // Actually Recharts just needs an array. The order of explicit days above helps.

    return { totalRevenue, chartData, totalUnits };
};

