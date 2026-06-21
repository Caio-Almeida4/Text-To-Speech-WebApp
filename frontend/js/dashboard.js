const token = localStorage.getItem("jwToken");
let currentUserRole = "user";
let allAudiobooks = [];
let audiobookUsers = [];
let usersCollapsed = false;

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

            await fetchAudiobooks();
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
        allAudiobooks = books;
        const container = document.getElementById("booksContainer");
        container.innerHTML = "";

        books.forEach(book => {
            const li = document.createElement("li");
            li.style.cssText = "background: #fff; padding: 15px; margin-bottom: 10px; border-radius: 8px;";
            
            let html = `
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                    <strong>${book.title}</strong>
                    <span class="badge bg-${book.status}">${book.status}</span>
                </div>
            `;

            if (currentUserRole === "admin" && book.status === "pending") {
                html += `<button onclick="processBook(${book.id})" style="margin-top: 10px; padding: 5px 10px; font-size: 12px; width: auto;">Processar Áudio</button>`;
            }

            if (book.status === "completed" && book.tracks && book.tracks.length > 0) {
                html += `<ul style="margin-top: 10px; font-size: 14px;">`;
                book.tracks.forEach(track => {
                    html += `<li>🎵 ${track.title} - <a href="#" onclick="playTrack('${track.file_path}', '${track.title}')">Ouvir</a></li>`;
                });
                html += `</ul>`;
            }

            li.innerHTML = html;
            container.appendChild(li);
        });

        if (currentUserRole === "admin") {
            populateAudiobookSelect();
        }
    } catch (error) {
        console.error(error);
    }
}

async function fetchAudiobookUsers(audiobookId) {
    try {
        const res = await fetch(`http://localhost:3000/api/audiobooks/${audiobookId}/users`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            throw new Error("Falha ao carregar usuários do audiobook.");
        }

        audiobookUsers = await res.json();
        renderUserCheckboxes();
    } catch (error) {
        console.error(error);
        document.getElementById("permissionMessage").innerText = "Erro ao carregar usuários do audiobook.";
    }
}

function renderUserCheckboxes(filter = "") {
    const usersList = document.getElementById("usersList");
    if (!usersList) return;
    usersList.innerHTML = "";

    const normalizedFilter = filter.trim().toLowerCase();
    const filteredUsers = audiobookUsers.filter(user => {
        const text = `${user.fullName} ${user.email}`.toLowerCase();
        return text.includes(normalizedFilter);
    });

    if (filteredUsers.length === 0) {
        usersList.innerHTML = `<div style="padding: 12px; border: 1px solid #e0e0e0; border-radius: 6px; color: #7f8c8d; background: #fafafa;">Nenhum usuário encontrado.</div>`;
        return;
    }

    filteredUsers.forEach(user => {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.alignItems = "center";
        div.style.padding = "10px";
        div.style.border = "1px solid #e0e0e0";
        div.style.borderRadius = "6px";
        div.style.background = user.hasAccess ? "#f0fff5" : "#fafafa";

        div.innerHTML = `
            <label style="display: flex; align-items: center; gap: 8px; flex: 1;">
                <input type="checkbox" name="permissionUser" value="${user.id}">
                <span>${user.fullName} (${user.email})</span>
            </label>
            <span style="font-size: 12px; color: ${user.hasAccess ? '#2ecc71' : '#7f8c8d'}; white-space: nowrap;">
                ${user.hasAccess ? 'Acesso: Sim' : 'Acesso: Não'}
            </span>
        `;

        usersList.appendChild(div);
    });
}

function populateAudiobookSelect() {
    const select = document.getElementById("audiobookSelect");
    if (!select) return;

    select.innerHTML = "";
    allAudiobooks.forEach(book => {
        const option = document.createElement("option");
        option.value = book.id;
        option.textContent = `${book.title} ${book.status === 'completed' ? '(Pronto)' : ''}`;
        select.appendChild(option);
    });

    if (select.value) {
        fetchAudiobookUsers(Number(select.value));
    }
}

function toggleUsersList() {
    const wrapper = document.getElementById("usersWrapper");
    const toggleBtn = document.getElementById("toggleUsersBtn");
    if (!wrapper || !toggleBtn) return;

    usersCollapsed = !usersCollapsed;
    wrapper.style.display = usersCollapsed ? "none" : "block";
    toggleBtn.textContent = usersCollapsed ? "Mostrar lista" : "Ocultar lista";
}

function applyUserSearch() {
    const searchInput = document.getElementById("userSearch");
    const filter = searchInput ? searchInput.value : "";
    renderUserCheckboxes(filter);
}

function getSelectedUserIds() {
    return Array.from(document.querySelectorAll('input[name="permissionUser"]:checked')).map(input => Number(input.value));
}

async function grantAccess() {
    const select = document.getElementById("audiobookSelect");
    const selected = getSelectedUserIds();

    if (!select || selected.length === 0) {
        alert("Selecione um audiobook e pelo menos um usuário.");
        return;
    }

    const audiobookId = Number(select.value);

    try {
        const res = await fetch(`http://localhost:3000/api/audiobooks/${audiobookId}/grant-access`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userIds: selected })
        });

        const data = await res.json();
        if (res.ok) {
            document.getElementById("permissionMessage").innerText = data.message || "Acesso concedido com sucesso.";
            await fetchAudiobookUsers(audiobookId);
            fetchAudiobooks();
        } else {
            document.getElementById("permissionMessage").innerText = data.message || "Erro ao conceder acesso.";
        }
    } catch (error) {
        console.error(error);
        document.getElementById("permissionMessage").innerText = "Erro ao comunicar com o servidor.";
    }
}

async function revokeAccess() {
    const select = document.getElementById("audiobookSelect");
    const selected = getSelectedUserIds();

    if (!select || selected.length === 0) {
        alert("Selecione um audiobook e pelo menos um usuário.");
        return;
    }

    const audiobookId = Number(select.value);

    try {
        const res = await fetch(`http://localhost:3000/api/audiobooks/${audiobookId}/revoke-access`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userIds: selected })
        });

        const data = await res.json();
        if (res.ok) {
            document.getElementById("permissionMessage").innerText = data.message || "Acesso revogado com sucesso.";
            await fetchAudiobookUsers(audiobookId);
            fetchAudiobooks();
        } else {
            document.getElementById("permissionMessage").innerText = data.message || "Erro ao revogar acesso.";
        }
    } catch (error) {
        console.error(error);
        document.getElementById("permissionMessage").innerText = "Erro ao comunicar com o servidor.";
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

const audiobookSelect = document.getElementById("audiobookSelect");
if (audiobookSelect) {
    audiobookSelect.addEventListener("change", () => {
        fetchAudiobookUsers(Number(audiobookSelect.value));
    });
}

const userSearch = document.getElementById("userSearch");
if (userSearch) {
    userSearch.addEventListener("input", applyUserSearch);
}

const toggleUsersBtn = document.getElementById("toggleUsersBtn");
if (toggleUsersBtn) {
    toggleUsersBtn.addEventListener("click", toggleUsersList);
}

const grantBtn = document.getElementById("grantAccessBtn");
if (grantBtn) {
    grantBtn.addEventListener("click", grantAccess);
}

const revokeBtn = document.getElementById("revokeAccessBtn");
if (revokeBtn) {
    revokeBtn.addEventListener("click", revokeAccess);
}

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