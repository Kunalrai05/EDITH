fetch("assets/data/products.json")
  .then(res => res.json())
  .then(data => {
    const id = new URLSearchParams(window.location.search).get("id");
    const product = data.products.find(p => p.id === id);

    if (!product) {
      document.body.innerHTML = "<h2>Product not found</h2>";
      return;
    }

    /* CONTENT */
    productName.textContent = product.name;
    productCategory.textContent = product.category;
    productDescription.textContent = product.description;

    productPrice.textContent = product.price
      ? `₹${product.price}`
      : "Price on enquiry";

    /* GALLERY */
    mainImage.src = product.images[0];

    thumbnails.innerHTML = "";
    product.images.forEach((img, i) => {
      const t = document.createElement("img");
      t.src = img;
      t.className = "thumbnail" + (i === 0 ? " active" : "");
      t.onclick = () => {
        document
          .querySelectorAll(".thumbnail")
          .forEach(el => el.classList.remove("active"));
        t.classList.add("active");
        mainImage.style.opacity = "0";
        setTimeout(() => {
          mainImage.src = img;
          mainImage.style.opacity = "1";
        }, 150);
      };
      thumbnails.appendChild(t);
    });

    /* ACTIONS */
    addToCartBtn.onclick = () => addToCart(product);
    askQueryBtn.onclick = () => sendInstagramQuery();

    /* MOBILE CTA */
    if (window.innerWidth < 768) {
      const bar = document.createElement("div");
      bar.className = "mobile-cta";
      bar.innerHTML = `
        <button class="primary-btn">Add to Cart</button>
        <button class="ghost-btn">Ask a Query</button>
      `;
      document.body.appendChild(bar);

      bar.children[0].onclick = () => addToCart(product);
      bar.children[1].onclick = () => sendInstagramQuery();
    }
  });
