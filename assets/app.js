import "htmx.org"
import './lib_htmx'

import "morphdom"
import "htmx.org/dist/ext/morphdom-swap"

/* All Fields Filled */
window.allFilledSubdomainsForm = () => window.allFilled("#subdomain-form")
window.allFilled = function (formSelector) {
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

window.showEl = (elSelector) => {
  htmx.find(elSelector).hidden = false
}
window.cleanEls = (elSelector) => {
  htmx.findAll(elSelector).forEach(e => e.remove())
}

htmx.logAll();
