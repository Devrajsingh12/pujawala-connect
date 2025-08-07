import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Plus, Minus, Star, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  created_at: string;
}

interface CartItem {
  id: string;
  shop_item_id: string;
  quantity: number;
  shop_item: ShopItem;
}

export default function Shop() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState<string | null>(null);

  const fetchCartItems = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          shop_item:shop_items(*)
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        const { data, error } = await supabase
          .from('shop_items')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error('Error fetching shop items:', error);
        toast({
          title: "Error",
          description: "Failed to load shop items",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchShopItems();
    if (user) {
      fetchCartItems();
    }
  }, [user, toast, fetchCartItems]);

  const addToCart = async (itemId: string) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    setCartLoading(itemId);
    try {
      // Check if item already exists in cart
      const existingItem = cartItems.find(item => item.shop_item_id === itemId);
      
      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            shop_item_id: itemId,
            quantity: 1
          });

        if (error) throw error;
      }

      await fetchCartItems();
      toast({
        title: "Added to cart",
        description: "Item successfully added to your cart",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setCartLoading(null);
    }
  };

  const updateCartQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      return removeFromCart(cartItemId);
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId);

      if (error) throw error;
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;
      await fetchCartItems();
      toast({
        title: "Removed from cart",
        description: "Item removed from your cart",
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const getCartQuantity = (itemId: string) => {
    const cartItem = cartItems.find(item => item.shop_item_id === itemId);
    return cartItem?.quantity || 0;
  };

  const getTotalCartValue = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.shop_item.price * item.quantity);
    }, 0);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold spiritual-text mb-2">
              🛍️ Spiritual Shop
            </h1>
            <p className="text-muted-foreground text-lg">
              Sacred items for your spiritual journey
            </p>
          </div>
          
          {cartItems.length > 0 && (
            <Card className="spiritual-card mt-4 md:mt-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{cartItems.length} items</span>
                  <Badge className="bg-primary text-primary-foreground">
                    ₹{getTotalCartValue().toFixed(2)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search spiritual items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const cartQuantity = getCartQuantity(item.id);
              return (
                <Card key={item.id} className="spiritual-card overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <Button size="sm" variant="ghost" className="rounded-full bg-white/80 hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        ₹{item.price.toFixed(2)}
                      </span>
                      <Badge variant="secondary">Sacred</Badge>
                    </div>

                    {cartQuantity > 0 ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const cartItem = cartItems.find(ci => ci.shop_item_id === item.id);
                            if (cartItem) {
                              updateCartQuantity(cartItem.id, cartQuantity - 1);
                            }
                          }}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-3 py-1 bg-primary text-primary-foreground rounded font-semibold min-w-[2rem] text-center">
                          {cartQuantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const cartItem = cartItems.find(ci => ci.shop_item_id === item.id);
                            if (cartItem) {
                              updateCartQuantity(cartItem.id, cartQuantity + 1);
                            }
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full spiritual-button"
                        onClick={() => addToCart(item.id)}
                        disabled={cartLoading === item.id}
                      >
                        {cartLoading === item.id ? (
                          "Adding..."
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Card className="spiritual-card shadow-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  <div>
                    <div className="font-semibold">{cartItems.length} items</div>
                    <div className="text-sm text-muted-foreground">₹{getTotalCartValue().toFixed(2)}</div>
                  </div>
                  <Button className="spiritual-button ml-2">
                    Checkout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}