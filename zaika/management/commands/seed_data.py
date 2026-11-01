from django.core.management.base import BaseCommand
from zaika.models import User, Restaurant, MenuItem


class Command(BaseCommand):
    help = 'Seed initial campus eateries, 26 legacy menu items, and demo student/admin accounts'

    def handle(self, *args, **options):
        self.stdout.write("🌱 Seeding database...")

        # 1. Seed Demo Users
        users_data = [
            {
                'username': '12345',
                'student_id': '12345',
                'first_name': 'Aarav',
                'last_name': 'Sharma',
                'email': 'student1@example.com',
                'password': 'pass123',
                'role': 'customer',
                'year': '3rd Year',
                'branch': 'Computer Science',
                'order_count': 15,
                'is_staff': False,
                'is_superuser': False,
            },
            {
                'username': '67890',
                'student_id': '67890',
                'first_name': 'Priya',
                'last_name': 'Patel',
                'email': 'student2@example.com',
                'password': 'pass456',
                'role': 'customer',
                'year': '2nd Year',
                'branch': 'Electrical Engineering',
                'order_count': 8,
                'is_staff': False,
                'is_superuser': False,
            },
            {
                'username': 'admin',
                'student_id': 'admin',
                'first_name': 'Canteen',
                'last_name': 'Manager',
                'email': 'admin@canteen.com',
                'password': 'adminpass',
                'role': 'canteen_owner',
                'year': 'Staff',
                'branch': 'Food Services',
                'order_count': 0,
                'is_staff': True,
                'is_superuser': True,
            },
        ]

        for udata in users_data:
            pwd = udata.pop('password')
            user, created = User.objects.get_or_create(
                student_id=udata['student_id'],
                defaults=udata
            )
            if created or not user.has_usable_password():
                user.set_password(pwd)
                user.save()
            action = "Created" if created else "Updated"
            self.stdout.write(f"  {action} user: {user.student_id}")

        # 2. Seed Restaurants
        restaurants_data = [
            {
                'name': 'Campus Canteen',
                'slug': 'campus-canteen',
                'description': 'Quick bites, hot beverages, and affordable meals for students and faculty.',
                'category': 'Canteen',
                'rating': 4.0,
                'review_count': 128,
                'image_url': 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Infosys.Electronic.City.Cafeteria.JPG',
                'location': 'Central Academic Block, Ground Floor',
                'opening_hours': '08:00 AM - 09:30 PM',
            },
            {
                'name': 'Cozy Corner Cafe',
                'slug': 'cozy-corner-cafe',
                'description': 'Artisanal coffee, freshly baked pastries, shakes, and quiet study ambience.',
                'category': 'Cafe',
                'rating': 4.8,
                'review_count': 94,
                'image_url': 'https://i.pinimg.com/originals/12/9a/e9/129ae98061ea7c76045537099661424a.jpg',
                'location': 'Student Activity Center, 1st Floor',
                'opening_hours': '09:00 AM - 10:30 PM',
            },
            {
                'name': 'Highway Dhaba',
                'slug': 'highway-dhaba',
                'description': 'Authentic roadside cuisine, masaledar snacks, and hearty parathas with a homely touch.',
                'category': 'Dhaba',
                'rating': 4.2,
                'review_count': 76,
                'image_url': 'https://lh5.googleusercontent.com/p/AF1QipMDr1iZy8sy82CFGVnOFvze8ejLs3UdILvz8Rpo=w1080-k-no',
                'location': 'North Campus Gate, Food Street',
                'opening_hours': '11:00 AM - 11:00 PM',
            },
        ]

        restaurants = {}
        for rdata in restaurants_data:
            rest, created = Restaurant.objects.get_or_create(slug=rdata['slug'], defaults=rdata)
            restaurants[rest.slug] = rest
            action = "Created" if created else "Found"
            self.stdout.write(f"  {action} eatery: {rest.name}")

        primary_rest = restaurants['campus-canteen']

        # 3. Seed Menu Items
        menu_items_data = [
            # Beverages
            {
                'name': 'Vanilla Shake',
                'slug': 'vanilla-shake',
                'description': 'Fuel your potential with every sip. Creamy rich vanilla milkshake.',
                'price': 65.00,
                'prep_time': 4,
                'category': 'Beverages',
                'image_url': 'https://images.immediate.co.uk/production/volatile/sites/30/2020/12/classic-vanilla-milkshake-9e7745f.jpg?quality=90&resize=544,494',
                'is_vegetarian': True,
                'tags': 'shake,vanilla,sweet,cold',
            },
            {
                'name': 'Strawberry Shake',
                'slug': 'strawberry-shake',
                'description': 'Flavor that makes you happy. Fresh strawberry puree blended with creamy milk.',
                'price': 70.00,
                'prep_time': 4,
                'category': 'Beverages',
                'image_url': 'https://uproxx.com/wp-content/uploads/2022/06/desserts-shakes-and-sides.jpg',
                'is_vegetarian': True,
                'tags': 'shake,strawberry,fruity,cold',
            },
            {
                'name': 'Chocolate Shake',
                'slug': 'chocolate-shake',
                'description': 'The taste of our childhood with deep Dutch chocolate and milk.',
                'price': 90.00,
                'prep_time': 4,
                'category': 'Beverages',
                'image_url': 'https://pintsizedbaker.com/wp-content/uploads/2013/08/Triple-Chocolate-Milkshakes-9.jpg.webp',
                'is_vegetarian': True,
                'tags': 'shake,chocolate,rich,cold',
            },
            {
                'name': 'Hot Coffee',
                'slug': 'hot-coffee',
                'description': 'Relax your mind with a freshly brewed hot cup of aromatic espresso.',
                'price': 25.00,
                'prep_time': 3,
                'category': 'Beverages',
                'image_url': 'https://media.gettyimages.com/id/1133425883/photo/espresso-coffee-maker.jpg?s=612x612&w=0&k=20&c=I3FB-elrUmfWF9fbrawxmqEjdNGD9mWTBs_6oU6TzpM=',
                'is_vegetarian': True,
                'tags': 'coffee,hot,caffeine,budget',
            },
            {
                'name': 'Hot Hazelnut Coffee',
                'slug': 'hot-hazelnut-coffee',
                'description': 'Add some nutty flavor to your study breaks with premium hazelnut syrup.',
                'price': 30.00,
                'prep_time': 4,
                'category': 'Beverages',
                'image_url': 'https://artofpalate.com/wp-content/uploads/2015/03/coffee-photography.jpg',
                'is_vegetarian': True,
                'tags': 'coffee,hazelnut,hot,flavored',
            },
            {
                'name': 'Cold Coffee',
                'slug': 'cold-coffee',
                'description': 'Chill your mind with a frothy, chilled espresso blend.',
                'price': 50.00,
                'prep_time': 5,
                'category': 'Beverages',
                'image_url': 'https://t4.ftcdn.net/jpg/08/98/59/97/360_F_898599792_EijVasZ8S4YDQko5eIy2Xe17eF32Up6d.jpg',
                'is_vegetarian': True,
                'tags': 'coffee,cold,refreshing',
            },
            {
                'name': 'Hazelnut Cold Coffee',
                'slug': 'hazelnut-cold-coffee',
                'description': 'Flavorful secrets unveiled in an iced hazelnut brew.',
                'price': 60.00,
                'prep_time': 5,
                'category': 'Beverages',
                'image_url': 'https://www.nickandalicia.com/wp-content/uploads/2017/06/Vanilla-Hazelnut-Iced-Coffee-2727.jpg',
                'is_vegetarian': True,
                'tags': 'coffee,hazelnut,cold',
            },

            # Snacks
            {
                'name': 'Paneer Burger',
                'slug': 'paneer-burger',
                'description': 'Sizzle, stack, and savor with a crispy spiced paneer patty and lettuce.',
                'price': 75.00,
                'prep_time': 10,
                'category': 'Snacks',
                'image_url': 'https://celebrationgeneration.com/wp-content/uploads/2013/05/Paneer-Burgers-8.jpg',
                'is_vegetarian': True,
                'tags': 'burger,paneer,popular',
            },
            {
                'name': 'Grilled Sandwich',
                'slug': 'grilled-sandwich',
                'description': 'Good sandwich brings good mood. Golden toasted with veggies and butter.',
                'price': 55.00,
                'prep_time': 10,
                'category': 'Snacks',
                'image_url': 'https://www.honeywhatscooking.com/wp-content/uploads/2022/06/Bombay-Grilled-Sandwich20-780x556.jpg',
                'is_vegetarian': True,
                'tags': 'sandwich,grilled,crispy',
            },
            {
                'name': 'Paneer Sandwich',
                'slug': 'paneer-sandwich',
                'description': 'Big bite, little money. Loaded with marinated spiced cottage cheese.',
                'price': 70.00,
                'prep_time': 10,
                'category': 'Snacks',
                'image_url': 'https://thumbs.dreamstime.com/b/grilled-paneer-sandwich-indian-style-close-up-136677968.jpg',
                'is_vegetarian': True,
                'tags': 'sandwich,paneer,filling',
            },
            {
                'name': 'Cheese Bun',
                'slug': 'cheese-bun',
                'description': 'Bite into cheese bliss. Soft warmed bun with melted mozzarella and herbs.',
                'price': 35.00,
                'prep_time': 6,
                'category': 'Snacks',
                'image_url': 'https://breadsandsweets.com/wp-content/uploads/2021/05/cheese-buns-pic-2.jpg',
                'is_vegetarian': True,
                'tags': 'bun,cheese,quick',
            },
            {
                'name': 'French Fries',
                'slug': 'french-fries',
                'description': 'Handmade, heartfelt, hearty salted golden potato fries with dip.',
                'price': 50.00,
                'prep_time': 6,
                'category': 'Snacks',
                'image_url': 'https://img.freepik.com/premium-photo/fries-french-fries-with-tomato-sauce-sweet-potato-finger-chips-golden-frenchfried-potatoes_162695-47326.jpg?size=626&ext=jpg',
                'is_vegetarian': True,
                'tags': 'fries,crispy,classic',
            },
            {
                'name': 'Chilly Potato Gravy',
                'slug': 'chilly-potato-gravy',
                'description': 'The land of juicy delights. Crispy potato fingers tossed in spicy gravy.',
                'price': 65.00,
                'prep_time': 7,
                'category': 'Chinese & Indo-Chinese',
                'image_url': 'https://storage.googleapis.com/cscom-2019.appspot.com/uploads/2018/10/crispy-honey-chilli-potatoes-recipe.jpg',
                'is_vegetarian': True,
                'tags': 'chilly,spicy,gravy',
            },
            {
                'name': 'Chilly Paneer',
                'slug': 'chilly-paneer',
                'description': 'Deliciously yours: golden paneer cubes tossed with peppers and scallions.',
                'price': 80.00,
                'prep_time': 6,
                'category': 'Chinese & Indo-Chinese',
                'image_url': 'https://img.freepik.com/premium-photo/spicy-paneer-tikka-with-garnish-finely-chopped_1169880-193442.jpg?size=626&ext=jpg',
                'is_vegetarian': True,
                'tags': 'paneer,spicy,indo-chinese',
            },

            # Noodles & Momos
            {
                'name': 'Maggie Masaledar',
                'slug': 'maggie-masaledar',
                'description': 'Maggie crafted with student passion and perfection. Spicy and piping hot.',
                'price': 60.00,
                'prep_time': 10,
                'category': 'Noodles & Momos',
                'image_url': 'https://c.ndtvimg.com/2023-10/8pr6ki28_maggi_625x300_17_October_23.jpg?im=FaceCrop,algorithm=dnn,width=540,height=720',
                'is_vegetarian': True,
                'tags': 'maggie,hostel-favorite,comfort',
            },
            {
                'name': 'Chilly Paneer Maggie',
                'slug': 'chilly-paneer-maggie',
                'description': 'Step into maggie wonderland with seasoned paneer bites and spices.',
                'price': 70.00,
                'prep_time': 10,
                'category': 'Noodles & Momos',
                'image_url': 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgWTTICqqgdwS81XYfVuxLvniT2p2H6EYjnCF2W-TZuSAmT3aYy3qMfl0Xl1l_8cduSv4Z5vIGR5NjLarPVOih3Mu82Zzm202Pdmxwkz3mnU4duD-emSwb7A13lYEZlpd26QpKnbVaVz0k/s1600/MAggi-paneer-noodles.jpg',
                'is_vegetarian': True,
                'tags': 'maggie,paneer,fusion',
            },
            {
                'name': 'Noodles',
                'slug': 'noodles',
                'description': 'Where noodles meet culinary excellence: wok-tossed street style noodles.',
                'price': 50.00,
                'prep_time': 10,
                'category': 'Noodles & Momos',
                'image_url': 'https://t3.ftcdn.net/jpg/05/86/52/76/360_F_586527672_o5bIef6WQPFTovbTlZ7yhjb6AV0M0iSG.jpg',
                'is_vegetarian': True,
                'tags': 'noodles,chowmein,chinese',
            },
            {
                'name': 'Paneer Noodles',
                'slug': 'paneer-noodles',
                'description': 'A flavorful journey into noodle paradise loaded with soft cottage cheese.',
                'price': 70.00,
                'prep_time': 12,
                'category': 'Noodles & Momos',
                'image_url': 'https://herbivorecucina.com/wp-content/uploads/2015/06/Paneer-Chili-Noodles-1-1024x1024.jpg',
                'is_vegetarian': True,
                'tags': 'noodles,paneer,filling',
            },
            {
                'name': 'Steam Momos (4 pc)',
                'slug': 'steam-momos',
                'description': 'Momos filled with smiles and happiness. Steamed vegetable dumplings with spicy red chutney.',
                'price': 30.00,
                'prep_time': 5,
                'category': 'Noodles & Momos',
                'image_url': 'https://h7.alamy.com/comp/2GTKMRA/steam-momo-2GTKMRA.jpg',
                'is_vegetarian': True,
                'tags': 'momos,steamed,dumplings',
            },
            {
                'name': 'Fried Momos (4 pc)',
                'slug': 'fried-momos',
                'description': 'Dough wrapped with savory spiced veggies, deep fried till golden crunch.',
                'price': 40.00,
                'prep_time': 6,
                'category': 'Noodles & Momos',
                'image_url': 'https://media.istockphoto.com/id/1341504203/photo/fried-momos-dumpling.jpg?s=612x612&w=0&k=20&c=mCUGBqUZw1M7Eu8Bh232by22Q5xKuhJkPG1h6BenbRs=',
                'is_vegetarian': True,
                'tags': 'momos,fried,crispy',
            },

            # Pizza & Specials
            {
                'name': 'Kulhad Pizza',
                'slug': 'kulhad-pizza',
                'description': 'Baked in an authentic earthen clay pot with cheese, fresh veggies and petrichor aroma.',
                'price': 140.00,
                'prep_time': 15,
                'category': 'Pizza & Specials',
                'image_url': 'https://www.temptingtreat.com/wp-content/uploads/2022/11/DSC_1831-copy-300x300.jpg',
                'is_vegetarian': True,
                'tags': 'pizza,kulhad,trending,cheese',
            },
            {
                'name': 'Cheese Corn Pizza',
                'slug': 'cheese-corn-pizza',
                'description': 'Slice into a world of flavor with golden sweet corn and gooey mozzarella.',
                'price': 145.00,
                'prep_time': 15,
                'category': 'Pizza & Specials',
                'image_url': 'https://img.freepik.com/free-photo/high-angle-pizza-with-cheese-cutlery_23-2148765336.jpg?size=626&ext=jpg',
                'is_vegetarian': True,
                'tags': 'pizza,cheese,corn',
            },
            {
                'name': 'Onion Capsicum Pizza',
                'slug': 'onion-capsicum-pizza',
                'description': 'Some slices make you smile. Crispy red onions and fresh green bell peppers.',
                'price': 160.00,
                'prep_time': 15,
                'category': 'Pizza & Specials',
                'image_url': 'https://img.freepik.com/free-photo/vegetarian-pizza_1388-641.jpg?size=626&ext=jpg',
                'is_vegetarian': True,
                'tags': 'pizza,veggie,crispy',
            },
            {
                'name': 'Paneer Pizza',
                'slug': 'paneer-pizza',
                'description': 'Generously topped with tandoori-marinated paneer chunks, herbs, and cheese.',
                'price': 170.00,
                'prep_time': 15,
                'category': 'Pizza & Specials',
                'image_url': 'https://carameltintedlife.com/wp-content/uploads/2021/09/paneer-pizza-recipe-1-2.jpg',
                'is_vegetarian': True,
                'tags': 'pizza,paneer,premium',
            },
            {
                'name': 'Idli (4 pcs)',
                'slug': 'idli-sambar',
                'description': 'Steamed to perfection, served with love, coconut chutney, and piping hot sambar.',
                'price': 40.00,
                'prep_time': 4,
                'category': 'South Indian & Healthy',
                'image_url': 'https://www.thespruceeats.com/thmb/wjKZDZgSPx1MZcQUyJwBxy9EOOM=/300x225/filters:no_upscale():max_bytes(150000):strip_icc()/idli-56a510b63df78cf772862c34.jpg',
                'is_vegetarian': True,
                'tags': 'idli,south-indian,steamed,healthy',
            },
            {
                'name': 'Fresh Garden Salad',
                'slug': 'fresh-garden-salad',
                'description': 'Healthy crunchy salad with mixed greens, cucumbers, tomatoes, and lemon dressing.',
                'price': 15.00,
                'prep_time': 6,
                'category': 'South Indian & Healthy',
                'image_url': 'https://burst.shopifycdn.com/photos/dinner-salad.jpg?width=1000&format=pjpg&exif=0&iptc=0',
                'is_vegetarian': True,
                'tags': 'salad,healthy,diet',
            },
        ]

        count = 0
        for mdata in menu_items_data:
            item, created = MenuItem.objects.get_or_create(
                slug=mdata['slug'],
                defaults={**mdata, 'restaurant': primary_rest}
            )
            if created:
                count += 1

        self.stdout.write(self.style.SUCCESS(f"✅ Seeding complete! Added {count} new menu items. Total dishes: {MenuItem.objects.count()}."))

