import { userDetails } from "./login.js"
const homeContainer = document.getElementById('home-container')
const navPfp = document.getElementById("nav-pfp") 
const userName = document.getElementById("user-name")



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
  homeContainer.innerHTML = data
  .map((nft) => 
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
}

loadNFT()





