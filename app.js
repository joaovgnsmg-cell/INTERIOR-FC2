const jogadores = [
  {
    nome: "Ulisses",
    foto: "imagens/uli.png.jpg",
    gols: 0,
    assistencias: 0
  },
  {
    nome: "Pedrox",
    foto: "imagens/pedrox.png.jpg",
    gols: 0,
    assistencias: 0
  },
  {
    nome: "Tubão",
    foto: "imagens/pretox.png.jpg",
    gols: 0,
    assistencias: 0
  },
  {
    nome: "Asafe",
    foto: "imagens/asafe.png.jpg",
    gols: 0,
    assistencias: 0
  },
  {
    nome: "Alfredo",
    foto: "imagens/af.jpg",
    gols: 0,
    assistencias: 0
  },
  {
    nome: "Neto",
    foto: "https://i.pravatar.cc/100?img=16",
    gols: 0,
    assistencias: 0
  },
  {
    nome: "O GOMEX",
    foto: "imagens/gomex.png.jpg",
    gols: 1,
    assistencias: 0
  },
  {
    nome: "Josué",
    foto: "https://i.pravatar.cc/100?img=18",
    gols: 0,
    assistencias: 0
  },
  {
    nome: "Davi",
    foto: "https://i.pravatar.cc/100?img=19",
    gols: 0,
    assistencias: 0
  },
  {
    nome: "Ronny",
    foto: "https://i.pravatar.cc/100?img=20",
    gols: 0,
    assistencias: 0
  },
  {
    nome: "Jocyel",
    foto: "https://i.pravatar.cc/100?img=21",
    gols: 0,
    assistencias: 0
  },
  {
    nome: "Doryedson",
    foto: "https://i.pravatar.cc/100?img=22",
    gols: 0,
    assistencias: 0
  }
];

function renderizarTabela() {

  // Calcula os pontos
  jogadores.forEach(j => {
    j.pontos = j.gols + j.assistencias;
  });

  // Ordena pelo ranking
  jogadores.sort((a, b) =>
    b.pontos - a.pontos ||
    b.gols - a.gols ||
    b.assistencias - a.assistencias
  );

  const tabela = document.getElementById("ranking");
  tabela.innerHTML = "";

  jogadores.forEach((j, index) => {

    const tr = document.createElement("tr");

    // Destaques do pódio
    if (index === 0) tr.classList.add("primeiro");
    if (index === 1) tr.classList.add("segundo");
    if (index === 2) tr.classList.add("terceiro");

    tr.innerHTML = `
      <td class="posicao">${index + 1}</td>

      <td>
        <div class="jogador">
          <img src="${j.foto}" alt="${j.nome}">
          <span>${j.nome}</span>
        </div>
      </td>

      <td>${j.gols}</td>
      <td>${j.assistencias}</td>
      <td class="pontos">${j.pontos}</td>
    `;

    tabela.appendChild(tr);
  });
}

renderizarTabela();

const SENHA_ADMIN = "7777";

const adminBtn = document.getElementById("adminBtn");
const adminPanel = document.getElementById("adminPanel");
const listaAdmin = document.getElementById("listaAdmin");


adminBtn.addEventListener("click", () => {
  const senha = prompt("Digite a senha de administrador:");

  if (senha === SENHA_ADMIN) {
    adminPanel.classList.toggle("hidden");
    renderizarPainelAdmin();
  } else {
    alert("Senha incorreta!");
  }
});

// Renderiza os controles do painel
function renderizarPainelAdmin() {
  listaAdmin.innerHTML = "";

  jogadores.forEach((jogador, index) => {
    const div = document.createElement("div");
    div.className = "admin-player";

    div.innerHTML = `
      <span>${jogador.nome}</span>

      <div class="controles">
        <button onclick="alterar(${index}, 'gols', -1)">-⚽</button>
        <button onclick="alterar(${index}, 'gols', 1)">+⚽</button>

        <button onclick="alterar(${index}, 'assistencias', -1)">-🎯</button>
        <button onclick="alterar(${index}, 'assistencias', 1)">+🎯</button>
      </div>
    `;

    listaAdmin.appendChild(div);
  });
}

// Alterar estatísticas
function alterar(index, tipo, valor) {
  jogadores[index][tipo] += valor;

  if (jogadores[index][tipo] < 0) {
    jogadores[index][tipo] = 0;
  }
  salvarDados();
  renderizarTabela();
  renderizarPainelAdmin();
}
// ===== SALVAR DADOS =====

function salvarDados() {
  localStorage.setItem("jogadores", JSON.stringify(jogadores));
}

// ===== CARREGAR DADOS =====

function carregarDados() {
  const dados = localStorage.getItem("jogadores");

  if (dados) {
    const salvos = JSON.parse(dados);

    jogadores.forEach((j, i) => {
      j.gols = salvos[i].gols;
      j.assistencias = salvos[i].assistencias;
    });
  }
}

// Carrega ao abrir o site
carregarDados();
renderizarTabela();