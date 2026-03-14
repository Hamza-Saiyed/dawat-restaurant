export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  badge?: string;
  image: string;
}

export const menuCategories = [
  "All",
  "Starters",
  "Main Course",
  "Biryani",
  "Tandoor",
  "Desserts",
  "Beverages"
];

const API_IMAGES = {
  starter_roll: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600",
  tikka: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600",
  kebab: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600",
  curry: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=600",
  butter_chicken: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=600",
  biryani: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600",
  naan: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=600",
  dessert: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600",
  lassi: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=600"
};

export const menuData: MenuItem[] = [
  // STARTERS
  {
    id: "s1", name: "Veg Spring Roll", price: 160, category: "Starters",
    description: "Crispy rolls stuffed with seasoned vegetables", image: API_IMAGES.starter_roll, badge: "Veg"
  },
  {
    id: "s2", name: "Paneer Tikka", price: 260, category: "Starters",
    description: "Cottage cheese marinated in spiced yogurt, grilled in tandoor", image: API_IMAGES.tikka, badge: "Chef Special"
  },
  {
    id: "s3", name: "Chicken Tikka", price: 300, category: "Starters",
    description: "Tender chicken chunks in aromatic spices, char-grilled", image: API_IMAGES.kebab
  },
  {
    id: "s4", name: "Seekh Kebab", price: 280, category: "Starters",
    description: "Minced meat with herbs on skewers, smoky tandoor finish", image: API_IMAGES.kebab, badge: "Signature"
  },
  {
    id: "s5", name: "Hara Bhara Kebab", price: 200, category: "Starters",
    description: "Green spinach & pea patties with mint chutney", image: API_IMAGES.starter_roll
  },
  {
    id: "s6", name: "Dahi Ke Kebab", price: 220, category: "Starters",
    description: "Creamy hung curd kebabs with a crispy exterior", image: API_IMAGES.starter_roll
  },

  // MAIN COURSE
  {
    id: "m1", name: "Dal Makhani", price: 220, category: "Main Course",
    description: "Slow-cooked black lentils in rich tomato-butter gravy", image: API_IMAGES.curry, badge: "Must Try"
  },
  {
    id: "m2", name: "Butter Chicken", price: 320, category: "Main Course",
    description: "Tender chicken in velvety tomato-cream sauce", image: API_IMAGES.butter_chicken, badge: "Bestseller"
  },
  {
    id: "m3", name: "Paneer Butter Masala", price: 280, category: "Main Course",
    description: "Soft paneer in luscious butter-tomato gravy", image: API_IMAGES.curry
  },
  {
    id: "m4", name: "Kadai Chicken", price: 340, category: "Main Course",
    description: "Chicken with bell peppers in robust kadai masala", image: API_IMAGES.curry
  },
  {
    id: "m5", name: "Mutton Rogan Josh", price: 420, category: "Main Course",
    description: "Kashmiri spiced slow-cooked tender mutton", image: API_IMAGES.curry
  },
  {
    id: "m6", name: "Shahi Paneer", price: 300, category: "Main Course",
    description: "Royal paneer in cashew-cream saffron gravy", image: API_IMAGES.curry
  },
  {
    id: "m7", name: "Chole Bhature", price: 180, category: "Main Course",
    description: "Spiced chickpeas with fluffy deep-fried bread", image: API_IMAGES.curry
  },
  {
    id: "m8", name: "Palak Paneer", price: 260, category: "Main Course",
    description: "Fresh cottage cheese cubes in creamy spinach gravy", image: API_IMAGES.curry
  },

  // BIRYANI
  {
    id: "b1", name: "Chicken Biryani", price: 350, category: "Biryani",
    description: "Fragrant basmati rice layered with spiced chicken, slow dum cooked", image: API_IMAGES.biryani, badge: "Bestseller"
  },
  {
    id: "b2", name: "Mutton Biryani", price: 450, category: "Biryani",
    description: "Tender mutton pieces with aromatic rice and saffron", image: API_IMAGES.biryani
  },
  {
    id: "b3", name: "Veg Biryani", price: 280, category: "Biryani",
    description: "Seasonal vegetables with basmati rice and whole spices", image: API_IMAGES.biryani
  },
  {
    id: "b4", name: "Paneer Biryani", price: 320, category: "Biryani",
    description: "Cottage cheese with flavored basmati, mint and fried onions", image: API_IMAGES.biryani
  },
  {
    id: "b5", name: "Egg Biryani", price: 300, category: "Biryani",
    description: "Boiled eggs layered with spiced biryani rice", image: API_IMAGES.biryani
  },

  // TANDOOR
  {
    id: "t1", name: "Tandoori Roti", price: 30, category: "Tandoor",
    description: "Whole wheat bread baked fresh in clay oven", image: API_IMAGES.naan
  },
  {
    id: "t2", name: "Butter Naan", price: 50, category: "Tandoor",
    description: "Soft leavened bread with generous butter finish", image: API_IMAGES.naan
  },
  {
    id: "t3", name: "Garlic Naan", price: 60, category: "Tandoor",
    description: "Naan topped with fresh garlic and cilantro", image: API_IMAGES.naan
  },
  {
    id: "t4", name: "Tandoori Chicken", price: 380, category: "Tandoor",
    description: "Half chicken marinated overnight, roasted in clay oven", image: API_IMAGES.tikka, badge: "Signature"
  },
  {
    id: "t5", name: "Fish Tikka", price: 360, category: "Tandoor",
    description: "Fresh fish fillet in carom-spiced marinade, tandoor grilled", image: API_IMAGES.tikka
  },
  {
    id: "t6", name: "Paneer Malai Tikka", price: 280, category: "Tandoor",
    description: "Cottage cheese in creamy cashew marinade, delicately grilled", image: API_IMAGES.tikka
  },

  // DESSERTS
  {
    id: "d1", name: "Gulab Jamun", price: 120, category: "Desserts",
    description: "Soft milk-solid dumplings in rose-cardamom sugar syrup", image: API_IMAGES.dessert
  },
  {
    id: "d2", name: "Rasgulla", price: 110, category: "Desserts",
    description: "Spongy chenna balls in light sugar syrup", image: API_IMAGES.dessert
  },
  {
    id: "d3", name: "Kheer", price: 130, category: "Desserts",
    description: "Slow-cooked rice pudding with saffron and pistachios", image: API_IMAGES.dessert
  },
  {
    id: "d4", name: "Kulfi", price: 150, category: "Desserts",
    description: "Traditional frozen dessert with saffron and nuts", image: API_IMAGES.dessert
  },
  {
    id: "d5", name: "Gajar Ka Halwa", price: 160, category: "Desserts",
    description: "Slow-cooked carrot pudding with ghee and dry fruits", image: API_IMAGES.dessert
  },
  {
    id: "d6", name: "Shahi Tukda", price: 180, category: "Desserts",
    description: "Fried bread in rich rabri with saffron and nuts", image: API_IMAGES.dessert
  },

  // BEVERAGES
  {
    id: "v1", name: "Mango Lassi", price: 120, category: "Beverages",
    description: "Thick creamy yogurt blended with sweet Alphonso mango", image: API_IMAGES.lassi
  },
  {
    id: "v2", name: "Sweet Lassi", price: 90, category: "Beverages",
    description: "Classic chilled yogurt drink with rose water", image: API_IMAGES.lassi
  },
  {
    id: "v3", name: "Masala Chai", price: 60, category: "Beverages",
    description: "Spiced tea with ginger, cardamom and fresh milk", image: API_IMAGES.lassi
  },
  {
    id: "v4", name: "Fresh Lime Soda", price: 80, category: "Beverages",
    description: "Sparkling water with fresh lime and a hint of salt", image: API_IMAGES.lassi
  },
  {
    id: "v5", name: "Jaljeera", price: 70, category: "Beverages",
    description: "Refreshing cumin-infused chilled drink with mint", image: API_IMAGES.lassi
  },
  {
    id: "v6", name: "Cold Coffee", price: 140, category: "Beverages",
    description: "Chilled blend of coffee, milk and vanilla ice cream", image: API_IMAGES.lassi
  }
];
