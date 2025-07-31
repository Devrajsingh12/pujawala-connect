import { Link } from 'react-router-dom';
import { Star, Users, ShoppingBag, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const features = [
    {
      icon: Calendar,
      title: 'Book Pandits',
      description: 'Find and book experienced pandits for your spiritual ceremonies and pujas.'
    },
    {
      icon: ShoppingBag,
      title: 'Spiritual Shop',
      description: 'Browse our collection of authentic spiritual items and puja accessories.'
    },
    {
      icon: Users,
      title: 'Trusted Pandits',
      description: 'Connect with verified and experienced pandits in your area.'
    },
    {
      icon: Star,
      title: 'Quality Service',
      description: 'Ensure your spiritual ceremonies are conducted with proper rituals and care.'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Sharma',
      text: 'Excellent service! The pandit was very knowledgeable and conducted our griha pravesh beautifully.',
      rating: 5
    },
    {
      name: 'Priya Patel',
      text: 'Great platform to find authentic spiritual items. The quality is outstanding.',
      rating: 5
    },
    {
      name: 'Amit Kumar',
      text: 'Booking was easy and the pandit arrived on time. Highly recommended!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <span className="om-symbol text-6xl text-primary">🕉</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Spiritual Journey{' '}
              <span className="spiritual-text">Starts Here</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Connect with experienced pandits for your spiritual ceremonies and explore our collection of authentic spiritual items. Experience the divine with Pandit Ji.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="spiritual-button" asChild>
                <Link to="/auth">Book a Pandit</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth">Explore Shop</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="spiritual-text">Pandit Ji</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive spiritual services to make your ceremonies meaningful and memorable.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="spiritual-card text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Verified Pandits</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Successful Ceremonies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Spiritual Items</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="spiritual-text">Devotees</span> Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="spiritual-card">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <div className="font-semibold">{testimonial.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Begin Your Spiritual Journey?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of devotees who trust Pandit Ji for their spiritual needs.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/auth">Get Started Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <span className="om-symbol text-primary">🕉</span>
                <span className="text-xl font-bold spiritual-text">Pandit Ji</span>
              </div>
              <p className="text-muted-foreground">
                Connecting devotees with experienced pandits for authentic spiritual ceremonies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Book Pandit</li>
                <li>Spiritual Shop</li>
                <li>Puja Services</li>
                <li>Wedding Ceremonies</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Email: info@panditji.com</li>
                <li>Phone: +91 9876543210</li>
                <li>WhatsApp: +91 9876543210</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Pandit Ji. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}