from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = (
        ('customer', 'Customer / Student'),
        ('canteen_owner', 'Canteen Owner / Staff'),
        ('admin', 'Platform Administrator'),
    )

    student_id = models.CharField(max_length=30, unique=True, db_index=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer', db_index=True)
    year = models.CharField(max_length=50, blank=True, default='1st Year')
    branch = models.CharField(max_length=100, blank=True, default='Computer Science')
    avatar_url = models.URLField(max_length=500, blank=True, default='')
    order_count = models.PositiveIntegerField(default=0)

    # Use student_id as primary login identifier or username
    def __str__(self):
        return f"{self.student_id} ({self.get_full_name() or self.username})"


class Restaurant(models.Model):
    CATEGORY_CHOICES = (
        ('Canteen', 'Campus Canteen'),
        ('Cafe', 'Cafe'),
        ('Dhaba', 'Dhaba'),
        ('Fast Food', 'Fast Food'),
    )

    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=150, unique=True, db_index=True)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Canteen', db_index=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.0)
    review_count = models.PositiveIntegerField(default=0)
    image_url = models.URLField(max_length=500)
    location = models.CharField(max_length=255, default='Campus Ground Floor / Food Court')
    opening_hours = models.CharField(max_length=100, default='08:00 AM - 10:00 PM')
    is_active = models.BooleanField(default=True, db_index=True)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='owned_restaurants')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menu_items')
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=150, db_index=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    prep_time = models.PositiveIntegerField(default=5, help_text="Base preparation time in minutes")
    category = models.CharField(max_length=100, db_index=True)
    image_url = models.URLField(max_length=500)
    is_available = models.BooleanField(default=True, db_index=True)
    is_vegetarian = models.BooleanField(default=True, db_index=True)
    tags = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} (Rs. {self.price})"


class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('ready_for_pickup', 'Ready for Pickup'),
        ('out_for_delivery', 'Out for Delivery'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rejected', 'Rejected'),
    )

    DELIVERY_CHOICES = (
        ('pickup', 'Counter Pickup'),
        ('campus_delivery', 'Campus Delivery'),
    )

    PAYMENT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )

    order_number = models.CharField(max_length=50, unique=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    student_id = models.CharField(max_length=50, db_index=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='orders')
    restaurant_name = models.CharField(max_length=150, default='Campus Canteen')

    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    estimated_prep_time_minutes = models.PositiveIntegerField(default=5)

    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending', db_index=True)
    delivery_type = models.CharField(max_length=30, choices=DELIVERY_CHOICES, default='pickup')
    delivery_location = models.CharField(max_length=255, default='Campus Canteen Counter')
    special_instructions = models.TextField(blank=True, default='')

    payment_status = models.CharField(max_length=30, choices=PAYMENT_STATUS_CHOICES, default='paid')
    payment_method = models.CharField(max_length=50, default='online_simulated')

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.order_number} ({self.status}) - Rs. {self.total_price}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=150)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    prep_time = models.PositiveIntegerField(default=5)

    @property
    def item_total(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.quantity}x {self.name} (Rs. {self.item_total})"


class OrderStatusHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='history')
    status = models.CharField(max_length=30)
    timestamp = models.DateTimeField(auto_now_add=True)
    note = models.CharField(max_length=255, blank=True, default='')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.order.order_number} -> {self.status} at {self.timestamp}"


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    student_id = models.CharField(max_length=50)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(default=5)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student_id} on {self.restaurant.name}: {self.rating} stars"
