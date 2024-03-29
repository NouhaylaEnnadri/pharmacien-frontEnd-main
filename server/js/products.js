// Function to fetch products from the server
async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:5001/api/product");
    const products = await response.json();

    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    products.forEach((product) => {
      const row = `
        <tr>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>${product.subCategory}</td>
          <td style="white-space: normal;">${product.description}</td>
          <td>
            <img src="http://127.0.0.1:5505/server/${product.image}" alt="${product.name}"
                style="max-width: 100px; max-height: 100px;">
          </td>
          <td>
            <a href="#editEmployeeModal" class="edit" data-toggle="modal">
              <i class="material-icons" onclick="editProduct('${product._id}')" data-toggle="tooltip" title="Edit">&#xE254;</i>
            </a>
            <a href="#deleteEmployeeModal" class="delete" data-toggle="modal">
              <i class="material-icons" onclick="deleteProduct('${product._id}')" data-toggle="tooltip" title="Delete">&#xE872;</i>
            </a>
            <a href="../../Table.html" class="btn btn-primary"><i class="material-icons">&#xE147;</i> <span></span></a>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    // Handle the error, e.g., show an alert
  }
}

// Function to submit the product form
async function submitForm() {
  try {
    const name = document.getElementById("productName").value;
    const description = document.getElementById("productDescription").value;
    const category = document.getElementById("productCategory").value;
    const subCategory = document.getElementById("productSubcategory").value;
    const imageInput = document.getElementById("productImage");
    const image = imageInput.files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("subCategory", subCategory);
    formData.append("category", category);
    formData.append("image", image);

    const response = await fetch("http://localhost:5001/api/product", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data.message);
      fetchProducts(); // Refresh the product list after successful submission
    } else {
      console.error("Failed to submit product:", data.message);
      // Handle failed submission, display error message, etc.
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Failed to fetch. Please check your network connection.");
  }
}

// Function to delete a product with confirmation
async function deleteProduct(productId) {
  try {
    // Ask for confirmation before proceeding
    const isConfirmed = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!isConfirmed) {
      return; // If not confirmed, exit the function
    }

    const response = await fetch(
      `http://localhost:5001/api/product/${productId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log(data.message);
      fetchProducts(); // Refresh the product list after successful deletion
    } else {
      console.error("Failed to delete product:", data.message);
      // Handle failed deletion, display error message, etc.
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Failed to fetch. Please check your network connection.");
  }
}

// Function to fetch and populate product details for editing
async function editProduct(productId) {
  try {
    const response = await fetch(`http://localhost:5001/api/product/${productId}`);
    const product = await response.json();

    document.getElementById("editProductName").value = product.name;
    document.getElementById("editProductDescription").value = product.description;
    document.getElementById("editProductCategory").value = product.category;

    const editProductImage = document.getElementById("editProductImage");
    if (editProductImage) {
      editProductImage.src = product.image || "path_to_previous_image.jpg";
    }

    $("#editEmployeeModal").modal("show");
  } catch (error) {
    console.error("Error fetching product details:", error);
    alert("Error fetching product details. Please try again.");
  }
}

// Function to update a product
async function updateProduct() {
  try {
    const currentProductId = getCurrentProductId(); // Assuming this function gets the current product ID
    const name = document.getElementById("editProductName").value;
    const description = document.getElementById("editProductDescription").value;
    const category = document.getElementById("editProductCategory").value;
    const imageInput = document.getElementById("editProductImage");
    const newImage = imageInput.files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", newImage);

    const response = await fetch(
      `http://localhost:5001/api/product/${currentProductId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log(data.message);
      fetchProducts(); // Refresh the product list after successful update
      $("#editEmployeeModal").modal("hide"); // Hide the "Edit Product" modal after updating
    } else {
      console.error("Failed to update product:", data.message);
      // Handle failed update, display error message, etc.
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Failed to fetch. Please check your network connection.");
  }
}

// Initial fetch of products when the page loads
fetchProducts();
