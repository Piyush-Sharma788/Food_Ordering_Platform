from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, Http404
from django.contrib.auth import logout
from django.db.models import Q
from zaika.models import Restaurant, MenuItem, Order, Review
from zaika.services.receipt_generator import receipt_generator


def home_view(request):
    category = request.GET.get('category', 'All')
    search = request.GET.get('search', '').strip()

    restaurants = Restaurant.objects.filter(is_active=True)
    if category and category != 'All':
        restaurants = restaurants.filter(category__iexact=category)
    if search:
        restaurants = restaurants.filter(Q(name__icontains=search) | Q(description__icontains=search))

    context = {
        'restaurants': restaurants,
        'selected_category': category,
        'search_query': search,
        'categories': ['All', 'Canteen', 'Cafe', 'Dhaba'],
    }
    return render(request, 'home.html', context)


def menu_view(request):
    category = request.GET.get('category', 'All')
    search = request.GET.get('search', '').strip()

    items = MenuItem.objects.filter(is_available=True)
    if category and category != 'All':
        items = items.filter(category__iexact=category)
    if search:
        items = items.filter(Q(name__icontains=search) | Q(description__icontains=search) | Q(tags__icontains=search))

    categories = [
        'All',
        'Beverages',
        'Snacks',
        'Chinese & Indo-Chinese',
        'Noodles & Momos',
        'Pizza & Specials',
        'South Indian & Healthy',
    ]

    reviews = Review.objects.all().order_by('-created_at')[:10]

    context = {
        'menu_items': items,
        'categories': categories,
        'selected_category': category,
        'search_query': search,
        'reviews': reviews,
    }
    return render(request, 'menu.html', context)


def order_detail_view(request, order_number):
    order = Order.objects.filter(Q(order_number=order_number) | Q(id__iexact=order_number)).first()
    if not order:
        raise Http404("Order does not exist.")

    context = {
        'order': order,
        'items': order.items.all(),
    }
    return render(request, 'order_detail.html', context)


def order_receipt_pdf_view(request, order_number):
    order = Order.objects.filter(Q(order_number=order_number) | Q(id__iexact=order_number)).first()
    if not order:
        raise Http404("Order does not exist.")

    pdf_bytes = receipt_generator.generate_pdf(order)
    response = HttpResponse(pdf_bytes, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="Receipt-{order.order_number}.pdf"'
    return response


def order_receipt_html_view(request, order_number):
    order = Order.objects.filter(Q(order_number=order_number) | Q(id__iexact=order_number)).first()
    if not order:
        raise Http404("Order does not exist.")

    context = {'order': order, 'items': order.items.all()}
    return render(request, 'receipt.html', context)


def canteen_view(request):
    # Only authenticated canteen staff / admin can manage
    active_tab = request.GET.get('tab', 'orders')
    orders = Order.objects.all().prefetch_related('items')
    menu_items = MenuItem.objects.all()

    context = {
        'orders': orders,
        'menu_items': menu_items,
        'active_tab': active_tab,
        'pending_count': orders.filter(status__in=['pending', 'confirmed', 'preparing', 'ready_for_pickup']).count(),
    }
    return render(request, 'canteen.html', context)


def login_view(request):
    if request.user.is_authenticated:
        if request.user.role in ['canteen_owner', 'admin'] or request.user.is_staff:
            return redirect('canteen_management')
        return redirect('home')
    return render(request, 'login.html')


def logout_view(request):
    logout(request)
    return redirect('home')


def about_view(request):
    return render(request, 'about.html')

