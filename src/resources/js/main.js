const product = document.getElementById("product");
const changeLanguage = document.getElementById("changeLanguage");

if (product) {
  const toggleButton = product.querySelector("#productBtn");
  toggleButton.addEventListener("click", (e) => {
    e.stopPropagation();
    product.classList.toggle("active");
  });
  document.addEventListener("click", (e) => {
    if (!product.contains(e.target)) {
      product.classList.remove("active");
    }
  });
}

if (changeLanguage) {
  const toggleButton = changeLanguage.querySelector("#changeLanguageBtn");
  toggleButton.addEventListener("click", (e) => {
    e.stopPropagation();
    changeLanguage.classList.toggle("active");
  });
  document.addEventListener("click", (e) => {
    if (!changeLanguage.contains(e.target)) {
      changeLanguage.classList.remove("active");
    }
  });
}
