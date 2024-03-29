// Function to extract query parameter from URL
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

async function fetchProductDetailsFromURL() {
  const productName = getParameterByName("id");
  console.log("Product Name from URL:", productName);
  if (productName) {
    try {
      const response = await fetch("http://localhost:5001/api/product");
      if (!response.ok) {
        throw new Error("Failed to fetch products. Status: ${response.status}");
      }
      const products = await response.json();
      const product = products.find((product) => product.name === productName);
      if (product) {
        populateProductDetails(product);
      } else {
        console.error("Product not found.");
        alert("Product not found.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Error fetching products. Please try again.");
    }
  } else {
    console.error("Product name not found in URL.");
    alert("Product name not found in URL.");
  }
}
const productName = getParameterByName("id");

console.log(productName);

function populateProductDetails(product) {
  document.getElementById("name").innerText = product.name;
  // Set the product description in the HTML
  document.getElementById("productDescription2").innerText =
    product.description;
  // Set the product category in the HTML
  document.getElementById("productCategory").innerText = product.category;
  // Set the product subcategory in the HTML
  document.getElementById("productSubcategory").innerText = product.subCategory;
  // Set the product image source and alt attributes
  const productImage = document.getElementById("productImage");
  productImage.src = "http://127.0.0.1:5505/server/" + product.image;
  productImage.alt = product.name;
}

fetchProductDetailsFromURL();