/* =========================
CART SYSTEM + ENQUIRY ENGINE
========================= */

const CART_KEY = "ressiniq-cart";

/* BASIC CART */
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
}

/* ADD / UPDATE */
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(p => p.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price || null,
      type: product.type || "physical",
      images: product.images || [],
      qty: 1
    });
  }

  saveCart(cart);
  updateCartCount();
  alert("Added to cart");
}

function updateQty(id, delta) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    updateCartCount();
    return;
  }

  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter(p => p.id !== id);
  updateCartCount();
  saveCart(cart);
}

/* =========================
ENQUIRY MESSAGE BUILDER
========================= */
function buildQueryMessage() {
  const cart = getCart();
  if (!cart.length) return "";

  let msg = "Hi RESSINIQ 👋\n\n";
  msg += "I’m interested in the following products:\n\n";

  cart.forEach(p => {
    msg += `• ${p.name}`;
    msg += p.price ? ` — ₹${p.price}` : " — Price on enquiry";
    msg += ` × ${p.qty}\n`;
  });

  msg += "\nPlease let me know availability and next steps.\n\nThanks!";
  return msg;
}

/* =========================
SEND ACTIONS
========================= */
function sendInstagramQuery() {
  const message = buildQueryMessage();
  if (!message) {
    alert("Cart is empty");
    return;
  }

  // Instagram does not support pre-filled DMs reliably
  // So we copy message to clipboard and open profile
  navigator.clipboard.writeText(message).then(() => {
    alert("Message copied.\nPaste it in Instagram DM.");
    window.open("https://www.instagram.com/ressiniq/", "_blank");
  });
}

function sendEmailQuery() {
  const message = buildQueryMessage();
  if (!message) {
    alert("Cart is empty");
    return;
  }

  const body = encodeURIComponent(message);
  window.location.href =
    `mailto:ressiniq@gmail.com?subject=Product Enquiry – RESSINIQ&body=${body}`;

  // Optional: clear cart after email intent
  // clearCart();
}
/* =========================
CART COUNT INDICATOR
========================= */
function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (!el) return;

  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.qty, 0);

  el.textContent = total;
  el.classList.toggle("hidden", total === 0);
}

document.addEventListener("DOMContentLoaded", updateCartCount);
