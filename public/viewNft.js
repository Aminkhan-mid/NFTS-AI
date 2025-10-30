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

const buyBtn = document.getElementById("buy-btn") 
const svgSpinner =  document.getElementById('svg-spinner')

// ✅ When "Buy NFT" button is clicked
buyBtn.addEventListener("click", async () => {
   svgSpinner.innerHTML = `<div class="svg-spinners--gooey-balls-2"></div>`
  console.log(`💰 Preparing to buy: ${nft.name}`);

  try {
    const res = await fetch("/api/nft/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nft.name,
        description: nft.attributes
          ?.map(a => `${a.trait_type}: ${a.value}`)
          .join(", "),
      }),
    });

    const aiBuyData = await res.json();
    console.log("🧠 AI Buy Page Data:", aiBuyData);

    // Store for the buy page
    localStorage.setItem("selectedBuyNFT", JSON.stringify(nft));
    localStorage.setItem("aiBuyData", JSON.stringify(aiBuyData));

    // Navigate to buy page
    window.location.href = "./buyNft.html";
  } catch (err) {
    console.error("❌ Error triggering buy page:", err);
    alert("Failed to load Buy NFT page");
  }
});