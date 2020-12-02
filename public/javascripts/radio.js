const inputs = [...document.querySelectorAll('#regionRadio')];

const handleChange = (event) => {
  if (
    event.target.checked
  ) {
    window.location.href = `http://localhost:3000/region/${event.target.value}`
  }
}

for (const i of inputs) {
  i.addEventListener('change', handleChange);
}
