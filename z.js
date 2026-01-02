/* --- EFEITO MATRIX NO FUNDO --- */
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Ajusta o canvas para o tamanho da tela
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
const fontSize = 16;
const columns = canvas.width / fontSize; // Número de colunas

const drops = [];
// Inicializa as gotas
for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function drawMatrix() {
    // Fundo preto translúcido para criar rastro
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0F0"; // Cor do texto (Verde)
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reinicia a gota aleatoriamente
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Roda a animação a cada 33ms
setInterval(drawMatrix, 33);

// Redimensionar canvas se a janela mudar
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


/* --- EFEITO DE TEXTO DECRIPTOGRAFANDO (Hover) --- */
const lettersScramble = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

document.querySelectorAll(".hacker-hover").forEach(element => {
    element.onmouseover = event => {
        let iterations = 0;
        
        const interval = setInterval(() => {
            event.target.innerText = event.target.innerText
                .split("")
                .map((letter, index) => {
                    if(index < iterations) {
                        return event.target.dataset.value[index];
                    }
                    return lettersScramble[Math.floor(Math.random() * 26)]
                })
                .join("");
            
            if(iterations >= event.target.dataset.value.length){ 
                clearInterval(interval);
            }
            
            iterations += 1 / 3;
        }, 30);
    }
});


/* --- LÓGICA DO MODAL --- */
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close-modal');
const buyBtns = document.querySelectorAll('.btn-card');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');

// Abrir modal ao clicar em comprar
buyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.parentElement;
        const title = card.getAttribute('data-title');
        const price = card.getAttribute('data-price');
        
        modalTitle.innerText = title;
        modalPrice.innerText = "R$ " + price;
        
        modal.classList.add('active');
    });
});

// Fechar modal
closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

// Fechar se clicar fora do modal
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// Função para trocar de página sem recarregar
function showSection(sectionId) {
    // Esconde todas as seções
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    // Mostra a seção desejada
    document.getElementById(sectionId).classList.add('active');
    // Rola para o topo
    window.scrollTo(0, 0);
}

// Lógica de Pagamento
function updatePaymentDetails() {
    const method = document.getElementById('paymentMethod').value;
    const text = document.getElementById('paymentText');
    const display = document.getElementById('paymentDisplay');

    if (method === 'pix') {
        text.innerHTML = "QR CODE será gerado após clicar no botão.<br><span class='neon-green'>BÔNUS: Liberação imediata.</span>";
    } else if (method === 'card') {
        text.innerHTML = "FORMULÁRIO DE CARTÃO:<br><input type='text' placeholder='NÚMERO DO CARTÃO' class='hacker-input' style='margin-top:10px'>";
    } else {
        text.innerHTML = "Boleto bancário disponível. Prazo de compensação: 24h a 48h.";
    }
}

// Conectar links do menu para as novas seções
document.querySelector('a[href="#login"]').addEventListener('click', (e) => {
    e.preventDefault();
    showSection('login');
});

document.querySelector('.logo').addEventListener('click', () => {
    showSection('home');
});

// Conectar ROOT
document.querySelector('a[href="#root"]').addEventListener('click', (e) => {
    e.preventDefault();
    showSection('root');
});

// Conectar MODULES
document.querySelector('a[href="#modules"]').addEventListener('click', (e) => {
    e.preventDefault();
    showSection('modules');
});

/* ===============================
   SISTEMA DE LOGIN (FRONT-END)
================================ */

function unlockDashboard(username) {
    // Atualiza nome
    document.getElementById('userNameDisplay').innerText = username.toUpperCase();

    // Atualiza menu
    const nav = document.getElementById('navMenu');
    nav.innerHTML = `
        <li><a href="#dashboard">/DASHBOARD</a></li>
        <li><a href="#root">/ROOT</a></li>
        <li><a href="#" onclick="logout()" class="btn-login">LOGOUT</a></li>
    `;

    // Conecta dashboard
    document.querySelector('a[href="#dashboard"]').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('dashboard');
    });

    // Mostra dashboard
    showSection('dashboard');
}

function logout() {
    localStorage.removeItem('blacknode_user');
    location.reload();
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = 'block';
    } else {
        console.error('Seção não encontrada:', sectionId);
    }
}

/* ===============================
   SISTEMA DE LOGIN – BLACKNODE
   USER: Nero
   PASS: hacking
================================ */

window.addEventListener('load', () => {
    const user = localStorage.getItem('blacknode_user');
    if (user) unlockDashboard(user);
});

function login() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();

    if (user !== "Nero" || pass !== "hacking") {
        alert("ACESSO NEGADO");
        return;
    }

    localStorage.setItem('blacknode_user', user);
    unlockDashboard(user);
}

function unlockDashboard(username) {
    document.getElementById('userNameDisplay').innerText = username;

    const nav = document.getElementById('navMenu');
    nav.innerHTML = `
        <li><a href="#" onclick="showSection('dashboard')">/DASHBOARD</a></li>
        <li><a href="#" onclick="showSection('root')">/ROOT</a></li>
        <li><a href="#" onclick="logout()" class="btn-login">LOGOUT</a></li>
    `;

    showSection('dashboard');
}

function logout() {
    localStorage.removeItem('blacknode_user');
    location.reload();
}
