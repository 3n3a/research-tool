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

// Show Element by Selector
window.showEl = (elSelector) => {
  htmx.find(elSelector).hidden = false
}

// Remove Elements by Selector
window.cleanEls = (elSelector) => {
  htmx.findAll(elSelector).forEach(e => e.remove())
}

htmx.onLoad(() => {
  // Hide Loading Indicator if Empty Form
  if (!allFilledSubdomainsForm()) {
    htmx.findAll('#loading-indicator').forEach(e => {
      e.hidden = true;
    })
  }
})
// htmx.logAll();
