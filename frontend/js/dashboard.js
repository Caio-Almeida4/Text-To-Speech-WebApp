const token = localStorage.getItem("jwToken")

if (!token) {
alert("Faça login primeiro!");
window.location.href = "index.html";

} else {
    document.body.style.display = "block"
    getUserData()
}

async function getUserData() {
    try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await res.json()

        if(res.ok) {
            const welcomeMessage = document.getElementById("welcomeMessage").innerText = `Olá, ${data.fullName}` 

        } else {
            alert("Sua sessão expirou. Faça login novamente.");
            localStorage.removeItem("jwToken");
            window.location.href = "index.html";
        }

    } catch {
        console.error("Erro ao buscar dados:", error);
        
    }
}

const logoutBtn = document.getElementById("logoutBtn")

logoutBtn.addEventListener("click", () => {

    console.log("O JavaScript ouviu o clique!");

    localStorage.removeItem("jwToken")
    window.location.href = "index.html"
})