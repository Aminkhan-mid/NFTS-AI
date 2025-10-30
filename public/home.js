import { userDetails } from "./login.js"
const homeContainer = document.getElementById('home-container')
const navPfp = document.getElementById("nav-pfp") 
const userName = document.getElementById("user-name")
const svgSpinner =  document.getElementById('svg-spinner')



navPfp.src = `https://api.dicebear.com/9.x/lorelei/svg?seed=${Math.random()}&r=${Date.now()}`

userDetails.forEach(user => {
  userName.innerHTML =`
<p class="user-name" style="font-size: 1.3rem;">${user.name}</p>`
})
async function loadNFT() {
    const res = await fetch("/api/nft")
    const data = await res.json()
  if(!Array.isArray(data)){
    document.body.innerHTML = `<h2>Server error</h2>`
    return
  }
  homeContainer.innerHTML = data.map((nft) => 
    `
  <div class="nft-container">
    <img class="nft-img" src="${nft.imageURL}" alt="${data.name}">
    <div class="nft-name-type">
      <span>
        <p>${nft.name}</p>
        <p>${nft.type}</p>
      </span>
      <i class="fa-solid fa-heart"></i>
    </div>
      <div class="nftTags-container">
        ${nft.attributes.map((attr, i) => {
          return `
          <p class="tags ${ ["one", "two", "three", "four", "five"] [i % 5]}">${attr.trait_type || "?"}: ${attr.value || "?"}</p>
          `
        }).join("")}
        </div>
      <div class="buttons-div">
        <button class="buy-nftBtn">Buy NFT</button>
        <button class="view-nftBtn">View NFT</button>
    </div>
  </div>
  `).join("")

  document.querySelectorAll(".view-nftBtn").forEach((btn, i) => {
    btn.addEventListener("click", async () => {
      console.log(`🟣 Fetching AI description for: ${data[i].name}`)

      const aiData = await getNFTDescription(data[i])

      // Save NFT + AI data for next page
      localStorage.setItem("selectedNFT", JSON.stringify(data[i]))
      localStorage.setItem("aiData", JSON.stringify(aiData))

      // Go to view page
      window.location.href = "./viewNft.html"
    })
  })

  document.querySelectorAll(".buy-nftBtn").forEach((btn, i) => {
    btn.addEventListener("click", async () => {
      console.log(`📦 Packaging nft using AI for: ${data[i].name}`)
      const aiBuyData = await getNFTBuyingPage(data[i])
      localStorage.setItem("selectedBuyNFT", JSON.stringify(data[i]))
      localStorage.setItem("aiBuyData", JSON.stringify(aiBuyData))
      window.location.href = ("./buyNft.html")
    })
  })

let likedList = JSON.parse(localStorage.getItem("likedNFTS")) || [];

// 🖤 Set heart colors on load
document.querySelectorAll(".fa-heart").forEach((btn, i) => {
  const isLiked = likedList.some(n => n.name === data[i].name);
  if (isLiked) {
    btn.classList.add("liked");
    btn.style.color = "red";
  } else {
    btn.style.color = "gray";
  }

  // ❤️ Handle click
  btn.addEventListener("click", () => {
    console.log(`❤️ NFT like toggled for: ${data[i].name}`);
    const isNowLiked = btn.classList.toggle("liked");
    btn.style.color = isNowLiked ? "red" : "gray";

    if (isNowLiked) {
      likedList.push(data[i]);
    } else {
      likedList = likedList.filter(n => n.name !== data[i].name);
    }

    localStorage.setItem("likedNFTS", JSON.stringify(likedList));
  });
});
}
async function getNFTDescription(nft) {
   svgSpinner.innerHTML = `<div class="svg-spinners--gooey-balls-2"></div>`
    const res = await fetch("/api/nft/describe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nft.name,
        description: nft.attributes?.map(a => `${a.trait_type}: ${a.value}`).join(", ")
      })
    })
    const data = await res.json()
    if(data){
       svgSpinner.innerHTML = ""
    }
    console.log("🧠 AI Response:", data)
    return data
  }
async function getNFTBuyingPage(nft) {
   svgSpinner.innerHTML = `<div class="svg-spinners--gooey-balls-2"></div>`
    const res = await fetch("/api/nft/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nft.name,
        description: nft.attributes?.map(a => `${a.trait_type}: ${a.value}`).join(", ")
      })
    })
    const data = await res.json()
    if(data){
       svgSpinner.innerHTML = ""
    }
    console.log("🧠 AI Response:", data)
    return data
}

loadNFT()





