from decimal import Decimal
from django.test import TestCase, Client
from django.urls import reverse
from zaika.models import User, Restaurant, MenuItem, Order, OrderItem
from zaika.services.receipt_generator import receipt_generator
from zaika.services.ai_service import ai_service


class PreparationTimeAndPricingTests(TestCase):
    def setUp(self):
        self.restaurant = Restaurant.objects.create(
            name='Campus Canteen',
            slug='campus-canteen',
            description='Quick bites',
            category='Canteen',
            rating=4.0,
            image_url='https://example.com/canteen.jpg'
        )

        self.item1 = MenuItem.objects.create(
            restaurant=self.restaurant,
            name='Vanilla Shake',
            slug='vanilla-shake',
            description='Creamy shake',
            price=Decimal('65.00'),
            prep_time=4,
            category='Beverages',
            image_url='https://example.com/shake.jpg'
        )

        self.item2 = MenuItem.objects.create(
            restaurant=self.restaurant,
            name='Paneer Burger',
            slug='paneer-burger',
            description='Crispy paneer burger',
            price=Decimal('75.00'),
            prep_time=10,
            category='Snacks',
            image_url='https://example.com/burger.jpg'
        )

        self.student = User.objects.create_user(
            username='12345',
            student_id='12345',
            password='pass123',
            first_name='Aarav',
            role='customer'
        )

    def test_single_item_prep_time(self):
        # Single item quantity 1 = base prep time
        self.assertEqual(self.item1.prep_time, 4)

    def test_multi_item_prep_scaling_formula(self):
        # Legacy formula: base + base * 0.35 * (qty - 1)
        # Vanilla shake (base 4, qty 3): 4 + 4 * 0.35 * 2 = 6.8 -> rounded 7
        qty = 3
        calc_time = self.item1.prep_time + (self.item1.prep_time * 0.35 * (qty - 1))
        self.assertEqual(round(calc_time), 7)

    def test_order_creation_and_totals(self):
        order = Order.objects.create(
            order_number='ZK-TEST-001',
            user=self.student,
            student_id=self.student.student_id,
            restaurant=self.restaurant,
            restaurant_name=self.restaurant.name,
            subtotal=Decimal('205.00'),
            tax=Decimal('10.25'),
            delivery_fee=Decimal('20.00'),
            total_price=Decimal('235.25'),
            estimated_prep_time_minutes=15,
            status='pending',
            delivery_type='campus_delivery'
        )

        OrderItem.objects.create(
            order=order,
            menu_item=self.item1,
            name=self.item1.name,
            price=self.item1.price,
            quantity=2,
            prep_time=self.item1.prep_time
        )

        OrderItem.objects.create(
            order=order,
            menu_item=self.item2,
            name=self.item2.name,
            price=self.item2.price,
            quantity=1,
            prep_time=self.item2.prep_time
        )

        self.assertEqual(order.items.count(), 2)
        self.assertEqual(order.total_price, Decimal('235.25'))
        self.assertEqual(order.status, 'pending')

    def test_pdf_receipt_generation(self):
        order = Order.objects.create(
            order_number='ZK-TEST-002',
            user=self.student,
            student_id=self.student.student_id,
            restaurant=self.restaurant,
            restaurant_name=self.restaurant.name,
            subtotal=Decimal('65.00'),
            tax=Decimal('3.25'),
            delivery_fee=Decimal('0.00'),
            total_price=Decimal('68.25'),
            estimated_prep_time_minutes=4,
            status='completed',
            delivery_type='pickup'
        )
        OrderItem.objects.create(
            order=order,
            menu_item=self.item1,
            name=self.item1.name,
            price=self.item1.price,
            quantity=1,
            prep_time=self.item1.prep_time
        )

        pdf_bytes = receipt_generator.generate_pdf(order)
        self.assertIsInstance(pdf_bytes, bytes)
        self.assertTrue(pdf_bytes.startswith(b'%PDF-'), "Generated receipt must be a valid PDF buffer")


class RESTApiAndViewsTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.restaurant = Restaurant.objects.create(
            name='Cozy Corner Cafe',
            slug='cozy-corner-cafe',
            description='Artisanal coffee and pastries',
            category='Cafe',
            rating=4.8,
            image_url='https://example.com/cafe.jpg'
        )
        self.item = MenuItem.objects.create(
            restaurant=self.restaurant,
            name='Hot Coffee',
            slug='hot-coffee',
            description='Fresh espresso',
            price=Decimal('25.00'),
            prep_time=3,
            category='Beverages',
            image_url='https://example.com/coffee.jpg'
        )

    def test_home_page_renders(self):
        res = self.client.get(reverse('home'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'Cd:')
        self.assertContains(res, 'Zaika')
        self.assertContains(res, 'Cozy Corner Cafe')

    def test_menu_page_renders(self):
        res = self.client.get(reverse('menu'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'Hot Coffee')
        self.assertContains(res, 'Rs. 25')

    def test_api_restaurant_list(self):
        res = self.client.get(reverse('api_restaurants'))
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data['success'])
        self.assertGreaterEqual(len(data['restaurants']), 1)

    def test_api_menu_items_list(self):
        res = self.client.get(reverse('api_menu_items'))
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data['success'])
        self.assertGreaterEqual(len(data['items']), 1)

    def test_api_ai_chat_fallback(self):
        res = self.client.post(
            reverse('api_ai_chat'),
            {'messages': [{'role': 'user', 'content': 'I need coffee for my study break'}]},
            content_type='application/json'
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data['success'])
        self.assertIn('Coffee', data['reply'])

    def test_order_creation_api(self):
        payload = {
            'student_id': '99999',
            'delivery_type': 'pickup',
            'delivery_location': 'Canteen Counter',
            'items': [{'menu_item_id': self.item.id, 'quantity': 2}]
        }
        res = self.client.post(
            reverse('api_orders'),
            payload,
            content_type='application/json'
        )
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['order']['student_id'], '99999')
        self.assertEqual(Decimal(str(data['order']['subtotal'])), Decimal('50.00'))
