/* =========================
FILE: assets/js/products.js
========================= */

fetch("assets/data/products.json")
  .then(res => res.json())
  .then(data => {
    const grid = document.getElementById("productsGrid");
    const filters = document.getElementById("categoryFilters");

    let activeCategory = "All";

    const renderFilters = () => {
      filters.innerHTML = `<button class="filter active" data-cat="All">All</button>`;
      data.categories.forEach(cat => {
        filters.innerHTML += `<button class="filter" data-cat="${cat}">${cat}</button>`;
      });

      filters.querySelectorAll("button").forEach(btn => {
        btn.onclick = () => {
          activeCategory = btn.dataset.cat;
          filters.querySelectorAll("button").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          renderProducts();
        };
      });
    };

    const renderProducts = () => {
      grid.innerHTML = "";
      data.products
        .filter(p => activeCategory === "All" || p.category === activeCategory)
        .forEach(p => {
          const card = document.createElement("a");
          card.href = `product.html?id=${p.id}`;
          card.className = "card product-card parallax-card";
          card.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="muted">${p.category}</p>
          `;
          grid.appendChild(card);
        });
    };

    renderFilters();
    renderProducts();
  });

  /* =========================
FILE: assets/js/product.js
========================= */

fetch("assets/data/products.json")
  .then(res => res.json())
  .then(data => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const product = data.products.find(p => p.id === id);
    if (!product) return;

    document.getElementById("productName").textContent = product.name;
    document.getElementById("productCategory").textContent = product.category;
    document.getElementById("productDescription").textContent = product.description;
    document.getElementById("productImage").src = product.image;
  });
