const loggerName = document.getElementById("logger-name")
const loggerEmail = document.getElementById("logger-email")
const loggerPassword = document.getElementById("logger-password")
const loginBtn = document.getElementById("login")


if(loginBtn){
    loginBtn.addEventListener("click", ()=>{
        console.log("✅ Login btn clicked")
        let name = loggerName.value
        let email = loggerEmail.value
        let password = loggerPassword.value
        
        localStorage.setItem("user-name", name) 
        localStorage.setItem("user-email", email) 
        localStorage.setItem("user-password", password) 
        window.location.href = "./home.html"
    })
}

const userName = localStorage.getItem('user-name') || ""
const userEmail = localStorage.getItem('user-email') || ""
const userPassword = localStorage.getItem('user-password') || ""    


export const userDetails = [
    {
        name: userName,
        email: userEmail,
        password: userPassword 
    }
]

userDetails.forEach(user => {
    console.log("🧠 User Details:",user)
})


