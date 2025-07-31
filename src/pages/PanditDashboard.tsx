import { useAuth } from '@/contexts/AuthContext';

export default function PanditDashboard() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Pandit Dashboard - {profile?.full_name}</h1>
        <p className="text-muted-foreground">Manage your bookings and services...</p>
      </div>
    </div>
  );
}