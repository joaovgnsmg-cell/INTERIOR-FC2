
/* =====================================
   INTERIOR FC - SISTEMA PRINCIPAL
===================================== */

// 1. CONFIGURAÇÃO SUPABASE

const SUPABASE_URL = "https://mfjihluzwanyigtchjwc.supabase.co";
const SUPABASE_KEY = "sb_publishable_P5yv5OoNlf05_ra7EjS9mA_LLaTodQo";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// 2. ELEMENTOS HTML

const tabelaRanking = document.querySelector("#ranking");
const adminBtn = document.querySelector("#adminBtn");
const adminPanel = document.querySelector("#adminPanel");
const listaAdmin = document.querySelector("#listaAdmin");
const salvarBtn = document.querySelector("#salvarBtn");

// 3. VARIÁVEIS

let jogadores = [];
let alteracoesPendentes = {};
let salvando = false;

// 4. CALCULAR PONTOS

function calcularPontos(jogador) {
    const gols = Number(jogador.gols) || 0;
    const assistencias = Number(jogador.assistencias) || 0;

    return gols + (assistencias * 0.5);
}

// 5. FORMATAÇÃO DOS PONTOS

function formatarPontos(pontos) {
    return pontos.toLocaleString("pt-BR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
    });
}

// ===== ATUALIZAR ESTATÍSTICAS GERAIS =====

function atualizarEstatisticas() {

    let totalGols = 0;
    let totalAssistencias = 0;
    let totalPontos = 0;

    jogadores.forEach(jogador => {

        const pendente = alteracoesPendentes[jogador.id] || {};

        const gols = pendente.gols !== undefined
            ? Number(pendente.gols)
            : Number(jogador.gols) || 0;

        const assistencias = pendente.assistencias !== undefined
            ? Number(pendente.assistencias)
            : Number(jogador.assistencias) || 0;

        totalGols += gols;
        totalAssistencias += assistencias;

        totalPontos += gols + (assistencias * 0.5);
    });

    document.querySelector("#totalGols").textContent = totalGols;

    document.querySelector("#totalAssistencias").textContent =
        totalAssistencias;

    document.querySelector("#totalJogadores").textContent =
        jogadores.length;

    document.querySelector("#totalPontos").textContent =
        formatarPontos(totalPontos);
}


// 6. PROTEGER TEXTOS

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}

// 7. ORGANIZAR RANKING

function organizarRanking() {
    return [...jogadores].sort((a, b) => {

        const diferenca =
            calcularPontos(b) - calcularPontos(a);

        if (diferenca !== 0) return diferenca;

        const diferencaGols =
            Number(b.gols) - Number(a.gols);

        if (diferencaGols !== 0) return diferencaGols;

        return a.nome.localeCompare(b.nome);
    });
}


// ===== ATUALIZAR DESTAQUES DA TEMPORADA =====

function atualizarDestaques() {

    if (jogadores.length === 0) return;

    // Considerar também alterações ainda não salvas
    const jogadoresAtualizados = jogadores.map(jogador => {

        const pendente = alteracoesPendentes[jogador.id] || {};

        return {
            ...jogador,
            gols: pendente.gols !== undefined
                ? Number(pendente.gols)
                : Number(jogador.gols) || 0,

            assistencias: pendente.assistencias !== undefined
                ? Number(pendente.assistencias)
                : Number(jogador.assistencias) || 0
        };
    });

    const artilheiro = [...jogadoresAtualizados].sort(
        (a, b) => b.gols - a.gols
    )[0];

    const garcom = [...jogadoresAtualizados].sort(
        (a, b) => b.assistencias - a.assistencias
    )[0];

    const lider = [...jogadoresAtualizados].sort(
        (a, b) => calcularPontos(b) - calcularPontos(a)
    )[0];

    // Artilheiro
    document.querySelector("#fotoArtilheiro").src = artilheiro.foto || "";
    document.querySelector("#nomeArtilheiro").textContent = artilheiro.nome;
    document.querySelector("#golsArtilheiro").textContent =
        `${artilheiro.gols} gols`;

    // Maior assistente
    document.querySelector("#fotoGarcom").src = garcom.foto || "";
    document.querySelector("#nomeGarcom").textContent = garcom.nome;
    document.querySelector("#assistenciasGarcom").textContent =
        `${garcom.assistencias} assistências`;

    // Líder
    document.querySelector("#fotoLider").src = lider.foto || "";
    document.querySelector("#nomeLider").textContent = lider.nome;
    document.querySelector("#pontosLider").textContent =
        `${formatarPontos(calcularPontos(lider))} pontos`;
}



// 8. EXIBIR RANKING

function atualizarRanking() {

    if (!tabelaRanking) return;

    const ranking = organizarRanking();

    tabelaRanking.innerHTML = "";

    ranking.forEach((jogador, indice) => {

        const linha = document.createElement("tr");

        if (indice === 0) linha.classList.add("primeiro");
        if (indice === 1) linha.classList.add("segundo");
        if (indice === 2) linha.classList.add("terceiro");

        linha.innerHTML = `
            <td class="posicao">${indice + 1}º</td>

            <td>
                <div class="jogador">
                    <img
                        src="${escaparHTML(jogador.foto || '')}"
                        alt="${escaparHTML(jogador.nome)}"
                    >
                    <span>${escaparHTML(jogador.nome)}</span>
                </div>
            </td>

            <td>${Number(jogador.gols) || 0}</td>

            <td>${Number(jogador.assistencias) || 0}</td>

            <td class="pontos">
                ${formatarPontos(calcularPontos(jogador))}
            </td>
        `;

        tabelaRanking.appendChild(linha);
    });
    atualizarEstatisticas();
    atualizarDestaques();
}


// 9. ABRIR E FECHAR PAINEL ADMIN

// 9. ACESSO AO PAINEL ADMIN

const SENHA_ADMIN = "7070";

adminBtn.addEventListener("click", () => {

    if (adminPanel.classList.contains("hidden")) {

        const senha = prompt("Digite a senha de administrador:");

        if (senha !== SENHA_ADMIN) {
            alert("Senha incorreta!");
            return;
        }

        adminPanel.classList.remove("hidden");

        adminBtn.textContent = "🔓 Fechar Painel Admin";

    } else {

        adminPanel.classList.add("hidden");

        adminBtn.textContent = "🔒 Painel Admin";
    }
});

// 10. EXIBIR JOGADORES NO ADMIN

function atualizarPainelAdmin() {

    listaAdmin.innerHTML = "";

    jogadores.forEach(jogador => {

        const pendente = alteracoesPendentes[jogador.id] || {};

        const gols = pendente.gols !== undefined
            ? pendente.gols
            : Number(jogador.gols) || 0;

        const assistencias = pendente.assistencias !== undefined
            ? pendente.assistencias
            : Number(jogador.assistencias) || 0;

        const elemento = document.createElement("div");

        elemento.classList.add("admin-player");

        elemento.innerHTML = `
            <h3>${escaparHTML(jogador.nome)}</h3>

            <p>Gols: ${gols}</p>
            <button data-id="${jogador.id}"
                    data-campo="gols"
                    data-valor="1">+ Gol</button>

            <button data-id="${jogador.id}"
                    data-campo="gols"
                    data-valor="-1">- Gol</button>

            <p>Assistências: ${assistencias}</p>
            <button data-id="${jogador.id}"
                    data-campo="assistencias"
                    data-valor="1">+ Assistência</button>

            <button data-id="${jogador.id}"
                    data-campo="assistencias"
                    data-valor="-1">- Assistência</button>
        `;

        listaAdmin.appendChild(elemento);
    });
}

// 11. ALTERAR ESTATÍSTICAS TEMPORARIAMENTE

listaAdmin.addEventListener("click", event => {

    const botao = event.target.closest("button");

    if (!botao || salvando) return;

    const id = botao.dataset.id;
    const campo = botao.dataset.campo;
    const valor = Number(botao.dataset.valor);

    if (!["gols", "assistencias"].includes(campo)) return;

    const jogador = jogadores.find(
        item => String(item.id) === String(id)
    );

    if (!jogador) return;

    if (!alteracoesPendentes[id]) {
        alteracoesPendentes[id] = {};
    }

    const atual = alteracoesPendentes[id][campo] !== undefined
        ? alteracoesPendentes[id][campo]
        : Number(jogador[campo]) || 0;

    const novoValor = atual + valor;

    if (novoValor < 0) {
        alert("A estatística não pode ser negativa!");
        return;
    }

    alteracoesPendentes[id][campo] = novoValor;

    atualizarPainelAdmin();
    atualizarRanking();
});

// 12. SALVAR ALTERAÇÕES NO SUPABASE

salvarBtn.addEventListener("click", async () => {

    if (salvando) return;

    if (Object.keys(alteracoesPendentes).length === 0) {
        alert("Não existem alterações para salvar.");
        return;
    }

    salvando = true;
    salvarBtn.disabled = true;

    try {

        const pendentes = Object.entries(alteracoesPendentes);

        for (const [id, dados] of pendentes) {

            const { data, error } = await supabaseClient
                .from("jogadores")
                .update(dados)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;

            jogadores = jogadores.map(jogador =>
                String(jogador.id) === String(data.id)
                    ? data
                    : jogador
            );

            delete alteracoesPendentes[id];
        }

        atualizarRanking();
        atualizarPainelAdmin();

        alert("Alterações salvas com sucesso!");

    } catch (error) {

        console.error("Erro ao salvar:", error);

        alert(
            "Erro ao salvar as alterações. Confira o Supabase e tente novamente."
        );

        // Atualizar a tela com os dados confirmados
        atualizarRanking();
        atualizarPainelAdmin();

    } finally {

        salvando = false;
        salvarBtn.disabled = false;

    }
});

// 13. CARREGAR JOGADORES

async function carregarJogadores() {

    const { data, error } = await supabaseClient
        .from("jogadores")
        .select("*");

    if (error) {
        console.error("Erro ao carregar jogadores:", error);
        alert("Não foi possível carregar o ranking.");
        return;
    }

    jogadores = data || [];

    atualizarRanking();
    atualizarPainelAdmin();
}

// 14. ATUALIZAÇÃO EM TEMPO REAL

supabaseClient
    .channel("interior-fc-ranking")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "jogadores"
        },
        async () => {

            // Preservar alterações locais ainda não salvas
            const { data, error } = await supabaseClient
                .from("jogadores")
                .select("*");

            if (error) {
                console.error("Erro no realtime:", error);
                return;
            }

            jogadores = data || [];

            atualizarRanking();
            atualizarPainelAdmin();
        }
    )
    .subscribe();

// 15. INICIAR SISTEMA

carregarJogadores();
// ===== AMPLIAR FOTO DOS JOGADORES =====

const modalFoto = document.createElement("div");

modalFoto.className = "foto-modal";

modalFoto.innerHTML = `
    <button class="fechar-foto">&times;</button>
    <img src="" alt="Foto ampliada do jogador">
`;

document.body.appendChild(modalFoto);

const imagemAmpliada = modalFoto.querySelector("img");
const fecharFoto = modalFoto.querySelector(".fechar-foto");

// Abrir foto ao clicar
document.addEventListener("click", function(event) {

    const foto = event.target.closest(".jogador img");

    if (foto) {
      if (foto.closest(".jogador")) return;
        imagemAmpliada.src = foto.src;
        imagemAmpliada.alt = foto.alt || "Foto do jogador";

        modalFoto.classList.add("ativo");
        document.body.style.overflow = "hidden";
    }

});

// Fechar clicando fora da imagem
modalFoto.addEventListener("click", function(event) {

    if (
        event.target === modalFoto ||
        event.target === fecharFoto
    ) {
        modalFoto.classList.remove("ativo");
        document.body.style.overflow = "";
    }

});

// Fechar com ESC
document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        modalFoto.classList.remove("ativo");
        document.body.style.overflow = "";
    }

});

// ===== PERFIL INDIVIDUAL DOS JOGADORES =====

const perfilModal = document.querySelector("#perfilModal");
const fecharPerfil = document.querySelector("#fecharPerfil");

document.addEventListener("click", function(event) {

    const jogadorClicado = event.target.closest(".jogador");

    if (!jogadorClicado) return;

    const nome = jogadorClicado.querySelector("span")?.textContent;

    const ranking = organizarRanking();

    const indice = ranking.findIndex(
        jogador => jogador.nome === nome
    );

    if (indice === -1) return;

    const jogador = ranking[indice];

    document.querySelector("#perfilFoto").src = jogador.foto || "";
    document.querySelector("#perfilNome").textContent = jogador.nome;
    document.querySelector("#perfilPosicao").textContent =
        `${indice + 1}º lugar no ranking`;

    document.querySelector("#perfilGols").textContent =
        Number(jogador.gols) || 0;

    document.querySelector("#perfilAssistencias").textContent =
        Number(jogador.assistencias) || 0;

    document.querySelector("#perfilPontos").textContent =
        formatarPontos(calcularPontos(jogador));

    perfilModal.classList.add("ativo");
});

function fecharJanelaPerfil() {
    perfilModal.classList.remove("ativo");
}

fecharPerfil.addEventListener("click", fecharJanelaPerfil);

perfilModal.addEventListener("click", function(event) {
    if (event.target === perfilModal) {
        fecharJanelaPerfil();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        fecharJanelaPerfil();
    }
});
