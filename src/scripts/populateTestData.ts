import { supabase } from '@/integrations/supabase/client';

// Sample shop items
const shopItems = [
  {
    name: "Sacred Rudraksha Mala",
    description: "Authentic 108 beads Rudraksha mala for meditation and spiritual practice",
    price: 1499,
    image_url: "/placeholder.svg"
  },
  {
    name: "Brass Ganesha Idol",
    description: "Handcrafted brass Ganesha idol for home temple and daily worship",
    price: 2999,
    image_url: "/placeholder.svg"
  },
  {
    name: "Sandalwood Incense Sticks",
    description: "Premium quality sandalwood incense sticks for aromatic prayers",
    price: 299,
    image_url: "/placeholder.svg"
  },
  {
    name: "Copper Kalash",
    description: "Traditional copper kalash for puja ceremonies and rituals",
    price: 899,
    image_url: "/placeholder.svg"
  },
  {
    name: "Tulsi Plant with Pot",
    description: "Sacred Tulsi plant with decorative pot for spiritual benefits",
    price: 599,
    image_url: "/placeholder.svg"
  },
  {
    name: "Camphor Tablets",
    description: "Pure camphor tablets for aarti and spiritual ceremonies",
    price: 199,
    image_url: "/placeholder.svg"
  },
  {
    name: "Silver Pooja Thali Set",
    description: "Complete silver plated pooja thali set with accessories",
    price: 3499,
    image_url: "/placeholder.svg"
  },
  {
    name: "Bhagavad Gita Book",
    description: "Sacred Bhagavad Gita with Hindi and English translation",
    price: 799,
    image_url: "/placeholder.svg"
  }
];

// Sample pandit profiles (these would need to be created as users first)
const panditProfiles = [
  {
    id: 'sample-pandit-1', // This would be a real user ID
    email: 'pandit1@example.com',
    full_name: 'Pandit Ramesh Sharma',
    is_pandit: true,
    phone: '+91 9876543210',
    address: 'Varanasi, Uttar Pradesh',
    specialization: 'Vedic Rituals, Wedding Ceremonies',
    experience_years: 15,
    rate_per_hour: 2000
  },
  {
    id: 'sample-pandit-2',
    email: 'pandit2@example.com', 
    full_name: 'Pandit Suresh Gupta',
    is_pandit: true,
    phone: '+91 9876543211',
    address: 'Haridwar, Uttarakhand',
    specialization: 'Griha Pravesh, Puja Ceremonies',
    experience_years: 12,
    rate_per_hour: 1800
  },
  {
    id: 'sample-pandit-3',
    email: 'pandit3@example.com',
    full_name: 'Pandit Mahesh Tiwari',
    is_pandit: true,
    phone: '+91 9876543212', 
    address: 'Mathura, Uttar Pradesh',
    specialization: 'Krishna Puja, Bhagavat Katha',
    experience_years: 20,
    rate_per_hour: 2500
  }
];

export async function populateTestData() {
  try {
    console.log('Populating shop items...');
    
    // Insert shop items
    const { error: shopError } = await supabase
      .from('shop_items')
      .insert(shopItems);
    
    if (shopError) {
      console.error('Error inserting shop items:', shopError);
    } else {
      console.log('Shop items inserted successfully!');
    }

    // Note: Pandit profiles would need actual user accounts created first
    console.log('Sample data population completed!');
    console.log('Note: To add pandit profiles, users need to be created first through the auth system.');
    
  } catch (error) {
    console.error('Error populating test data:', error);
  }
}
