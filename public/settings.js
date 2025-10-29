import { userDetails } from "./login.js"
const profileBody = document.getElementById("profile-body")
const profilePfp = document.getElementById("profile-pfp")


userDetails.forEach(user => {
    const {name, email, password} = user

    profileBody.innerHTML = `
    <nav>
        <img class="profile-pfp" src="https://api.dicebear.com/9.x/lorelei/svg?seed=${Math.random()}&r=${Date.now()}" alt="">
        <span>
            <p class="userName-p">user-name</p>
            <p>${name}</p>
        </span>
    </nav>
    
    <img class="charizard-img" src="./imgs/charizard.gif" alt="">
    
    <div class="likes-container">
        <button class="yourLikes-btn">Your Likes</button>
    </div>
    
    
    <div class="details-flex">
        <p class="yourDetail-p">Email</p>
        <p class="yourDetail">${email}</p>
    </div>
    
    <div class="details-flex">
        <p class="yourDetail-p">Password</p>
        <p class="yourDetail">${password}</p>
    </div>
    
    <button id="delAcc-btn" class="delAcc-btn">Delete Account</button>

       <a href="./home.html">
            <i class="fa-solid fa-arrow-left"></i>
        </a>
    `

    document.getElementById("delAcc-btn").addEventListener("click", ()=> {
    localStorage.clear()
    window.location.href = "./index.html"
})
    })



