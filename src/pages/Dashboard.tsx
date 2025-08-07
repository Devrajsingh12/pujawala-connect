import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ShoppingBag, BookOpen, Star, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cartItems: number;
}

interface RecentBooking {
  id: string;
  puja_type: string;
  preferred_date: string;
  status: string;
  pandit_name: string;
  total_amount: number | null;
}

export default function Dashboard() {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cartItems: 0
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch bookings stats
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            pandit:profiles!bookings_pandit_id_fkey(full_name)
          `)
          .eq('user_id', user?.id);

        if (bookingsError) throw bookingsError;

        const totalBookings = bookings?.length || 0;
        const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
        const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;

        // Fetch cart items count
        const { data: cartItems, error: cartError } = await supabase
          .from('cart_items')
          .select('id')
          .eq('user_id', user?.id);

        if (cartError) throw cartError;

        setStats({
          totalBookings,
          pendingBookings,
          completedBookings,
          cartItems: cartItems?.length || 0
        });

        // Set recent bookings (latest 3)
        if (bookings) {
          const recent = bookings
            .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
            .slice(0, 3)
            .map(booking => ({
              id: booking.id,
              puja_type: booking.puja_type,
              preferred_date: booking.preferred_date,
              status: booking.status || 'pending',
              pandit_name: (booking.pandit as { full_name: string } | null)?.full_name || 'Unknown',
              total_amount: booking.total_amount
            }));
          setRecentBookings(recent);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold spiritual-text mb-2">
            🙏 Welcome, {profile?.full_name}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Your spiritual journey dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="spiritual-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                All time bookings
              </p>
            </CardContent>
          </Card>

          <Card className="spiritual-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>

          <Card className="spiritual-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Star className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedBookings}</div>
              <p className="text-xs text-muted-foreground">
                Successful pujas
              </p>
            </CardContent>
          </Card>

          <Card className="spiritual-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
              <ShoppingBag className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{stats.cartItems}</div>
              <p className="text-xs text-muted-foreground">
                Items in cart
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card className="spiritual-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">No bookings yet</p>
                <Button className="spiritual-button" asChild>
                  <Link to="/book-pandit">Book Your First Puja</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-orange-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{booking.puja_type}</h4>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {booking.pandit_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(booking.preferred_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">
                        ₹{booking.total_amount || 'TBD'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/book-pandit">
            <Card className="spiritual-card cursor-pointer hover:shadow-xl transition-all">
              <CardContent className="p-6 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Book a Pandit</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Find qualified pandits for your spiritual needs
                </p>
                <Button className="spiritual-button w-full">Book Now</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/shop">
            <Card className="spiritual-card cursor-pointer hover:shadow-xl transition-all">
              <CardContent className="p-6 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-secondary mb-4" />
                <h3 className="font-semibold mb-2">Spiritual Shop</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse sacred items and spiritual products
                </p>
                <Button className="gold-button w-full">Shop Now</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/bookings">
            <Card className="spiritual-card cursor-pointer hover:shadow-xl transition-all">
              <CardContent className="p-6 text-center">
                <Calendar className="mx-auto h-12 w-12 text-green-600 mb-4" />
                <h3 className="font-semibold mb-2">My Bookings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View and manage your booking history
                </p>
                <Button variant="outline" className="w-full">View All</Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}