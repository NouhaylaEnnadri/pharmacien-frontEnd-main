async function login() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5001/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Directly include email and password in the body
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      // Redirect to another page after successful login
      window.location.href = "../../views/crudAdmin.html"; // Change "dashboard.html" to the desired URL
    } else {
      alert(data.message);
      // Handle failed login, display error message, etc.
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Failed to fetch. Please check your network connection.");
  }
}