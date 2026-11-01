from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Restaurant, MenuItem, Order, OrderItem, OrderStatusHistory, Review


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('student_id', 'username', 'email', 'role', 'year', 'branch', 'order_count', 'is_staff')
    list_filter = ('role', 'year', 'is_staff', 'is_active')
    search_fields = ('student_id', 'username', 'email', 'first_name', 'last_name')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Student / Canteen Info', {'fields': ('student_id', 'role', 'year', 'branch', 'avatar_url', 'order_count')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Student / Canteen Info', {'fields': ('student_id', 'role', 'year', 'branch')}),
    )


class MenuItemInline(admin.TabularInline):
    model = MenuItem
    extra = 1
    fields = ('name', 'category', 'price', 'prep_time', 'is_available', 'is_vegetarian')


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'rating', 'review_count', 'location', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'description', 'location')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [MenuItemInline]


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'restaurant', 'category', 'price', 'prep_time', 'is_available', 'is_vegetarian')
    list_filter = ('category', 'restaurant', 'is_available', 'is_vegetarian')
    search_fields = ('name', 'description', 'category', 'tags')
    prepopulated_fields = {'slug': ('name',)}


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('name', 'price', 'quantity', 'prep_time', 'item_total')


class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 0
    readonly_fields = ('status', 'timestamp', 'note', 'updated_by')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'order_number', 'student_id', 'restaurant_name', 'total_price',
        'estimated_prep_time_minutes', 'status', 'delivery_type', 'created_at'
    )
    list_filter = ('status', 'delivery_type', 'payment_status', 'restaurant')
    search_fields = ('order_number', 'student_id', 'delivery_location')
    readonly_fields = ('order_number', 'created_at', 'updated_at')
    inlines = [OrderItemInline, OrderStatusHistoryInline]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'restaurant', 'rating', 'created_at')
    list_filter = ('rating', 'restaurant')
    search_fields = ('student_id', 'comment')
