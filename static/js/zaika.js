/**
 * Cd: Zaika — Interactive Client-Side Cart, Dynamic Prep-Time Engine & AI Controller
 */

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const CartManager = {
  getCart() {
    try {
      const stored = localStorage.getItem('zaika_cart');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  saveCart(cart) {
    localStorage.setItem('zaika_cart', JSON.stringify(cart));
    this.updateUI();
  },

  addItem(id, name, price, prepTime, imageUrl) {
    const cart = this.getCart();
    if (!cart[id]) {
      cart[id] = { id, name, price: Number(price), prepTime: Number(prepTime), imageUrl, quantity: 0 };
    }
    cart[id].quantity += 1;
    this.saveCart(cart);
  },

  increaseQuantity(id) {
    const cart = this.getCart();
    if (!cart[id]) return;
    cart[id].quantity += 1;
    this.saveCart(cart);
  },

  decreaseQuantity(id) {
    const cart = this.getCart();
    if (!cart[id]) return;
    cart[id].quantity -= 1;
    if (cart[id].quantity <= 0) {
      delete cart[id];
    }
    this.saveCart(cart);
  },

  deleteItem(id) {
    const cart = this.getCart();
    if (cart[id]) {
      delete cart[id];
      this.saveCart(cart);
    }
  },

  clearCart() {
    localStorage.removeItem('zaika_cart');
    this.updateUI();
  },

  calculateTotals() {
    const cart = this.getCart();
    let totalPrice = 0;
    let totalItems = 0;
    let accumulatedTime = 0;

    for (let id in cart) {
      const item = cart[id];
      totalPrice += item.price * item.quantity;
      totalItems += item.quantity;

      // Legacy formula from final_menu.html:
      // if qty === 1: prepTime
      // if qty > 1: prepTime + (prepTime * 0.35 * (qty - 1))
      if (item.quantity === 1) {
        accumulatedTime += item.prepTime;
      } else if (item.quantity > 1) {
        accumulatedTime += item.prepTime + (item.prepTime * 0.35 * (item.quantity - 1));
      }
    }

    const avgTime = Object.keys(cart).length > 0 ? Math.round(accumulatedTime) : 0;
    return { totalPrice, totalItems, avgTime };
  },

  updateUI() {
    const { totalPrice, totalItems, avgTime } = this.calculateTotals();
    const cart = this.getCart();

    // 1. Update Header cart count badge
    const headerCount = document.getElementById('header-cart-count');
    if (headerCount) {
      headerCount.textContent = totalItems;
      headerCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // 2. Update Bottom Floating Bar
    const summaryBar = document.getElementById('order-summary-bar');
    if (summaryBar) {
      if (totalItems > 0) {
        summaryBar.classList.add('active');
        const priceEl = document.getElementById('bar-total-price');
        const timeEl = document.getElementById('bar-avg-time');
        const itemsEl = document.getElementById('bar-total-items');
        if (priceEl) priceEl.textContent = totalPrice.toFixed(2);
        if (timeEl) timeEl.textContent = avgTime;
        if (itemsEl) itemsEl.textContent = totalItems;
      } else {
        summaryBar.classList.remove('active');
      }
    }

    // 3. Update Menu Page input controls
    document.querySelectorAll('.item-qty-input').forEach(input => {
      const itemId = input.dataset.itemId;
      const qty = cart[itemId] ? cart[itemId].quantity : 0;
      input.value = qty;

      const controlWrap = document.getElementById(`controls-${itemId}`);
      const addBtn = document.getElementById(`addbtn-${itemId}`);
      if (controlWrap && addBtn) {
        if (qty > 0) {
          controlWrap.style.display = 'flex';
          addBtn.style.display = 'none';
        } else {
          controlWrap.style.display = 'none';
          addBtn.style.display = 'inline-flex';
        }
      }
    });

    // 4. Update Cart Tray Drawer list
    this.renderDrawer();
  },

  renderDrawer() {
    const drawerList = document.getElementById('cart-drawer-items');
    if (!drawerList) return;

    const cart = this.getCart();
    const items = Object.values(cart);
    const { totalPrice, avgTime } = this.calculateTotals();

    if (items.length === 0) {
      drawerList.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: #888;">
          <p style="font-size: 1.2rem; font-weight: 700; color: #333; margin-bottom: 6px;">Your food tray is empty</p>
          <p style="font-size: 0.8rem;">Explore the campus menu to add hot snacks, shakes, and meals!</p>
        </div>
      `;
      const footer = document.getElementById('cart-drawer-footer');
      if (footer) footer.style.display = 'none';
      return;
    }

    let html = '';
    for (let it of items) {
      html += `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 10px; max-width: 60%;">
            <img src="${it.imageUrl}" alt="${it.name}" style="width: 48px; height: 48px; border-radius: 6px; object-fit: cover; filter: grayscale(100%);">
            <div>
              <div style="font-weight: 700; font-size: 0.85rem; color: #111;">${it.name}</div>
              <div style="font-size: 0.75rem; color: #666;">Rs. ${it.price} • ${it.prepTime}m prep</div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #0d9488;">Rs. ${(it.price * it.quantity).toFixed(2)}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; background: #f3f4f6; padding: 4px; border-radius: 6px;">
            <button onclick="CartManager.decreaseQuantity('${it.id}')" style="width: 24px; height: 24px; border: none; background: #000; color: #fff; border-radius: 4px; cursor: pointer; font-weight: bold;">-</button>
            <span style="min-width: 20px; text-align: center; font-weight: bold; font-size: 0.85rem;">${it.quantity}</span>
            <button onclick="CartManager.increaseQuantity('${it.id}')" style="width: 24px; height: 24px; border: none; background: #000; color: #fff; border-radius: 4px; cursor: pointer; font-weight: bold;">+</button>
            <button onclick="CartManager.deleteItem('${it.id}')" style="border: none; background: none; color: #ef4444; cursor: pointer; margin-left: 4px;" title="Delete">🗑</button>
          </div>
        </div>
      `;
    }

    drawerList.innerHTML = html;
    const footer = document.getElementById('cart-drawer-footer');
    if (footer) {
      footer.style.display = 'block';
      document.getElementById('drawer-subtotal').textContent = `Rs. ${totalPrice.toFixed(2)}`;
      document.getElementById('drawer-time').textContent = `~${avgTime} mins`;
      document.getElementById('drawer-total').textContent = `Rs. ${totalPrice.toFixed(2)}`;
    }
  }
};

// UI Toggles
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

function openDrawer(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function closeDrawer(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

// Checkout Modal Launcher
function triggerCheckout() {
  const { totalPrice, avgTime, totalItems } = CartManager.calculateTotals();
  if (totalItems === 0) {
    alert("Please add at least one dish to your food tray before checking out!");
    return;
  }

  closeDrawer('cart-drawer');
  const tax = Math.round(totalPrice * 0.05 * 100) / 100;
  const isDelivery = document.getElementById('checkout-delivery-type')?.value === 'campus_delivery';
  const deliveryFee = isDelivery ? 20 : 0;
  const grandTotal = Math.round((totalPrice + tax + deliveryFee) * 100) / 100;

  document.getElementById('checkout-subtotal').textContent = `Rs. ${totalPrice.toFixed(2)}`;
  document.getElementById('checkout-tax').textContent = `Rs. ${tax.toFixed(2)}`;
  document.getElementById('checkout-time').textContent = `~${avgTime} mins`;
  document.getElementById('checkout-grand-total').textContent = `Rs. ${grandTotal.toFixed(2)}`;

  openModal('checkout-modal');
}

// Checkout Submit
async function submitOrder(event) {
  event.preventDefault();
  const cart = CartManager.getCart();
  const itemsArray = Object.values(cart).map(it => ({
    menu_item_id: it.id,
    quantity: it.quantity
  }));

  if (itemsArray.length === 0) {
    alert("Your tray is empty.");
    return;
  }

  const studentIdInput = document.getElementById('checkout-student-id');
  const studentId = studentIdInput ? studentIdInput.value.trim() : '';

  const deliveryType = document.getElementById('checkout-delivery-type').value;
  const deliveryLocation = document.getElementById('checkout-delivery-location')?.value || 'Campus Canteen Counter';
  const specialInstructions = document.getElementById('checkout-instructions')?.value || '';

  const submitBtn = document.getElementById('checkout-submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Verifying & Sending to Kitchen...';

  try {
    const res = await fetch('/api/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        student_id: studentId,
        delivery_type: deliveryType,
        delivery_location: deliveryLocation,
        special_instructions: specialInstructions,
        items: itemsArray
      })
    });

    const data = await res.json();
    if (res.ok && data.success && data.order) {
      CartManager.clearCart();
      window.location.href = `/orders/${data.order.order_number}/`;
    } else {
      alert(data.message || 'Could not place order. Please check inputs.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm Order';
    }
  } catch (err) {
    alert('Network error while placing order.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Confirm Order';
  }
}

// AI Assistant Controller
const AIChatController = {
  messages: [
    { role: 'assistant', content: 'Hello! I am Zaika AI, your campus food assistant. What are you craving today, or do you need a quick snack recommendation for your study break?' }
  ],

  async send(promptText) {
    const input = document.getElementById('ai-chat-input');
    const text = promptText || (input ? input.value.trim() : '');
    if (!text) return;

    this.messages.push({ role: 'user', content: text });
    if (input) input.value = '';
    this.render();

    const loadingIndicator = document.getElementById('ai-chat-loading');
    if (loadingIndicator) loadingIndicator.style.display = 'block';

    try {
      const res = await fetch('/api/ai/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          messages: this.messages,
          preferred_provider: 'auto'
        })
      });

      const data = await res.json();
      if (data.success && data.reply) {
        this.messages.push({ role: 'assistant', content: data.reply });
      } else {
        this.messages.push({ role: 'assistant', content: 'How about trying our Hot Coffee or crispy Paneer Burger?' });
      }
    } catch {
      this.messages.push({ role: 'assistant', content: 'Connection issue. Please ask again in a moment.' });
    } finally {
      if (loadingIndicator) loadingIndicator.style.display = 'none';
      this.render();
    }
  },

  render() {
    const container = document.getElementById('ai-messages-container');
    if (!container) return;

    let html = '';
    for (let m of this.messages) {
      const isUser = m.role === 'user';
      html += `
        <div style="display: flex; margin-bottom: 10px; justify-content: ${isUser ? 'flex-end' : 'flex-start'};">
          <div style="max-width: 80%; padding: 10px 14px; border-radius: 12px; font-size: 0.85rem; line-height: 1.4; ${isUser ? 'background: #000; color: #fff; border-bottom-right-radius: 2px;' : 'background: #f3f4f6; color: #111; border: 1px solid #e5e7eb; border-bottom-left-radius: 2px;'}">
            ${m.content}
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
  }
};

// Document Initializer
document.addEventListener('DOMContentLoaded', () => {
  CartManager.updateUI();
  AIChatController.render();
});

