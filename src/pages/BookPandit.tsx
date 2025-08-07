import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Star, MapPin, Clock, CalendarIcon, Search, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Pandit {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  specialization: string | null;
  experience_years: number | null;
  rate_per_hour: number | null;
}

interface BookingForm {
  panditId: string;
  pujaType: string;
  preferredDate: Date | undefined;
  preferredTime: string;
  address: string;
  specialRequirements: string;
}

const pujaTypes = [
  'Ganesh Puja',
  'Lakshmi Puja',
  'Saraswati Puja',
  'Durga Puja',
  'Hanuman Puja',
  'Shiv Puja',
  'Griha Pravesh',
  'Havan',
  'Satyanarayan Puja',
  'Wedding Ceremony',
  'Mundan Ceremony',
  'Thread Ceremony',
  'Other'
];

const timeSlots = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM'
];

export default function BookPandit() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedPandit, setSelectedPandit] = useState<Pandit | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    panditId: '',
    pujaType: '',
    preferredDate: undefined,
    preferredTime: '',
    address: '',
    specialRequirements: ''
  });

  useEffect(() => {
    const fetchPandits = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('is_pandit', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPandits(data || []);
      } catch (error) {
        console.error('Error fetching pandits:', error);
        toast({
          title: "Error",
          description: "Failed to load pandits",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPandits();
  }, [toast]);

  const handleBookPandit = (pandit: Pandit) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to book a pandit",
        variant: "destructive",
      });
      return;
    }

    setSelectedPandit(pandit);
    setBookingForm(prev => ({ ...prev, panditId: pandit.id }));
    setIsBookingDialogOpen(true);
  };

  const submitBooking = async () => {
    if (!user || !selectedPandit) return;

    if (!bookingForm.pujaType || !bookingForm.preferredDate || !bookingForm.preferredTime || !bookingForm.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setBookingLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          pandit_id: selectedPandit.id,
          puja_type: bookingForm.pujaType,
          preferred_date: format(bookingForm.preferredDate, 'yyyy-MM-dd'),
          preferred_time: bookingForm.preferredTime,
          address: bookingForm.address,
          special_requirements: bookingForm.specialRequirements || null,
          status: 'pending',
          total_amount: selectedPandit.rate_per_hour ? selectedPandit.rate_per_hour * 2 : null // Assuming 2 hours minimum
        });

      if (error) throw error;

      toast({
        title: "Booking Submitted",
        description: "Your booking request has been submitted successfully",
      });

      setIsBookingDialogOpen(false);
      setBookingForm({
        panditId: '',
        pujaType: '',
        preferredDate: undefined,
        preferredTime: '',
        address: '',
        specialRequirements: ''
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to submit booking request",
        variant: "destructive",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredPandits = pandits.filter(pandit =>
    pandit.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pandit.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pandit.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
            🙏 Book a Pandit
          </h1>
          <p className="text-muted-foreground text-lg">
            Find qualified pandits for your spiritual ceremonies
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, specialization, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Pandits Grid */}
        {filteredPandits.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No pandits found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPandits.map((pandit) => (
              <Card key={pandit.id} className="spiritual-card hover:shadow-2xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl">{pandit.full_name}</CardTitle>
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">(4.9)</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {pandit.specialization && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-sm">{pandit.specialization}</span>
                    </div>
                  )}
                  
                  {pandit.experience_years && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm">{pandit.experience_years} years experience</span>
                    </div>
                  )}
                  
                  {pandit.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm">{pandit.address}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      {pandit.rate_per_hour && (
                        <div className="text-2xl font-bold text-primary">
                          ₹{pandit.rate_per_hour}/hr
                        </div>
                      )}
                      <Badge variant="secondary" className="mt-1">Available</Badge>
                    </div>
                    <Button 
                      className="spiritual-button"
                      onClick={() => handleBookPandit(pandit)}
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Booking Dialog */}
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Book {selectedPandit?.full_name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="pujaType">Puja Type *</Label>
                <Select value={bookingForm.pujaType} onValueChange={(value) => 
                  setBookingForm(prev => ({ ...prev, pujaType: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select puja type" />
                  </SelectTrigger>
                  <SelectContent>
                    {pujaTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Preferred Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !bookingForm.preferredDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingForm.preferredDate ? format(bookingForm.preferredDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={bookingForm.preferredDate}
                      onSelect={(date) => setBookingForm(prev => ({ ...prev, preferredDate: date }))}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="preferredTime">Preferred Time *</Label>
                <Select value={bookingForm.preferredTime} onValueChange={(value) => 
                  setBookingForm(prev => ({ ...prev, preferredTime: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter ceremony address"
                  value={bookingForm.address}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="specialRequirements">Special Requirements</Label>
                <Textarea
                  id="specialRequirements"
                  placeholder="Any special requirements or notes"
                  value={bookingForm.specialRequirements}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequirements: e.target.value }))}
                />
              </div>

              {selectedPandit?.rate_per_hour && (
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>Estimated Cost (2 hours):</span>
                    <span className="text-xl font-bold text-primary">
                      ₹{selectedPandit.rate_per_hour * 2}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsBookingDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 spiritual-button"
                  onClick={submitBooking}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? "Submitting..." : "Submit Booking"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}