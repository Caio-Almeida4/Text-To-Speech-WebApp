const token = localStorage.getItem("jwToken");
let currentUserRole = "user";

if (!token) {
    alert("Faça login primeiro!");
    window.location.href = "index.html";
} else {
    document.body.style.display = "flex";
    getUserData();
}

async function getUserData() {
    try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();

        if (res.ok) {
            document.getElementById("welcomeMessage").innerText = `Olá, ${data.fullName}`;
            currentUserRole = data.role;
            
            if (currentUserRole === "admin") {
                document.getElementById("adminPanel").style.display = "block";
            }

            fetchAudiobooks();
        } else {
            localStorage.removeItem("jwToken");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error(error);
    }
}

async function fetchAudiobooks() {
    try {
        const res = await fetch("http://localhost:3000/api/audiobooks", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const books = await res.json();
        const container = document.getElementById("booksContainer");
        container.innerHTML = "";

        books.forEach(book => {
            const li = document.createElement("li");
            li.style.cssText = "background: #fff; padding: 15px; margin-bottom: 10px; border-radius: 8px;";
            
            const badgeClass = `bg-${book.status}`;
            let html = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>${book.title}</strong>
                    <span class="badge ${badgeClass}">${book.status.toUpperCase()}</span>
                </div>
            `;

            if (currentUserRole === "admin" && book.status === "pending") {
                html += `<button onclick="processBook(${book.id})" style="margin-top: 10px; padding: 5px 10px; font-size: 12px; width: auto;">Processar Áudio</button>`;
            }

            if (book.status === "completed" && book.tracks.length > 0) {
                html += `<ul style="margin-top: 10px; font-size: 14px;">`;
                book.tracks.forEach(track => {
                    html += `<li>🎵 ${track.title} - <a href="#" onclick="playTrack('${track.file_path}', '${track.title}')">Ouvir</a></li>`;
                });
                html += `</ul>`;
            }

            li.innerHTML = html;
            container.appendChild(li);
        });
    } catch (error) {
        console.error(error);
    }
}

const uploadForm = document.getElementById("uploadForm");
if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const files = document.getElementById("pdfFiles").files;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("pdfs", files[i]);
        }

        const progressBar = document.getElementById("uploadProgress");
        progressBar.style.display = "block";

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/api/audiobooks/upload", true);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                progressBar.value = percentComplete;
            }
        };

        xhr.onload = function() {
            if (xhr.status === 201) {
                alert("Upload concluído!");
                progressBar.style.display = "none";
                progressBar.value = 0;
                fetchAudiobooks(); // Atualiza a lista
            } else {
                alert("Erro no upload: " + JSON.parse(xhr.responseText).message);
            }
        };

        xhr.send(formData);
    });
}

// Aciona US-07 (Processamento)
async function processBook(id) {
    await fetch(`http://localhost:3000/api/audiobooks/${id}/process`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    });
    alert("Processamento iniciado!");
    fetchAudiobooks();
}

function playTrack(filePath, trackTitle) {
    const playerContainer = document.getElementById("audioPlayerContainer");
    const audioEl = document.getElementById("mainAudio");
    const nowPlaying = document.getElementById("nowPlaying");

    playerContainer.style.display = "flex";
    nowPlaying.innerText = trackTitle;
    
    audioEl.src = `http://localhost:3000/${filePath}`;
    audioEl.play();
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("jwToken");
    window.location.href = "index.html";
});