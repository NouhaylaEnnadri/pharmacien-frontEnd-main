async function fetchProducts(categoryToFilter, subcategoryToFilter) {
    try {
      const response = await fetch("http://localhost:5001/api/product");
      const products = await response.json();
  
      const productContainer = document.getElementById("productContainer");
      productContainer.innerHTML = "";
  
      products.forEach((product) => {
        if (product.category === categoryToFilter && (categoryToFilter !== "produits anapath" || product.subCategory === subcategoryToFilter)) {
          const card = document.createElement("div");
          card.className = "col-sm-3";
          card.innerHTML = `
              <div class="thumb-wrapper">
                <a href="product-page.html?id=${product.name}">
                  <div class="img-box">
                    <img src="http://127.0.0.1:5505/server/${product.image}" class="img-fluid" alt="${product.name}" />
                  </div>
                  <div class="thumb-content">
                    <h4>${product.name}</h4>
                  </div>
                </a>
              </div>
            `;
          productContainer.appendChild(card);
  
          card.addEventListener("click", () => {
            fetchAndPopulateProductDetails(product.name);
          });
        }
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Error fetching products. Please try again.");
    }
  }
  