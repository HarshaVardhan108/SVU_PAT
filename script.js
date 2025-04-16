const scriptURL = 'https://script.google.com/macros/s/AKfycbzGMSmSTdAfGOM5Yz9XSEbZed27WjdAsbd0H63ChhcWq-l1AUDcd7dekL58y-tgob_rCw/exec'

const form = document.forms['assessment-form']

form.addEventListener('submit', e => {
  
  e.preventDefault()
  
  const formData = new FormData(form);
  const dataToSend = {};

  // Collect form data into a single object
  for (const [key, value] of formData.entries()) {
    dataToSend[key] = value;
  }

  // Send the data as a single object to avoid multiple rows
  fetch(scriptURL, { method: 'POST', body: JSON.stringify(dataToSend), headers: { 'Content-Type': 'application/json' } })
  .then(response => {
    if (response.ok) {
      alert("Thank you! Form is submitted");
      localStorage.removeItem('formData'); // Clear stored data after submission
      window.location.reload();
    } else {
      throw new Error('Network response was not ok.');
    }
  })
  .catch(error => console.error('Error!', error.message))
})