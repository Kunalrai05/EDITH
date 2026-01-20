/* =========================
FILE: assets/js/products.js
DO NOT EDIT HTML/CSS
========================= */

fetch("assets/data/products.json")
  .then(res => res.json())
  .then(data => {
    const productsGrid = document.getElementById("productsGrid");
    const filters = document.getElementById("categoryFilters");
    const categoryGrid = document.getElementById("categoryGrid");

    if (!productsGrid) return;

    let activeCategory = "all";

    /* =========================
    CATEGORY → IMAGE MAP (STRICT)
    ========================= */
    const CATEGORY_IMAGES = {
      resin: "assets/images/category-resin.jpg",
      wood: "assets/images/category-wood.jpg",
      custom: "assets/images/category-custom.jpg",
      digital: "assets/images/category-digital.jpg"
    };

    /* =========================
    NORMALIZE CATEGORIES
    ========================= */
    const categories = (data.categories || []).map(cat => {
      if (typeof cat === "string") {
        const id = cat.toLowerCase();
        return {
          id,
          name: cat,
          image: CATEGORY_IMAGES[id]
        };
      }

      return {
        id: cat.id,
        name: cat.name,
        image: CATEGORY_IMAGES[cat.id]
      };
    });

    /* =========================
    CATEGORY SHOWCASE
    ========================= */
    function renderCategoryShowcase() {
      if (!categoryGrid) return;

      categoryGrid.innerHTML = "";

      categories.forEach(cat => {
        const card = document.createElement("div");
        card.className = "category-card parallax-card";

        card.innerHTML = `
          <img src="${cat.image}" alt="${cat.name}">
          <div class="category-label">${cat.name}</div>
        `;

        card.addEventListener("click", () => {
          activeCategory = cat.id;
          updateFilterUI(cat.id);
          renderProducts();
          productsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        categoryGrid.appendChild(card);
      });
    }

    /* =========================
    FILTER BUTTONS
    ========================= */
    function renderFilters() {
      if (!filters) return;

      filters.innerHTML = `<button class="filter active" data-cat="all">All</button>`;

      categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "filter";
        btn.dataset.cat = cat.id;
        btn.textContent = cat.name;

        btn.addEventListener("click", () => {
          activeCategory = cat.id;
          updateFilterUI(cat.id);
          renderProducts();
        });

        filters.appendChild(btn);
      });
    }

    function updateFilterUI(catId) {
      if (!filters) return;

      filters.querySelectorAll(".filter").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.cat === catId);
      });
    }

    /* =========================
    PRODUCTS RENDER
    ========================= */
    function renderProducts() {
      productsGrid.innerHTML = "";

      (data.products || [])
        .filter(p => p.status === "live" || !p.status)
        .filter(p => activeCategory === "all" || p.category === activeCategory)
        .forEach(p => {
          const categoryName =
            categories.find(c => c.id === p.category)?.name || "";

          const hasImage =
            Array.isArray(p.images) && p.images.length && p.images[0];

          const card = document.createElement("a");
          card.href = `product.html?id=${p.id}`;
          card.className = "card product-card parallax-card";

          card.innerHTML = `
            ${hasImage ? `<img src="${p.images[0]}" alt="${p.name}">` : ""}
            <h3>${p.name}</h3>
            <p class="muted">${categoryName}</p>
          `;

          productsGrid.appendChild(card);
        });
    }

    /* =========================
    INIT
    ========================= */
    renderCategoryShowcase();
    renderFilters();
    renderProducts();
  })
  .catch(err => {
    console.error("Products load failed:", err);
  });
  
