document.getElementById("back-btn").addEventListener("click", () => {
  window.location.href = "./home.html"
})

const nft = JSON.parse(localStorage.getItem("selectedNFT"))
const aiData = JSON.parse(localStorage.getItem("aiData"))

if (!nft) {
  document.body.innerHTML = "<h2>No NFT data found</h2>"
} else {
  document.getElementById("nft-img").src = nft.imageURL
  document.getElementById("nft-name").textContent = nft.name
}

if (aiData) {
  document.getElementById("ai-shortDesc").textContent = aiData.shortDesc
  document.getElementById("ai-longDesc").textContent = aiData.longDesc
  document.getElementById("nft-value").textContent = aiData.shouldIBuy
}
