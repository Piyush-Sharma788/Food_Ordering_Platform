import datetime
import random
from decimal import Decimal
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from django.utils.text import slugify
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from zaika.models import User, Restaurant, MenuItem, Order, OrderItem, OrderStatusHistory, Review
from zaika.serializers import UserSerializer, RestaurantSerializer, MenuItemSerializer, OrderSerializer, ReviewSerializer
from zaika.services.ai_service import ai_service


class AuthRegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def POST(self, request):
        data = request.data
        student_id = data.get('student_id', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        name = data.get('name', '').strip()
        role = data.get('role', 'customer')
        year = data.get('year', '1st Year')
        branch = data.get('branch', 'Engineering')

        if not student_id or not password:
            return Response({'success': False, 'message': 'Student ID and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(Q(student_id__iexact=student_id) | Q(username__iexact=student_id)).exists():
            return Response({'success': False, 'message': f"Student ID '{student_id}' is already registered."}, status=status.HTTP_409_CONFLICT)

        user = User.objects.create_user(
            username=student_id,
            student_id=student_id,
            email=email,
            password=password,
            first_name=name or student_id,
            role=role,
            year=year,
            branch=branch,
        )
        login(request, user)
        return Response({'success': True, 'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)

    def post(self, request):
        return self.POST(request)


class AuthLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        login_id = request.data.get('login_id', '').strip()
        password = request.data.get('password', '').strip()

        if not login_id or not password:
            return Response({'success': False, 'message': 'Please provide student ID and password.'}, status=status.HTTP_400_BAD_REQUEST)

        # Look up user by student_id, username, or email
        user_obj = User.objects.filter(
            Q(student_id__iexact=login_id) | Q(username__iexact=login_id) | Q(email__iexact=login_id)
        ).first()

        if user_obj and user_obj.check_password(password):
            login(request, user_obj)
            return Response({'success': True, 'user': UserSerializer(user_obj).data})

        return Response({'success': False, 'message': 'Invalid credentials. Please try again.'}, status=status.HTTP_401_UNAUTHORIZED)


class AuthMeAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            return Response({'success': True, 'user': UserSerializer(request.user).data})
        return Response({'success': False, 'user': None}, status=status.HTTP_401_UNAUTHORIZED)


class AuthLogoutAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        return Response({'success': True, 'message': 'Logged out successfully.'})


class RestaurantListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get('category')
        search = request.query_params.get('search')

        qs = Restaurant.objects.filter(is_active=True)
        if category and category != 'All':
            qs = qs.filter(category__iexact=category)
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(description__icontains=search))

        serializer = RestaurantSerializer(qs, many=True)
        return Response({'success': True, 'restaurants': serializer.data})


class RestaurantDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            restaurant = Restaurant.objects.get(pk=pk, is_active=True)
            return Response({'success': True, 'restaurant': RestaurantSerializer(restaurant).data})
        except Restaurant.DoesNotExist:
            return Response({'success': False, 'message': 'Restaurant not found.'}, status=status.HTTP_404_NOT_FOUND)


class MenuItemListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get('category')
        search = request.query_params.get('search')
        restaurant_id = request.query_params.get('restaurant_id')
        include_unavailable = request.query_params.get('all') == 'true'

        qs = MenuItem.objects.all()
        if not include_unavailable:
            qs = qs.filter(is_available=True)
        if category and category != 'All':
            qs = qs.filter(category__iexact=category)
        if restaurant_id:
            qs = qs.filter(restaurant_id=restaurant_id)
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(description__icontains=search) | Q(tags__icontains=search))

        serializer = MenuItemSerializer(qs, many=True)
        return Response({'success': True, 'items': serializer.data})

    def post(self, request):
        # Only staff or canteen owner can add items
        if not request.user.is_authenticated or (request.user.role not in ['canteen_owner', 'admin'] and not request.user.is_staff):
            return Response({'success': False, 'message': 'Unauthorized. Staff role required.'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data
        name = data.get('name', '').strip()
        if not name:
            return Response({'success': False, 'message': 'Item name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        restaurant_id = data.get('restaurant_id')
        restaurant = Restaurant.objects.filter(id=restaurant_id).first() if restaurant_id else Restaurant.objects.first()

        slug = f"{slugify(name)}-{int(datetime.datetime.now().timestamp())}"

        item = MenuItem.objects.create(
            restaurant=restaurant,
            name=name,
            slug=slug,
            description=data.get('description', ''),
            price=Decimal(str(data.get('price', 50))),
            prep_time=int(data.get('prep_time', 5)),
            category=data.get('category', 'Snacks'),
            image_url=data.get('image_url', ''),
            is_available=data.get('is_available', True),
            is_vegetarian=data.get('is_vegetarian', True),
            tags=data.get('tags', ''),
        )
        return Response({'success': True, 'item': MenuItemSerializer(item).data}, status=status.HTTP_201_CREATED)


class MenuItemDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, pk):
        if not request.user.is_authenticated or (request.user.role not in ['canteen_owner', 'admin'] and not request.user.is_staff):
            return Response({'success': False, 'message': 'Unauthorized. Staff role required.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            item = MenuItem.objects.get(pk=pk)
            item.delete()
            return Response({'success': True, 'message': 'Menu item removed.'})
        except MenuItem.DoesNotExist:
            return Response({'success': False, 'message': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)


class OrderListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'success': False, 'message': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Canteen staff and admins can see all orders; students see only their own
        if request.user.role in ['canteen_owner', 'admin'] or request.user.is_staff:
            orders = Order.objects.all().prefetch_related('items')
        else:
            orders = Order.objects.filter(user=request.user).prefetch_related('items')

        serializer = OrderSerializer(orders, many=True)
        return Response({'success': True, 'orders': serializer.data})

    def post(self, request):
        user = request.user
        data = request.data
        guest_student_id = data.get('student_id', '').strip()

        # Handle guest authentication or creation if unauthenticated
        if not user.is_authenticated:
            if not guest_student_id:
                return Response({'success': False, 'message': 'Please provide your Student ID to place an order.'}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.filter(student_id__iexact=guest_student_id).first()
            if not user:
                user = User.objects.create_user(
                    username=guest_student_id,
                    student_id=guest_student_id,
                    password='pass123',
                    first_name=f"Student {guest_student_id}",
                    role='customer'
                )
            login(request, user)

        raw_items = data.get('items', [])
        if not raw_items:
            return Response({'success': False, 'message': 'Your order tray is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        restaurant_id = data.get('restaurant_id')
        restaurant = Restaurant.objects.filter(id=restaurant_id).first() if restaurant_id else Restaurant.objects.first()

        # Calculate totals on the server securely
        subtotal = Decimal('0.00')
        accumulated_time = 0
        verified_items = []

        for it in raw_items:
            menu_item_id = it.get('menu_item_id') or it.get('id')
            quantity = int(it.get('quantity', 1))
            if quantity < 1:
                continue

            menu_item = MenuItem.objects.filter(id=menu_item_id).first()
            if not menu_item:
                continue

            item_price = menu_item.price
            subtotal += item_price * quantity

            # Legacy scaling formula: base + base * 0.35 * (qty - 1)
            if quantity == 1:
                accumulated_time += menu_item.prep_time
            else:
                accumulated_time += menu_item.prep_time + (menu_item.prep_time * 0.35 * (quantity - 1))

            verified_items.append({
                'menu_item': menu_item,
                'name': menu_item.name,
                'price': item_price,
                'quantity': quantity,
                'prep_time': menu_item.prep_time
            })

        if not verified_items:
            return Response({'success': False, 'message': 'No valid menu items in tray.'}, status=status.HTTP_400_BAD_REQUEST)

        delivery_type = data.get('delivery_type', 'pickup')
        delivery_location = data.get('delivery_location', 'Campus Canteen Counter')
        special_instructions = data.get('special_instructions', '')

        tax = (subtotal * Decimal('0.05')).quantize(Decimal('0.01'))
        delivery_fee = Decimal('20.00') if delivery_type == 'campus_delivery' else Decimal('0.00')
        total_price = subtotal + tax + delivery_fee
        estimated_prep = max(5, round(accumulated_time))

        # Generate unique order number: ZK-YYYYMMDD-XXXX
        today_str = datetime.date.today().strftime('%Y%m%d')
        rand_suffix = random.randint(1000, 9999)
        order_number = f"ZK-{today_str}-{rand_suffix}"

        order = Order.objects.create(
            order_number=order_number,
            user=user,
            student_id=user.student_id,
            restaurant=restaurant,
            restaurant_name=restaurant.name if restaurant else 'Campus Canteen',
            subtotal=subtotal,
            tax=tax,
            delivery_fee=delivery_fee,
            total_price=total_price,
            estimated_prep_time_minutes=estimated_prep,
            status='pending',
            delivery_type=delivery_type,
            delivery_location=delivery_location,
            special_instructions=special_instructions,
            payment_status='paid',
            payment_method='online_simulated'
        )

        for vit in verified_items:
            OrderItem.objects.create(
                order=order,
                menu_item=vit['menu_item'],
                name=vit['name'],
                price=vit['price'],
                quantity=vit['quantity'],
                prep_time=vit['prep_time']
            )

        OrderStatusHistory.objects.create(
            order=order,
            status='pending',
            note='Order placed by student',
            updated_by=user
        )

        # Increment user's order count
        user.order_count += 1
        user.save(update_fields=['order_count'])

        return Response({'success': True, 'order': OrderSerializer(order).data}, status=status.HTTP_201_CREATED)


class OrderDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, order_number):
        order = Order.objects.filter(Q(order_number=order_number) | Q(id__iexact=order_number)).first()
        if not order:
            return Response({'success': False, 'message': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'success': True, 'order': OrderSerializer(order).data})

    def patch(self, request, order_number):
        if not request.user.is_authenticated:
            return Response({'success': False, 'message': 'Unauthorized.'}, status=status.HTTP_401_UNAUTHORIZED)

        order = Order.objects.filter(Q(order_number=order_number) | Q(id__iexact=order_number)).first()
        if not order:
            return Response({'success': False, 'message': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        note = request.data.get('note', '')

        # Staff can update to any valid state; students can only cancel their own pending order
        is_staff = request.user.role in ['canteen_owner', 'admin'] or request.user.is_staff
        is_owner = order.user == request.user

        if not is_staff:
            if not is_owner or new_status != 'cancelled' or order.status != 'pending':
                return Response({'success': False, 'message': 'Forbidden: You cannot modify this order.'}, status=status.HTTP_403_FORBIDDEN)

        order.status = new_status
        order.save(update_fields=['status', 'updated_at'])

        OrderStatusHistory.objects.create(
            order=order,
            status=new_status,
            note=note or f"Status updated to {new_status} by {request.user.role}",
            updated_by=request.user
        )

        return Response({'success': True, 'order': OrderSerializer(order).data})


class AIChatAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        messages = request.data.get('messages', [])
        preferred = request.data.get('preferred_provider', 'auto')
        result = ai_service.chat(messages, preferred)
        return Response({'success': True, **result})


class ReviewListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        reviews = Review.objects.all()[:30]
        return Response({'success': True, 'reviews': ReviewSerializer(reviews, many=True).data})

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'success': False, 'message': 'Login required to submit a review.'}, status=status.HTTP_401_UNAUTHORIZED)

        data = request.data
        restaurant_id = data.get('restaurant_id')
        restaurant = Restaurant.objects.filter(id=restaurant_id).first() or Restaurant.objects.first()

        review = Review.objects.create(
            user=request.user,
            student_id=request.user.student_id,
            restaurant=restaurant,
            rating=int(data.get('rating', 5)),
            comment=data.get('comment', '').strip()
        )
        return Response({'success': True, 'review': ReviewSerializer(review).data}, status=status.HTTP_201_CREATED)

