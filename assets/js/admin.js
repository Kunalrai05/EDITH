/* =========================
ADMIN SYSTEM — STATIC SAFE
RESSINIQ
========================= */

const PASSWORD = "ressiniq-admin"; // change

const loginSection = document.getElementById("loginSection");
const dashboard = document.getElementById("dashboard");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const form = document.getElementById("productForm");
const list = document.getElementById("adminProducts");

let db = {
  categories: [],
  products: []
};

/* =========================
AUTH
========================= */
loginBtn.onclick = () => {
  if (adminPassword.value === PASSWORD) {
    sessionStorage.setItem("admin-auth", "true");
    init();
  } else {
    alert("Wrong password");
  }
};

logoutBtn.onclick = () => {
  sessionStorage.clear();
  location.reload();
};

if (sessionStorage.getItem("admin-auth")) init();

/* =========================
INIT
========================= */
function init() {
  loginSection.style.display = "none";
  dashboard.classList.remove("hidden");
  loadDB();
  render();
}

/* =========================
DB
========================= */
function loadDB() {
  const saved = localStorage.getItem("ressiniq-products");
  if (saved) db = JSON.parse(saved);
}

function saveDB() {
  localStorage.setItem("ressiniq-products", JSON.stringify(db));
}

/* =========================
RENDER
========================= */
function render() {
  list.innerHTML = "";

  if (db.products.length === 0) {
    list.innerHTML = "<p class='muted'>No products yet.</p>";
    return;
  }

  db.products.forEach(p => {
    const div = document.createElement("div");
    div.className = "admin-product";
    div.innerHTML = `
      <div>
        <strong>${p.name}</strong><br/>
        <span class="muted">${p.category}</span>
      </div>
      <div>
        <button onclick="edit('${p.id}')">Edit</button>
        <button onclick="remove('${p.id}')">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

/* =========================
CRUD
========================= */
form.onsubmit = e => {
  e.preventDefault();

  const product = {
    id: productId.value || Date.now().toString(),
    name: productName.value.trim(),
    category: productCategory.value.trim(),
    description: productDescription.value.trim(),
    image: productImage.value.trim()
  };

  if (!product.name || !product.category || !product.image) {
    alert("All fields required");
    return;
  }

  const index = db.products.findIndex(p => p.id === product.id);
  if (index >= 0) {
    db.products[index] = product;
  } else {
    db.products.push(product);
  }

  if (!db.categories.includes(product.category)) {
    db.categories.push(product.category);
  }

  saveDB();
  form.reset();
  productId.value = "";
  render();
};

window.edit = id => {
  const p = db.products.find(x => x.id === id);
  if (!p) return;

  productId.value = p.id;
  productName.value = p.name;
  productCategory.value = p.category;
  productDescription.value = p.description;
  productImage.value = p.image;
};

window.remove = id => {
  if (!confirm("Delete product?")) return;
  db.products = db.products.filter(p => p.id !== id);
  saveDB();
  render();
};

/* =========================
EXPORT
========================= */
window.exportJSON = () => {
  const json = JSON.stringify(db, null, 2);
  navigator.clipboard.writeText(json);
  alert("JSON copied. Replace assets/data/products.json");
};
