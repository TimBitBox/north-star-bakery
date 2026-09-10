const bakeryItems = ["Signature Loaf", "Pastries and cookies", "Celebration cakes"];
let favoriteItems = [];
const storageKey = "northStarFavorites";

function loadFavorites() {
  try {
    favoriteItems = JSON.parse(localStorage.getItem(storageKey)) || [];
    if (!Array.isArray(favoriteItems)) favoriteItems = [];
  } catch (error) {
    favoriteItems = [];
  }
}

function toggleFavorite(item) {
  if (favoriteItems.includes(item)) {
    favoriteItems = favoriteItems.filter(function (favorite) {
      return favorite !== item;
    });
  } else {
    favoriteItems.push(item);
  }
  localStorage.setItem(storageKey, JSON.stringify(favoriteItems));
  updateFavorites();
}

function updateFavorites() {
  const buttons = document.querySelectorAll("#favorite-options button");
  buttons.forEach(function (button) {
    const selected = favoriteItems.includes(button.dataset.item);
    button.setAttribute("aria-pressed", String(selected));
    button.textContent = (selected ? "Saved: " : "Save: ") + button.dataset.item;
  });
  const summary = document.getElementById("favorites-summary");
  if (summary) {
    summary.textContent = favoriteItems.length ? "Your favorites: " + favoriteItems.join(", ") : "No favorites saved yet.";
  }
}

function setupFavorites() {
  const options = document.getElementById("favorite-options");
  if (options) {
    bakeryItems.forEach(function (item) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.item = item;
      button.addEventListener("click", function () {
        toggleFavorite(item);
      });
      options.appendChild(button);
    });
    updateFavorites();
  }
  const savedList = document.getElementById("saved-favorites");
  if (savedList) {
    savedList.textContent = favoriteItems.length ? "Saved favorites: " + favoriteItems.join(", ") : "Save favorites on Our menu to add them to your request.";
    const addButton = document.getElementById("use-favorites");
    addButton.disabled = favoriteItems.length === 0;
    addButton.addEventListener("click", addFavoritesToForm);
  }
}

function addFavoritesToForm() {
  const details = document.getElementById("details");
  const favoriteText = "Favorites: " + favoriteItems.join(", ");
  if (!details.value.includes(favoriteText)) {
    details.value += (details.value ? "\n" : "") + favoriteText;
  }
  document.getElementById("request-type").value = "preorder";
  document.getElementById("favorites-added").textContent = "Favorites added. Include quantities and a pickup date.";
  details.focus();
}

function validateForm(event) {
  event.preventDefault();
  const fields = document.querySelectorAll("#request [required]");
  let valid = true;
  fields.forEach(function (field) {
    let message = "";
    if (!field.value.trim()) message = "Please complete this field.";
    else if (!field.validity.valid) message = "Please enter a valid email address.";
    document.getElementById(field.id + "-error").textContent = message;
    field.setAttribute("aria-invalid", String(message !== ""));
    if (message) valid = false;
  });
  const result = document.getElementById("request-result");
  result.hidden = !valid;
  if (valid) {
    document.getElementById("request-summary").textContent = document.getElementById("details").value;
    result.focus();
  }
}

loadFavorites();
setupFavorites();
const requestForm = document.getElementById("request");
if (requestForm) {
  requestForm.noValidate = true;
  requestForm.addEventListener("submit", validateForm);
  requestForm.addEventListener("input", function (event) {
    const fieldId = event.target.id;
    const message = document.getElementById(fieldId + "-error");
    if (message) {
      message.textContent = "";
      event.target.setAttribute("aria-invalid", "false");
    }
    document.getElementById("request-result").hidden = true;
  });
}
