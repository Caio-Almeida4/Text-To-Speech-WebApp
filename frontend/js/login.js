const form = document.getElementById("loginForm")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

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
            alert(data.message)
            window.location.href = "dashboard.html"
        } else {
            alert(data.message)
        }


    } catch (error) {
        console.error("Erro na requisição:", error)
        alert("Não foi possível conectar ao servidor")
    }

})