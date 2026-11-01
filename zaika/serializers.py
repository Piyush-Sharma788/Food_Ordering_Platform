from rest_framework import serializers
from zaika.models import User, Restaurant, MenuItem, Order, OrderItem, Review


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'student_id', 'username', 'email', 'first_name', 'last_name', 'role', 'year', 'branch', 'order_count']
        read_only_fields = ['id', 'order_count']


class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = [
            'id', 'restaurant', 'name', 'slug', 'description', 'price',
            'prep_time', 'category', 'image_url', 'is_available',
            'is_vegetarian', 'tags', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class RestaurantSerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'slug', 'description', 'category', 'rating',
            'review_count', 'image_url', 'location', 'opening_hours',
            'is_active', 'menu_items'
        ]
        read_only_fields = ['id', 'slug']


class OrderItemSerializer(serializers.ModelSerializer):
    item_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'name', 'price', 'quantity', 'prep_time', 'item_total']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'student_id', 'restaurant',
            'restaurant_name', 'items', 'subtotal', 'tax', 'delivery_fee',
            'total_price', 'estimated_prep_time_minutes', 'status',
            'delivery_type', 'delivery_location', 'special_instructions',
            'payment_status', 'payment_method', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'order_number', 'subtotal', 'tax', 'delivery_fee',
            'total_price', 'estimated_prep_time_minutes', 'created_at', 'updated_at'
        ]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'user', 'student_id', 'restaurant', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at']

