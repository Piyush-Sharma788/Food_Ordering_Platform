export interface SeedRestaurant {
  name: string;
  slug: string;
  description: string;
  category: 'Canteen' | 'Cafe' | 'Dhaba' | 'Fast Food';
  rating: number;
  reviewCount: number;
  imageUrl: string;
  location: string;
  openingHours: string;
}

export interface SeedMenuItem {
  name: string;
  slug: string;
  description: string;
  price: number;
  prepTime: number; // minutes
  category: string;
  imageUrl: string;
  isVegetarian: boolean;
  tags: string[];
}

export const SEED_RESTAURANTS: SeedRestaurant[] = [
  {
    name: 'Campus Canteen',
    slug: 'campus-canteen',
    description: 'Quick bites, hot beverages, and affordable meals for students and faculty.',
    category: 'Canteen',
    rating: 4.0,
    reviewCount: 128,
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/f/f2/Infosys.Electronic.City.Cafeteria.JPG',
    location: 'Central Academic Block, Ground Floor',
    openingHours: '08:00 AM - 09:30 PM',
  },
  {
    name: 'Cozy Corner Cafe',
    slug: 'cozy-corner-cafe',
    description: 'Artisanal coffee, freshly baked pastries, shakes, and quiet study ambience.',
    category: 'Cafe',
    rating: 4.8,
    reviewCount: 94,
    imageUrl:
      'https://i.pinimg.com/originals/12/9a/e9/129ae98061ea7c76045537099661424a.jpg',
    location: 'Student Activity Center, 1st Floor',
    openingHours: '09:00 AM - 10:30 PM',
  },
  {
    name: 'Highway Dhaba',
    slug: 'highway-dhaba',
    description: 'Authentic roadside cuisine, masaledar snacks, and hearty parathas with a homely touch.',
    category: 'Dhaba',
    rating: 4.2,
    reviewCount: 76,
    imageUrl:
      'https://lh5.googleusercontent.com/p/AF1QipMDr1iZy8sy82CFGVnOFvze8ejLs3UdILvz8Rpo=w1080-k-no',
    location: 'North Campus Gate, Food Street',
    openingHours: '11:00 AM - 11:00 PM',
  },
];

export const SEED_MENU_ITEMS: SeedMenuItem[] = [
  // Beverages & Shakes
  {
    name: 'Vanilla Shake',
    slug: 'vanilla-shake',
    description: 'Fuel your potential with every sip. Creamy rich vanilla milkshake.',
    price: 65,
    prepTime: 4,
    category: 'Beverages',
    imageUrl:
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/12/classic-vanilla-milkshake-9e7745f.jpg?quality=90&resize=544,494',
    isVegetarian: true,
    tags: ['shake', 'vanilla', 'sweet', 'cold'],
  },
  {
    name: 'Strawberry Shake',
    slug: 'strawberry-shake',
    description: 'Flavor that makes you happy. Fresh strawberry puree blended with creamy milk.',
    price: 70,
    prepTime: 4,
    category: 'Beverages',
    imageUrl: 'https://uproxx.com/wp-content/uploads/2022/06/desserts-shakes-and-sides.jpg',
    isVegetarian: true,
    tags: ['shake', 'strawberry', 'fruity', 'cold'],
  },
  {
    name: 'Chocolate Shake',
    slug: 'chocolate-shake',
    description: 'The taste of our childhood with deep Dutch chocolate and milk.',
    price: 90,
    prepTime: 4,
    category: 'Beverages',
    imageUrl:
      'https://pintsizedbaker.com/wp-content/uploads/2013/08/Triple-Chocolate-Milkshakes-9.jpg.webp',
    isVegetarian: true,
    tags: ['shake', 'chocolate', 'rich', 'cold'],
  },
  {
    name: 'Hot Coffee',
    slug: 'hot-coffee',
    description: 'Relax your mind with a freshly brewed hot cup of aromatic espresso.',
    price: 25,
    prepTime: 3,
    category: 'Beverages',
    imageUrl:
      'https://media.gettyimages.com/id/1133425883/photo/espresso-coffee-maker.jpg?s=612x612&w=0&k=20&c=I3FB-elrUmfWF9fbrawxmqEjdNGD9mWTBs_6oU6TzpM=',
    isVegetarian: true,
    tags: ['coffee', 'hot', 'caffeine', 'budget'],
  },
  {
    name: 'Hot Hazelnut Coffee',
    slug: 'hot-hazelnut-coffee',
    description: 'Add some nutty flavor to your study breaks with premium hazelnut syrup.',
    price: 30,
    prepTime: 4,
    category: 'Beverages',
    imageUrl: 'https://artofpalate.com/wp-content/uploads/2015/03/coffee-photography.jpg',
    isVegetarian: true,
    tags: ['coffee', 'hazelnut', 'hot', 'flavored'],
  },
  {
    name: 'Cold Coffee',
    slug: 'cold-coffee',
    description: 'Chill your mind with a frothy, chilled espresso blend.',
    price: 50,
    prepTime: 5,
    category: 'Beverages',
    imageUrl:
      'https://t4.ftcdn.net/jpg/08/98/59/97/360_F_898599792_EijVasZ8S4YDQko5eIy2Xe17eF32Up6d.jpg',
    isVegetarian: true,
    tags: ['coffee', 'cold', 'refreshing'],
  },
  {
    name: 'Hazelnut Cold Coffee',
    slug: 'hazelnut-cold-coffee',
    description: 'Flavorful secrets unveiled in an iced hazelnut brew.',
    price: 60,
    prepTime: 5,
    category: 'Beverages',
    imageUrl:
      'https://www.nickandalicia.com/wp-content/uploads/2017/06/Vanilla-Hazelnut-Iced-Coffee-2727.jpg',
    isVegetarian: true,
    tags: ['coffee', 'hazelnut', 'cold'],
  },

  // Snacks & Burgers
  {
    name: 'Paneer Burger',
    slug: 'paneer-burger',
    description: 'Sizzle, stack, and savor with a crispy spiced paneer patty and lettuce.',
    price: 75,
    prepTime: 10,
    category: 'Snacks',
    imageUrl: 'https://celebrationgeneration.com/wp-content/uploads/2013/05/Paneer-Burgers-8.jpg',
    isVegetarian: true,
    tags: ['burger', 'paneer', 'popular'],
  },
  {
    name: 'Grilled Sandwich',
    slug: 'grilled-sandwich',
    description: 'Good sandwich brings good mood. Golden toasted with veggies and butter.',
    price: 55,
    prepTime: 10,
    category: 'Snacks',
    imageUrl:
      'https://www.honeywhatscooking.com/wp-content/uploads/2022/06/Bombay-Grilled-Sandwich20-780x556.jpg',
    isVegetarian: true,
    tags: ['sandwich', 'grilled', 'crispy'],
  },
  {
    name: 'Paneer Sandwich',
    slug: 'paneer-sandwich',
    description: 'Big bite, little money. Loaded with marinated spiced cottage cheese.',
    price: 70,
    prepTime: 10,
    category: 'Snacks',
    imageUrl:
      'https://thumbs.dreamstime.com/b/grilled-paneer-sandwich-indian-style-close-up-136677968.jpg',
    isVegetarian: true,
    tags: ['sandwich', 'paneer', 'filling'],
  },
  {
    name: 'Cheese Bun',
    slug: 'cheese-bun',
    description: 'Bite into cheese bliss. Soft warmed bun with melted mozzarella and herbs.',
    price: 35,
    prepTime: 6,
    category: 'Snacks',
    imageUrl: 'https://breadsandsweets.com/wp-content/uploads/2021/05/cheese-buns-pic-2.jpg',
    isVegetarian: true,
    tags: ['bun', 'cheese', 'quick'],
  },
  {
    name: 'French Fries',
    slug: 'french-fries',
    description: 'Handmade, heartfelt, hearty salted golden potato fries with dip.',
    price: 50,
    prepTime: 6,
    category: 'Snacks',
    imageUrl:
      'https://img.freepik.com/premium-photo/fries-french-fries-with-tomato-sauce-sweet-potato-finger-chips-golden-frenchfried-potatoes_162695-47326.jpg?size=626&ext=jpg',
    isVegetarian: true,
    tags: ['fries', 'crispy', 'classic'],
  },
  {
    name: 'Chilly Potato Gravy',
    slug: 'chilly-potato-gravy',
    description: 'The land of juicy delights. Crispy potato fingers tossed in spicy gravy.',
    price: 65,
    prepTime: 7,
    category: 'Chinese & Indo-Chinese',
    imageUrl:
      'https://storage.googleapis.com/cscom-2019.appspot.com/uploads/2018/10/crispy-honey-chilli-potatoes-recipe.jpg',
    isVegetarian: true,
    tags: ['chilly', 'spicy', 'gravy'],
  },
  {
    name: 'Chilly Paneer',
    slug: 'chilly-paneer',
    description: 'Deliciously yours: golden paneer cubes tossed with peppers and scallions.',
    price: 80,
    prepTime: 6,
    category: 'Chinese & Indo-Chinese',
    imageUrl:
      'https://img.freepik.com/premium-photo/spicy-paneer-tikka-with-garnish-finely-chopped_1169880-193442.jpg?size=626&ext=jpg',
    isVegetarian: true,
    tags: ['paneer', 'spicy', 'indo-chinese'],
  },

  // Noodles & Momos
  {
    name: 'Maggie Masaledar',
    slug: 'maggie-masaledar',
    description: 'Maggie crafted with student passion and perfection. Spicy and piping hot.',
    price: 60,
    prepTime: 10,
    category: 'Noodles & Momos',
    imageUrl:
      'https://c.ndtvimg.com/2023-10/8pr6ki28_maggi_625x300_17_October_23.jpg?im=FaceCrop,algorithm=dnn,width=540,height=720',
    isVegetarian: true,
    tags: ['maggie', 'hostel-favorite', 'comfort'],
  },
  {
    name: 'Chilly Paneer Maggie',
    slug: 'chilly-paneer-maggie',
    description: 'Step into maggie wonderland with seasoned paneer bites and spices.',
    price: 70,
    prepTime: 10,
    category: 'Noodles & Momos',
    imageUrl:
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgWTTICqqgdwS81XYfVuxLvniT2p2H6EYjnCF2W-TZuSAmT3aYy3qMfl0Xl1l_8cduSv4Z5vIGR5NjLarPVOih3Mu82Zzm202Pdmxwkz3mnU4duD-emSwb7A13lYEZlpd26QpKnbVaVz0k/s1600/MAggi-paneer-noodles.jpg',
    isVegetarian: true,
    tags: ['maggie', 'paneer', 'fusion'],
  },
  {
    name: 'Noodles',
    slug: 'noodles',
    description: 'Where noodles meet culinary excellence: wok-tossed street style noodles.',
    price: 50,
    prepTime: 10,
    category: 'Noodles & Momos',
    imageUrl:
      'https://t3.ftcdn.net/jpg/05/86/52/76/360_F_586527672_o5bIef6WQPFTovbTlZ7yhjb6AV0M0iSG.jpg',
    isVegetarian: true,
    tags: ['noodles', 'chowmein', 'chinese'],
  },
  {
    name: 'Paneer Noodles',
    slug: 'paneer-noodles',
    description: 'A flavorful journey into noodle paradise loaded with soft cottage cheese.',
    price: 70,
    prepTime: 12,
    category: 'Noodles & Momos',
    imageUrl:
      'https://herbivorecucina.com/wp-content/uploads/2015/06/Paneer-Chili-Noodles-1-1024x1024.jpg',
    isVegetarian: true,
    tags: ['noodles', 'paneer', 'filling'],
  },
  {
    name: 'Steam Momos (4 pc)',
    slug: 'steam-momos',
    description: 'Momos filled with smiles and happiness. Steamed vegetable dumplings with spicy red chutney.',
    price: 30,
    prepTime: 5,
    category: 'Noodles & Momos',
    imageUrl: 'https://h7.alamy.com/comp/2GTKMRA/steam-momo-2GTKMRA.jpg',
    isVegetarian: true,
    tags: ['momos', 'steamed', 'dumplings'],
  },
  {
    name: 'Fried Momos (4 pc)',
    slug: 'fried-momos',
    description: 'Dough wrapped with savory spiced veggies, deep fried till golden crunch.',
    price: 40,
    prepTime: 6,
    category: 'Noodles & Momos',
    imageUrl:
      'https://media.istockphoto.com/id/1341504203/photo/fried-momos-dumpling.jpg?s=612x612&w=0&k=20&c=mCUGBqUZw1M7Eu8Bh232by22Q5xKuhJkPG1h6BenbRs=',
    isVegetarian: true,
    tags: ['momos', 'fried', 'crispy'],
  },

  // Pizzas & South Indian
  {
    name: 'Kulhad Pizza',
    slug: 'kulhad-pizza',
    description: 'Baked in an authentic earthen clay pot with cheese, fresh veggies and petrichor aroma.',
    price: 140,
    prepTime: 15,
    category: 'Pizza & Specials',
    imageUrl: 'https://www.temptingtreat.com/wp-content/uploads/2022/11/DSC_1831-copy-300x300.jpg',
    isVegetarian: true,
    tags: ['pizza', 'kulhad', 'trending', 'cheese'],
  },
  {
    name: 'Cheese Corn Pizza',
    slug: 'cheese-corn-pizza',
    description: 'Slice into a world of flavor with golden sweet corn and gooey mozzarella.',
    price: 145,
    prepTime: 15,
    category: 'Pizza & Specials',
    imageUrl:
      'https://img.freepik.com/free-photo/high-angle-pizza-with-cheese-cutlery_23-2148765336.jpg?size=626&ext=jpg',
    isVegetarian: true,
    tags: ['pizza', 'cheese', 'corn'],
  },
  {
    name: 'Onion Capsicum Pizza',
    slug: 'onion-capsicum-pizza',
    description: 'Some slices make you smile. Crispy red onions and fresh green bell peppers.',
    price: 160,
    prepTime: 15,
    category: 'Pizza & Specials',
    imageUrl:
      'https://img.freepik.com/free-photo/vegetarian-pizza_1388-641.jpg?size=626&ext=jpg',
    isVegetarian: true,
    tags: ['pizza', 'veggie', 'crispy'],
  },
  {
    name: 'Paneer Pizza',
    slug: 'paneer-pizza',
    description: 'Generously topped with tandoori-marinated paneer chunks, herbs, and cheese.',
    price: 170,
    prepTime: 15,
    category: 'Pizza & Specials',
    imageUrl:
      'https://carameltintedlife.com/wp-content/uploads/2021/09/paneer-pizza-recipe-1-2.jpg',
    isVegetarian: true,
    tags: ['pizza', 'paneer', 'premium'],
  },
  {
    name: 'Idli (4 pcs)',
    slug: 'idli-sambar',
    description: 'Steamed to perfection, served with love, coconut chutney, and piping hot sambar.',
    price: 40,
    prepTime: 4,
    category: 'South Indian & Healthy',
    imageUrl:
      'https://www.thespruceeats.com/thmb/wjKZDZgSPx1MZcQUyJwBxy9EOOM=/300x225/filters:no_upscale():max_bytes(150000):strip_icc()/idli-56a510b63df78cf772862c34.jpg',
    isVegetarian: true,
    tags: ['idli', 'south-indian', 'steamed', 'healthy'],
  },
  {
    name: 'Fresh Garden Salad',
    slug: 'fresh-garden-salad',
    description: 'Healthy crunchy salad with mixed greens, cucumbers, tomatoes, and lemon dressing.',
    price: 15,
    prepTime: 6,
    category: 'South Indian & Healthy',
    imageUrl:
      'https://burst.shopifycdn.com/photos/dinner-salad.jpg?width=1000&format=pjpg&exif=0&iptc=0',
    isVegetarian: true,
    tags: ['salad', 'healthy', 'diet'],
  },
];

