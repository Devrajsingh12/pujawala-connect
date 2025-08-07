import { supabase } from './src/integrations/supabase/client.ts';

// Sample shop items data
const shopItems = [
  {
    name: "Sacred Rudraksha Mala",
    description: "Authentic 108 beads Rudraksha mala for meditation and spiritual practice. Made from genuine Rudraksha seeds.",
    price: 1499,
    image_url: "/placeholder.svg"
  },
  {
    name: "Brass Ganesha Idol",
    description: "Handcrafted brass Ganesha idol for home temple and daily worship. Height: 6 inches.",
    price: 2999,
    image_url: "/placeholder.svg"
  },
  {
    name: "Sandalwood Incense Sticks",
    description: "Premium quality sandalwood incense sticks for aromatic prayers. Pack of 50 sticks.",
    price: 299,
    image_url: "/placeholder.svg"
  },
  {
    name: "Copper Kalash",
    description: "Traditional copper kalash for puja ceremonies and rituals. Ideal for festivals.",
    price: 899,
    image_url: "/placeholder.svg"
  },
  {
    name: "Tulsi Plant with Pot",
    description: "Sacred Tulsi plant with decorative terracotta pot for spiritual benefits and daily worship.",
    price: 599,
    image_url: "/placeholder.svg"
  },
  {
    name: "Pure Camphor Tablets",
    description: "Pure camphor tablets for aarti and spiritual ceremonies. Pack of 20 tablets.",
    price: 199,
    image_url: "/placeholder.svg"
  },
  {
    name: "Silver Pooja Thali Set",
    description: "Complete silver plated pooja thali set with diya, incense holder, and accessories.",
    price: 3499,
    image_url: "/placeholder.svg"
  },
  {
    name: "Bhagavad Gita Book",
    description: "Sacred Bhagavad Gita with Hindi and English translation. Hardcover edition.",
    price: 799,
    image_url: "/placeholder.svg"
  },
  {
    name: "Marble Shiva Lingam",
    description: "Beautiful marble Shiva Lingam for home temple worship. Hand-carved with base.",
    price: 1899,
    image_url: "/placeholder.svg"
  },
  {
    name: "Crystal Mala Beads",
    description: "Clear crystal mala with 108 beads for meditation and chanting. Authentic healing crystals.",
    price: 999,
    image_url: "/placeholder.svg"
  },
  {
    name: "Brass Oil Lamp (Diya)",
    description: "Traditional brass oil lamp for daily aarti and festivals. Decorative design.",
    price: 399,
    image_url: "/placeholder.svg"
  },
  {
    name: "Kumkum and Turmeric Set",
    description: "Organic kumkum and turmeric powder set for tilaka and religious ceremonies.",
    price: 149,
    image_url: "/placeholder.svg"
  }
];

async function populateShopItems() {
  try {
    console.log('🛍️ Adding shop items to database...');
    
    // Check if items already exist
    const { data: existingItems } = await supabase
      .from('shop_items')
      .select('id')
      .limit(1);
    
    if (existingItems && existingItems.length > 0) {
      console.log('✅ Shop items already exist in database');
      return;
    }
    
    // Insert shop items
    const { data, error } = await supabase
      .from('shop_items')
      .insert(shopItems)
      .select();
    
    if (error) {
      console.error('❌ Error inserting shop items:', error);
      return;
    }
    
    console.log(`✅ Successfully added ${data.length} shop items!`);
    console.log('🎉 You can now browse the shop and add items to cart!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Create some sample pandit profiles if user signs up as pandit
async function createSamplePanditProfile(userId: string, email: string) {
  const panditData = {
    id: userId,
    email: email,
    full_name: "Pandit Demo User",
    is_pandit: true,
    phone: "+91 9876543210",
    address: "Varanasi, Uttar Pradesh",
    specialization: "Vedic Rituals, Puja Ceremonies",
    experience_years: 10,
    rate_per_hour: 1500
  };
  
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert(panditData);
    
    if (error) {
      console.error('Error creating pandit profile:', error);
    } else {
      console.log('✅ Sample pandit profile created!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the population script
populateShopItems();

export { createSamplePanditProfile };
