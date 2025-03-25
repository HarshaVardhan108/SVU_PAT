// Collect the form data
var formData = new FormData(this);
var keyValuePairs = [];
for (var pair of formData.entries()) {
  keyValuePairs.push(pair[0] + "=" + pair[1]);
}

var formDataString = keyValuePairs.join("&");

// Send a POST request to your Google Apps Script
fetch(
  "https://script.google.com/macros/s/AKfycbySLIzbeE7R3i_zdyy3OBeFtDnSJc6eQ8sHFQa7X6ELxIyWfXyEPF7-e_EcSIyDYsBUig/exec",
  {
    redirect: "follow",
    method: "POST",
    body: formDataString,
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
  }
)
  .then(function (response) {
    // Check if the request was successful
    if (response) {
      return response; // Assuming your script returns JSON response
    } else {
      throw new Error("Failed to submit the form.");
    }
  })
  .then(function (data) {
    // Display a success message
    document.getElementById("message").textContent =
      "Data submitted successfully!";
    document.getElementById("message").style.display = "block";
    document.getElementById("message").style.backgroundColor = "green";
    document.getElementById("message").style.color = "beige";
    document.getElementsByClassName("nav-btn").disabled = false;
    document.getElementById("form").reset();

    setTimeout(function () {
      document.getElementById("message").textContent = "";
      document.getElementById("message").style.display = "none";
    }, 2600);
  })
  .catch(function (error) {
    // Handle errors, you can display an error message here
    console.error(error);
    document.getElementById("message").textContent =
      "An error occurred while submitting the form.";
    document.getElementById("message").style.display = "block";
  });
