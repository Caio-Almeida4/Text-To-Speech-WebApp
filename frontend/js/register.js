const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Captura dos dados
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ fullName, email, password })
        });

        const data = await res.json()

        if (res.ok) {
            alert(data.message)
            window.location.href = "index.html"; 
        } else {
            alert(data.message)
        }

    } catch (error) {
        console.error("Erro na requisição:", error)
        alert("Não foi possível conectar ao servidor.")
    }
});