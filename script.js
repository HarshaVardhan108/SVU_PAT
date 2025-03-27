// Collect the form data
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent default form submission

      const formData = new FormData(this);
      const dataObject = {};
      
      // Convert FormData to a plain object
      formData.forEach((value, key) => {
          dataObject[key] = value;
      });

      // Send a POST request to your Google Apps Script
      fetch("https://script.google.com/macros/s/AKfycbzGMSmSTdAfGOM5Yz9XSEbZed27WjdAsbd0H63ChhcWq-l1AUDcd7dekL58y-tgob_rCw/exec", {
          method: "POST",
          body: JSON.stringify(dataObject), // Send as JSON
          headers: {
              "Content-Type": "application/json",
          },
      })
      .then(response => {
          if (response.ok) {
              return response.json(); // Assuming your script returns JSON response
          } else {
              throw new Error("Failed to submit the form.");
          }
      })
      .then(data => {
          // Display a success message
          document.getElementById("message").textContent = "Data submitted successfully!";
          document.getElementById("message").style.display = "block";
          document.getElementById("message").style.backgroundColor = "green";
          document.getElementById("message").style.color = "beige";
          form.reset();

          setTimeout(() => {
              document.getElementById("message").textContent = "";
              document.getElementById("message").style.display = "none";
          }, 2600);
      })
      .catch(error => {
          console.error(error);
          document.getElementById("message").textContent = "An error occurred while submitting the form.";
          document.getElementById("message").style.display = "block";
      });
  });
});