async function fetchProducts(categoryToFilter, subcategoryToFilter) {
    try {
        let url = `http://localhost:5001/api/product?category=${categoryToFilter}`;
        if (subcategoryToFilter) {
            url += `&subcategory=${subcategoryToFilter}`;
        }
        console.log("Fetching products with URL:", url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const products = await response.json();

        console.log("Received products:", products);

        
        const productContainer = document.getElementById("productContainer");
        productContainer.innerHTML = "";

        products.forEach((product) => {
            // Check if the product's category and subcategory match the desired category and subcategory
            if (product.category === categoryToFilter && (!subcategoryToFilter || product.subcategory === subcategoryToFilter)) {
                const card = document.createElement("div");
                card.className = "col-lg-3 col-md-6 col-sm-6 mb-4"; // Adjust classes as needed
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
            }
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        // Handle the error, e.g., show an alert
        alert("Error fetching products. Please try again.");
    }
}

// Fetch products when the page loads
fetchProducts("produits anapath");

// Fetch products when the window is resized
window.addEventListener('resize', function() {
    fetchProducts("produits anapath");
});
