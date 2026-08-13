import { createClient } from '@supabase/supabase-js';
import { MENU_CATEGORIES, MENU_ITEMS } from '../src/data/menu.js';

// The script assumes you run it with Node > 20 and --env-file=.env.local
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log("Seeding Menu Categories...");
  const { error: catError } = await supabase
    .from('menu_categories')
    .upsert(MENU_CATEGORIES, { onConflict: 'id' });

  if (catError) {
    console.error("Error inserting categories:", catError);
    return;
  }
  console.log("Categories seeded successfully.");

  console.log("Seeding Menu Items...");
  // We remove zomatoLink if we don't store it, but let's just insert as is.
  // Actually, we should map them to ensure exact schema match.
  const mappedItems = MENU_ITEMS.map(item => ({
    id: item.id,
    name: item.name,
    category: item.category,
    price: item.price,
    description: item.description,
    isVeg: item.isVeg || false,
    isSignature: item.isSignature || false,
    badge: item.badge || null,
    image: item.img || null
  }));

  const { error: itemError } = await supabase
    .from('menu_items')
    .upsert(mappedItems, { onConflict: 'id' });

  if (itemError) {
    console.error("Error inserting items:", itemError);
    return;
  }
  console.log("Items seeded successfully.");
}

seed().catch(console.error);
