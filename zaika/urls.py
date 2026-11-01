from django.urls import path
from zaika import views_ui, views_api

urlpatterns = [
    # UI Web Pages
    path('', views_ui.home_view, name='home'),
    path('menu/', views_ui.menu_view, name='menu'),
    path('orders/<str:order_number>/', views_ui.order_detail_view, name='order_detail'),
    path('orders/<str:order_number>/receipt/pdf/', views_ui.order_receipt_pdf_view, name='order_receipt_pdf'),
    path('orders/<str:order_number>/receipt/html/', views_ui.order_receipt_html_view, name='order_receipt_html'),
    path('canteen/', views_ui.canteen_view, name='canteen_management'),
    path('login/', views_ui.login_view, name='login'),
    path('logout/', views_ui.logout_view, name='logout'),
    path('about/', views_ui.about_view, name='about'),

    # REST APIs
    path('api/auth/register/', views_api.AuthRegisterAPIView.as_view(), name='api_register'),
    path('api/auth/login/', views_api.AuthLoginAPIView.as_view(), name='api_login'),
    path('api/auth/me/', views_api.AuthMeAPIView.as_view(), name='api_me'),
    path('api/auth/logout/', views_api.AuthLogoutAPIView.as_view(), name='api_logout'),
    path('api/restaurants/', views_api.RestaurantListAPIView.as_view(), name='api_restaurants'),
    path('api/restaurants/<int:pk>/', views_api.RestaurantDetailAPIView.as_view(), name='api_restaurant_detail'),
    path('api/menu-items/', views_api.MenuItemListAPIView.as_view(), name='api_menu_items'),
    path('api/menu-items/<int:pk>/', views_api.MenuItemDetailAPIView.as_view(), name='api_menu_item_detail'),
    path('api/orders/', views_api.OrderListCreateAPIView.as_view(), name='api_orders'),
    path('api/orders/<str:order_number>/', views_api.OrderDetailAPIView.as_view(), name='api_order_detail'),
    path('api/ai/chat/', views_api.AIChatAPIView.as_view(), name='api_ai_chat'),
    path('api/reviews/', views_api.ReviewListCreateAPIView.as_view(), name='api_reviews'),
]

