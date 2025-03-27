const scriptURL = 'https://script.google.com/macros/s/AKfycbzGMSmSTdAfGOM5Yz9XSEbZed27WjdAsbd0H63ChhcWq-l1AUDcd7dekL58y-tgob_rCw/exec'

const form = document.forms['assessment-form']

form.addEventListener('submit', e => {
  
  e.preventDefault()
  
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
  .then(response => alert("Thank you! Form is submitted" ))
  .then(() => { window.location.reload(); })
  .catch(error => console.error('Error!', error.message))
})