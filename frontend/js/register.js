const form = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage")

const setRegisterMessage = (text, type) => {
    registerMessage.textContent = text
    registerMessage.className = `form-message ${type}`
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    registerMessage.textContent = ""
    registerMessage.className = "form-message"

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        setRegisterMessage("As senhas não coincidem. Por favor, verifique e tente novamente.", "error");
        return;
    }

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
            window.location.href = "index.html"
        } else {
            setRegisterMessage(data.message, "error")
        }

    } catch (error) {
        console.error(error)
        setRegisterMessage("Não foi possível conectar ao servidor.", "error")
    }
});