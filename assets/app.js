/* All Fields Filled */
function allFilled(formSelector) {
  // Check if all form fields are filled
  const form = document.querySelector(formSelector);
  const inputs = form.querySelectorAll("input[required]");

  for (const input of inputs) {
    if (!input.value.trim()) {
      return false;
    }
  }

  return true;
}