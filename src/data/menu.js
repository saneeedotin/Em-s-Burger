export const MENU_CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'classic', label: 'Classic Burgers' },
  { id: 'signatures', label: 'Signatures' },
  { id: 'ufo', label: 'UFO Burgers' },
  { id: 'croissant', label: 'Croissant Takeover' },
  { id: 'pull-me-up', label: 'Pull Me Up' },
  { id: 'avocado', label: 'Avocado Burgers' },
  { id: 'sliders', label: 'Slider Buckets' },
  { id: 'sides', label: 'Sides & Salads' },
  { id: 'cold-drinks', label: 'Cold Beverages' },
  { id: 'hot-drinks', label: 'Hot Beverages' }
];

export const MENU_ITEMS = [
  // CLASSIC BURGERS
  {
    id: "classic-cheeseburger-chicken",
    zomatoLink: "https://zomato.onelink.me/xqzv/ow8j0jlh",
    name: "The Classic Cheeseburger (Chicken)",
    category: "classic",
    isVeg: false,
    isSignature: true,
    description: "Juicy chicken patty, cheddar, veggies, ketchup & mustard",
    price: 329,
    image: "/assets/The classic cheeseburger.png",
    badge: "Bestseller"
  },
  {
    id: "double-stack-burger-chicken",
    zomatoLink: "https://zomato.onelink.me/xqzv/rts3w007",
    name: "Double Stack Burger (Chicken)",
    category: "classic",
    isVeg: false,
    isSignature: true,
    description: "Double patty, double cheese, onions, special sauce",
    price: 389,
    image: "/assets/Double Stack.png",
    badge: "Chef's Pick"
  },
  {
    id: "veggie-classic",
    zomatoLink: "https://zomato.onelink.me/xqzv/58v7ixnm",
    name: "Veggie Classic",
    category: "classic",
    isVeg: true,
    isSignature: false,
    description: "Spicy Aloo patty, cheddar, chipotle mayo",
    price: 299,
    image: "/assets/Veggie classic.png",
    badge: "Pure Veg"
  },
  {
    id: "spicy-classic",
    zomatoLink: "https://zomato.onelink.me/xqzv/p57iwjst",
    name: "Spicy Classic",
    category: "classic",
    isVeg: true,
    isSignature: false,
    description: "Cottage cheese patty, jalapeños, sriracha mayo",
    price: 329,
    image: "/assets/Spicy classic.png",
    badge: "Spicy"
  },

  // SIGNATURES
  {
    id: "the-truffle-mushroom",
    zomatoLink: "https://zomato.onelink.me/xqzv/fasfmxzw",
    name: "The Truffle Mushroom",
    category: "signatures",
    isVeg: true,
    isSignature: true,
    description: "A flavour bomb with parmesan and mozzarella loaded with truffle oil served in our brioche bun",
    price: 429,
    image: "/assets/Truffle Mushroom .png",
    badge: "Gourmet"
  },
  {
    id: "hot-honey-bbq-chicken",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145784872911dac09",
    name: "Hot Honey / BBQ Chicken",
    category: "signatures",
    isVeg: false,
    isSignature: true,
    description: "Crispy fried chicken thigh, hot honey ranch",
    price: 379,
    image: "/assets/Hot honey_ Barbecue Chicken .png",
    badge: "Fan Favorite"
  },
  {
    id: "melt-down",
    zomatoLink: "https://zomato.onelink.me/xqzv/8ei1uy91",
    name: "Melt Down",
    category: "signatures",
    isVeg: false,
    isSignature: true,
    description: "Double smashed chicken patty, cheese trio, sausages, egg, chef's sauce",
    price: 449,
    image: "/assets/Meltdown .png",
    badge: "Must Try"
  },
  {
    id: "breakfast-burger",
    zomatoLink: "https://www.zomato.com/mobile",
    name: "Breakfast Burger",
    category: "signatures",
    isVeg: false,
    isSignature: false,
    description: "Pinwheel croissant, mashed & fried egg, sausages, spicy mayo",
    price: 469,
    image: "/assets/708193355_17892310257525648_910609447071688509_n.jpg"
  },
  {
    id: "thai-fish-burger",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145784893911da9b7",
    name: "Thai Fish Burger",
    category: "signatures",
    isVeg: false,
    isSignature: false,
    description: "Thai spice marinated fish filet, slaw, Sriracha mayo",
    price: 429,
    image: "/assets/Thai fish.png"
  },

  // UFO BURGERS
  {
    id: "ufo-bbq-chicken",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145785171911dad10",
    name: "BBQ Chicken UFO",
    category: "ufo",
    isVeg: false,
    isSignature: true,
    description: "Grilled chicken in BBQ sauce, onions & peppers press-sealed in UFO bun",
    price: 599,
    image: "/assets/708754354_17892310332525648_8596195610652234997_n.jpg",
    badge: "UFO Sealed"
  },
  {
    id: "ufo-juicy-lucy-potato",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145785194911dad2d",
    name: "Juicy Lucy (Potato) UFO",
    category: "ufo",
    isVeg: true,
    isSignature: false,
    description: "Molten cheese-center potato patty sealed inside press-toasted UFO saucer",
    price: 529,
    image: "/assets/708877450_17892310341525648_1301759277739848721_n.jpg"
  },
  {
    id: "ufo-juicy-lucy-chicken",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145785186911daf18",
    name: "Juicy Lucy (Chicken) UFO",
    category: "ufo",
    isVeg: false,
    isSignature: false,
    description: "Chicken patty with molten cheese center in press-sealed saucer",
    price: 599,
    image: "/assets/708468998_17892310314525648_8171975173938103261_n.jpg"
  },
  {
    id: "ufo-mumbai",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145785211911daec2",
    name: "Mumbai UFO",
    category: "ufo",
    isVeg: true,
    isSignature: true,
    description: "Batata vada, cheddar, lasun chutney, fried chillies sealed in crispy UFO bun",
    price: 469,
    image: "/assets/THECHA BURGER.png",
    badge: "Local Fusion"
  },

  // CROISSANT TAKEOVER
  {
    id: "croissant-chicken",
    zomatoLink: "https://zomato.onelink.me/xqzv/bzjl0h5p",
    name: "Chicken Croissant Takeover",
    category: "croissant",
    isVeg: false,
    isSignature: false,
    description: "Smashed chicken patty, caramelised onion, melted cheddar, slaw in butter croissant",
    price: 389,
    image: "/assets/Croissant Takeover .png"
  },
  {
    id: "croissant-lamb",
    zomatoLink: "https://zomato.onelink.me/xqzv/azswdf1c",
    name: "Lamb Croissant Takeover",
    category: "croissant",
    isVeg: false,
    isSignature: true,
    description: "Smashed lamb patty, caramelised onion, melted cheddar, slaw in butter croissant",
    price: 489,
    image: "/assets/708959483_17892310293525648_1117848264840887243_n.jpg",
    badge: "Premium Lamb"
  },
  {
    id: "croissant-veg",
    zomatoLink: "https://www.zomato.com/mobile",
    name: "Veg (Cottage Cheese Crumble) Croissant",
    category: "croissant",
    isVeg: true,
    isSignature: false,
    description: "Cottage cheese crumble, cheese, onion, slaw in butter croissant",
    price: 379,
    image: "/assets/Croissant Takeover .png"
  },

  // PULL ME UP BURGERS
  {
    id: "pmu-chicken",
    zomatoLink: "https://www.zomato.com/mobile",
    name: "Pull Me Up (Chicken)",
    category: "pull-me-up",
    isVeg: false,
    isSignature: true,
    description: "Brioche bun, grilled chicken patty, lettuce, 3-cheese fondue cascade",
    price: 429,
    image: "/assets/Pull me up.png",
    badge: "Molten Cheese"
  },
  {
    id: "pmu-cottage-cheese",
    zomatoLink: "https://www.zomato.com/mobile",
    name: "Pull Me Up (Cottage Cheese)",
    category: "pull-me-up",
    isVeg: true,
    isSignature: true,
    description: "Brioche bun, grilled cottage cheese patty, 3-cheese fondue cascade",
    price: 379,
    image: "/assets/Pull me up.png",
    badge: "Veg Fondue"
  },

  // AVOCADO BURGER
  {
    id: "avocado-veggie",
    zomatoLink: "https://www.zomato.com/mobile",
    name: "Veggie Avocado Burger",
    category: "avocado",
    isVeg: true,
    isSignature: false,
    description: "Veggie patty, avocado mash, hot salsa, cheese, tortilla chips",
    price: 399,
    image: "/assets/Veggie Avacado.png"
  },

  // SLIDER BUCKETS
  {
    id: "slider-bucket-3",
    zomatoLink: "https://www.zomato.com/mobile",
    name: "3 Sliders Bucket",
    category: "sliders",
    isVeg: false,
    isSignature: false,
    description: "Trio of mini smash sliders served with signature dipping sauces (Veg ₹279 / Chicken ₹319 / Lamb ₹359)",
    price: 319,
    image: "/assets/Untitled - 23 May 2026 at 20.01.19.png",
    badge: "Shareable"
  },
  {
    id: "slider-bucket-6",
    zomatoLink: "https://www.zomato.com/mobile",
    name: "6 Sliders Party Bucket",
    category: "sliders",
    isVeg: false,
    isSignature: false,
    description: "6 mini smash sliders served with signature house sauces (Veg ₹499 / Chicken ₹549 / Lamb ₹599)",
    price: 549,
    image: "/assets/Untitled - 23 May 2026 at 20.01.19.png"
  },

  // SIDES & SALADS
  {
    id: "fries-salted-periperi",
    zomatoLink: "https://zomato.onelink.me/xqzv/5bo6grab",
    name: "Fries (Salted / Peri Peri)",
    category: "sides",
    isVeg: true,
    isSignature: false,
    description: "Served with Em's Special Sauce",
    price: 149,
    image: "/assets/Salted fries.png"
  },
  {
    id: "truffle-fries",
    zomatoLink: "https://zomato.onelink.me/xqzv/7yd69ui2",
    name: "Truffle Fries",
    category: "sides",
    isVeg: true,
    isSignature: true,
    description: "Truffle oil, parmesan, herbs on crispy golden fries",
    price: 249,
    image: "/assets/Truffle Fries.png",
    badge: "Truffle"
  },
  {
    id: "destroyed-fries",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629389911da2d4",
    name: "Destroyed Fries",
    category: "sides",
    isVeg: false,
    isSignature: true,
    description: "Loaded fries with cheese, sauce, fried chicken / mozzarella",
    price: 299,
    image: "/assets/Destroyed Fries.png",
    badge: "Loaded"
  },
  {
    id: "deep-fried-mac-cheese",
    zomatoLink: "https://zomato.onelink.me/xqzv/m7jiau8w",
    name: "Deep-Fried Mac & Cheese",
    category: "sides",
    isVeg: true,
    isSignature: false,
    description: "Served with sweet chilli sauce",
    price: 249,
    image: "/assets/Mac and Cheese.png"
  },
  {
    id: "chicken-tenders-3pcs",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629360911da62d",
    name: "Chicken Tenders (3 Pcs)",
    category: "sides",
    isVeg: false,
    isSignature: false,
    description: "Crispy fried tender strips served with dip (3/6/9/12 pcs options available)",
    price: 229,
    image: "/assets/Chicken tenders.png"
  },
  {
    id: "ems-house-salad",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629222911daff7",
    name: "Em's House Salad",
    category: "sides",
    isVeg: true,
    isSignature: false,
    description: "Lettuce, diced veggies, avocado, seeds, house dressing (+Add Egg/Sausages/Cottage Cheese)",
    price: 299,
    image: "/assets/Veggie Avacado.png"
  },

  // COLD BEVERAGES
  {
    id: "strawberry-pop",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629716911da500",
    name: "Strawberry Pop",
    category: "cold-drinks",
    isVeg: true,
    isSignature: false,
    description: "Refreshing cold fruit beverage",
    price: 239,
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "choco-blast",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629556911dae34",
    name: "Choco Blast Shake",
    category: "cold-drinks",
    isVeg: true,
    isSignature: true,
    description: "Rich chocolate thickshake topped with cocoa sprinkles",
    price: 229,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    badge: "Thick Shake"
  },
  {
    id: "banana-slide",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629529911da188",
    name: "Banana Slide Shake",
    category: "cold-drinks",
    isVeg: true,
    isSignature: false,
    description: "Smooth banana shake blended with ice cream",
    price: 199,
    image: "https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "mango-mash",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629663911da24e",
    name: "Mango Mash",
    category: "cold-drinks",
    isVeg: true,
    isSignature: false,
    description: "Alphonso mango pulp blended iced drink",
    price: 249,
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "vanilla-storm",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629729911da98f",
    name: "Vanilla Storm",
    category: "cold-drinks",
    isVeg: true,
    isSignature: false,
    description: "Classic creamy vanilla bean shake",
    price: 209,
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bcc4?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "coffee-kick",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629621911da742",
    name: "Coffee Kick Cold Coffee",
    category: "cold-drinks",
    isVeg: true,
    isSignature: true,
    description: "Double shot espresso whipped with cold milk & ice cream",
    price: 219,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
    badge: "Chilled Coffee"
  },
  {
    id: "coke-sprite-diet",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629774911da84c",
    name: "Coke / Sprite / Diet Coke",
    category: "cold-drinks",
    isVeg: true,
    isSignature: false,
    description: "Chilled soft drink (330ml)",
    price: 69,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80"
  },

  // HOT BEVERAGES
  {
    id: "dark-chocolate",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629633911dabff",
    name: "Dark Chocolate Hot Brew",
    category: "hot-drinks",
    isVeg: true,
    isSignature: true,
    description: "Intense, bittersweet cocoa indulgence for true chocolate lovers",
    price: 219,
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80",
    badge: "Hot Brew"
  },
  {
    id: "milk-chocolate",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629679911daa81",
    name: "Milk Chocolate Hot Brew",
    category: "hot-drinks",
    isVeg: true,
    isSignature: false,
    description: "Classic creamy comfort with a perfect touch of sweetness",
    price: 219,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "white-chocolate",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629753911dadf6",
    name: "White Chocolate Hot Brew",
    category: "hot-drinks",
    isVeg: true,
    isSignature: false,
    description: "Silky and sweet with the buttery richness of white chocolate",
    price: 219,
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cappuccino",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629543911da4ec",
    name: "Cappuccino",
    category: "hot-drinks",
    isVeg: true,
    isSignature: false,
    description: "A rich espresso topped with velvety steamed milk and a cloud of frothy foam",
    price: 199,
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "latte",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629649911da984",
    name: "Latte",
    category: "hot-drinks",
    isVeg: true,
    isSignature: false,
    description: "Smooth espresso blended with creamy steamed milk for a perfectly balanced cup",
    price: 189,
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "mocha",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629698911da7c8",
    name: "Mocha",
    category: "hot-drinks",
    isVeg: true,
    isSignature: false,
    description: "A decadent fusion of espresso and chocolate, crowned with creamy milk",
    price: 229,
    image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "americano",
    zomatoLink: "https://link.zomato.com/xqzv/dshare?id=145629462911dabc1",
    name: "Americano",
    category: "hot-drinks",
    isVeg: true,
    isSignature: false,
    description: "Bold and smooth black coffee with a rich, robust flavor",
    price: 169,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
  }
];
