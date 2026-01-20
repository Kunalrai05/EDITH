const PASSWORD = "ressiniq-admin";

/* =========================
STATE (SINGLE SOURCE)
========================= */
let db = {
  categories: [
    { id: "resin", name: "Resin" },
    { id: "wood", name: "Wood" },
    { id: "custom", name: "Custom" },
    { id: "digital", name: "Digital" }
  ],
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
  renderAll();
}

/* =========================
STORAGE
========================= */
function loadDB() {
  const saved = localStorage.getItem("ressiniq-cms-db");
  if (saved) {
    try {
      db = JSON.parse(saved);
    } catch {
      localStorage.removeItem("ressiniq-cms-db");
    }
  }
}

function saveDB() {
  localStorage.setItem("ressiniq-cms-db", JSON.stringify(db));
}

/* =========================
RENDER ALL
========================= */
function renderAll() {
  renderCategorySelect();
  renderCategoryList();
  renderProductList();
}

/* =========================
CATEGORIES
========================= */
function renderCategorySelect() {
  productCategory.innerHTML = "";
  db.categories.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    productCategory.appendChild(opt);
  });
}

function renderCategoryList() {
  categoryList.innerHTML = "";

  db.categories.forEach(cat => {
    const inUse = db.products.some(p => p.category === cat.id);

    const row = document.createElement("div");
    row.className = "admin-item";

    row.innerHTML = `
      <div>
        <strong>${cat.name}</strong>
        <span class="muted">(${cat.id})</span>
      </div>
      <div>
        <button onclick="renameCategory('${cat.id}')">Rename</button>
        <button ${inUse ? "disabled" : ""} onclick="deleteCategory('${cat.id}')">
          Delete
        </button>
      </div>
    `;

    categoryList.appendChild(row);
  });
}

window.addCategory = () => {
  const name = newCategoryName.value.trim();
  if (!name) return;

  const id = name.toLowerCase().replace(/\s+/g, "-");
  if (db.categories.some(c => c.id === id)) {
    alert("Category already exists");
    return;
  }

  db.categories.push({ id, name });
  newCategoryName.value = "";
  saveDB();
  renderAll();
};

window.renameCategory = id => {
  const cat = db.categories.find(c => c.id === id);
  if (!cat) return;

  const newName = prompt("Rename category", cat.name);
  if (!newName) return;

  cat.name = newName.trim();
  saveDB();
  renderAll();
};

window.deleteCategory = id => {
  if (db.products.some(p => p.category === id)) {
    alert("Category is in use");
    return;
  }

  db.categories = db.categories.filter(c => c.id !== id);
  saveDB();
  renderAll();
};

/* =========================
PRODUCTS
========================= */
function renderProductList() {
  adminProducts.innerHTML = "";

  if (!db.products.length) {
    adminProducts.innerHTML = "<p class='muted'>No products yet</p>";
    return;
  }

  db.products.forEach(p => {
    const div = document.createElement("div");
    div.className = "admin-item";

    div.innerHTML = `
      <div>
        <strong>${p.name}</strong><br>
        <span class="muted">
          ${p.category} · ${p.type} · ${p.status}
          ${p.price ? "· ₹" + p.price : ""}
        </span>
      </div>
      <div>
        <button onclick="editProduct('${p.id}')">Edit</button>
        <button onclick="deleteProduct('${p.id}')">Delete</button>
      </div>
    `;

    adminProducts.appendChild(div);
  });
}

/* =========================
FORM SUBMIT
========================= */
productForm.onsubmit = e => {
  e.preventDefault();

  const images = productImages.value
    .split("\n")
    .map(i => i.trim())
    .filter(Boolean)
    .map(p => `assets/images/${p.split(/[/\\]/).pop()}`);

  const product = {
    id: productId.value || Date.now().toString(),
    name: productName.value.trim(),
    category: productCategory.value,
    type: productType.value,
    price: productPrice.value ? Number(productPrice.value) : null,
    status: productStatus.value,
    images,
    description: productDescription.value.trim()
  };

  const index = db.products.findIndex(p => p.id === product.id);
  index >= 0 ? (db.products[index] = product) : db.products.push(product);

  saveDB();
  productForm.reset();
  productId.value = "";
  renderProductList();
};

/* =========================
EDIT / DELETE PRODUCT
========================= */
window.editProduct = id => {
  const p = db.products.find(x => x.id === id);
  if (!p) return;

  productId.value = p.id;
  productName.value = p.name;
  productCategory.value = p.category;
  productType.value = p.type;
  productPrice.value = p.price || "";
  productStatus.value = p.status;
  productImages.value = p.images.join("\n");
  productDescription.value = p.description;
};

window.deleteProduct = id => {
  if (!confirm("Delete product?")) return;
  db.products = db.products.filter(p => p.id !== id);
  saveDB();
  renderProductList();
};

/* =========================
EXPORT
========================= */
window.exportJSON = () => {
  const output = {
    categories: db.categories.map(c => c.name),
    products: db.products
  };

  navigator.clipboard.writeText(JSON.stringify(output, null, 2));
  alert("Exported.\nPaste into assets/data/products.json");
};
