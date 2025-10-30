const minusBtn = document.getElementById("minus-btn");
const plusBtn = document.getElementById("plus-btn");
const qty = document.getElementById("quantity");
const totalEl = document.getElementById("total");

const itemPrice = 0.79;
const fee = 0.02;
let quantity = 1;

function updateTotal() {
  const total = (itemPrice * quantity + fee).toFixed(2);
  totalEl.textContent = total + " ETH";
}

plusBtn.addEventListener("click", () => {
  quantity++;
  qty.textContent = quantity;
  updateTotal();
});

minusBtn.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    qty.textContent = quantity;
    updateTotal();
  }
});

updateTotal();


document.getElementById("back-btn").addEventListener("click", () => {
  window.location.href = "./home.html"
})
// Load NFT + AI data
const nft = JSON.parse(localStorage.getItem("selectedBuyNFT"));
const aiData = JSON.parse(localStorage.getItem("aiBuyData"));

if (!nft) {
  document.body.innerHTML = "<h2>No NFT data found</h2>";
} else {
  document.getElementById("nft-img").src = nft.imageURL;
  document.getElementById("nft-name").textContent = nft.name;
}

if (aiData) {
  document.getElementById("ai-shortDesc").textContent = aiData.shortDesc;
  document.getElementById("nft-value").textContent = aiData.shouldIBuy;
}
if (aiData && aiData.shortDesc) {
  document.getElementById("ai-shortDesc").textContent = aiData.shortDesc
} else {
  document.getElementById("ai-shortDesc").textContent = "No description available 😕"
}
