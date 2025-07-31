import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome, {profile?.full_name}!</h1>
        <p className="text-muted-foreground">Your user dashboard is coming soon...</p>
      </div>
    </div>
  );
}