async function fetchProducts(categoryToFilter, subcategoryToFilter) {
  try {
    const response = await fetch("http://localhost:5001/api/product");
    const products = await response.json();

    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = "";

    products.forEach((product) => {
      if (
        product.category === categoryToFilter &&
        (categoryToFilter !== "produits anapath" ||
          product.subCategory === subcategoryToFilter)
      ) {
        const card = document.createElement("div");
        card.className = "col-lg-3 col-md-6 col-sm-6 col-12 mb-4 product-card"; // Updated grid classes
        card.innerHTML = `
                  <div class="thumb-wrapper d-flex flex-column justify-content-between" style="height: 100%; max-height: 300px;"> <!-- Adjust max-height as needed -->
                    <a href="product-page.html?id=${product.name}" style="height: 100%;">
                      <div class="img-box" style="height: 70%; overflow: hidden;"> <!-- Adjust height as needed -->
                        <img src="http://127.0.0.1:5505/server/${product.image}" class="img-fluid" alt="${product.name}">
                      </div>
                      <div class="thumb-content text-center py-2" style="height: 30%;"> <!-- Adjust height as needed -->
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
