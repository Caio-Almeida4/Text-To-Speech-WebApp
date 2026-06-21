const form = document.getElementById("loginForm")
const loginMessage = document.getElementById("loginMessage")

const setLoginMessage = (text, type) => {
    loginMessage.textContent = text
    loginMessage.className = `form-message ${type}`
}

form.addEventListener("submit", async (e) => {
    e.preventDefault()
    loginMessage.textContent = ""
    loginMessage.className = "form-message"

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    try{
        const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password})
        })

        const data = await res.json()

        if (res.ok) {
            localStorage.setItem("jwToken", data.token)
            window.location.href = "dashboard.html"
        } else {
            setLoginMessage(data.message, "error")
        }


    } catch (error) {
        console.error(error)
        setLoginMessage("Não foi possível conectar ao servidor", "error")
    }

})