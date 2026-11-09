
 // ELEMENTOS DO JOGO
const elementos = [
    "🔥",
    "💧",
    "🌱",
    "🌪️",
    "⚡",
    "🍃"
];

// ELEMENTOS HTML
const tabuleiro = document.getElementById("tabuleiro");

const contadorJogadas = document.getElementById("jogadas");

const contadorPares = document.getElementById("pares");

const contadorTempo = document.getElementById("tempo");

const mensagem = document.getElementById("mensagem");

// VARIÁVEIS
let primeiraCarta = null;
let segundaCarta = null;

let bloqueio = false;

let jogadas = 0;
let paresEncontrados = 0;

let tempo = 0;

let intervalo = null;

let jogoIniciado = false;
let jogoFinalizado = false;

// EMBARALHAR CARTAS
function embaralhar(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

// CRIAR TABULEIRO
function criarTabuleiro() {

    tabuleiro.innerHTML = "";

    const cartas = embaralhar([...elementos, ...elementos]);

    cartas.forEach((elemento, index) => {

        const carta = document.createElement("button");

        carta.classList.add("carta");

        carta.setAttribute("aria-label", "Carta virada para baixo");

        carta.dataset.elemento = elemento;

        carta.dataset.index = index;

        carta.innerHTML = `
            <div class="carta-inner">

                <div class="carta-front"></div>

                <div class="carta-back">
                    ${elemento}
                </div>

            </div>
        `;

        carta.addEventListener("click", function() {
            virarCarta(carta);
        });

        tabuleiro.appendChild(carta);
    });
}

// INICIAR CRONÔMETRO
function iniciarCronometro() {

    if (jogoIniciado) {
        return;
    }

    jogoIniciado = true;

    intervalo = setInterval(function() {

        tempo++;

        atualizarTempo();

    }, 1000);
}

// ATUALIZAR TEMPO
function atualizarTempo() {

    const minutos = Math.floor(tempo / 60);

    const segundos = tempo % 60;

    const formatoMinutos = String(minutos).padStart(2, "0");

    const formatoSegundos = String(segundos).padStart(2, "0");

    contadorTempo.textContent =
        `${formatoMinutos}:${formatoSegundos}`;
}

// VIRAR CARTA
function virarCarta(carta) {

    if (
        bloqueio ||
        jogoFinalizado ||
        carta.classList.contains("virada") ||
        carta.classList.contains("encontrada")
    ) {
        return;
    }

    // INICIA O CRONÔMETRO NO PRIMEIRO CLIQUE
    iniciarCronometro();

    carta.classList.add("virada");

    carta.setAttribute("aria-label", "Carta revelada");

    // PRIMEIRA CARTA
    if (primeiraCarta === null) {

        primeiraCarta = carta;

        return;
    }

    // SEGUNDA CARTA
    segundaCarta = carta;

    // CONTAR JOGADA
    jogadas++;

    contadorJogadas.textContent = jogadas;

    verificarPar();
}

// VERIFICAR PAR
function verificarPar() {

    const elemento1 = primeiraCarta.dataset.elemento;

    const elemento2 = segundaCarta.dataset.elemento;

    // SE FOREM IGUAIS
    if (elemento1 === elemento2) {

        primeiraCarta.classList.add("encontrada");

        segundaCarta.classList.add("encontrada");

        primeiraCarta.setAttribute("aria-label", "Par encontrado");

        segundaCarta.setAttribute("aria-label", "Par encontrado");

        paresEncontrados++;

        contadorPares.textContent = `${paresEncontrados}/6`;

        primeiraCarta = null;

        segundaCarta = null;

        // VERIFICAR VITÓRIA
        if (paresEncontrados === 6) {

            finalizarJogo();
        }

    } else {

        // SE FOREM DIFERENTES
        bloqueio = true;

        setTimeout(function() {

            primeiraCarta.classList.remove("virada");

            segundaCarta.classList.remove("virada");

            primeiraCarta.setAttribute(
                "aria-label",
                "Carta virada para baixo"
            );

            segundaCarta.setAttribute(
                "aria-label",
                "Carta virada para baixo"
            );

            primeiraCarta = null;

            segundaCarta = null;

            bloqueio = false;

        }, 800);
    }
}

// FINALIZAR JOGO
function finalizarJogo() {

    jogoFinalizado = true;

    clearInterval(intervalo);

    mensagem.style.display = "block";

    document.getElementById("resultadoTempo").textContent =
        `⏱️ Tempo total: ${contadorTempo.textContent}`;

    document.getElementById("resultadoJogadas").textContent =
        `🎯 Total de jogadas: ${jogadas}`;
}

// REINICIAR JOGO
function reiniciarJogo() {

    clearInterval(intervalo);

    primeiraCarta = null;

    segundaCarta = null;

    bloqueio = false;

    jogadas = 0;

    paresEncontrados = 0;

    tempo = 0;

    jogoIniciado = false;

    jogoFinalizado = false;

    contadorJogadas.textContent = "0";

    contadorPares.textContent = "0/6";

    contadorTempo.textContent = "00:00";

    mensagem.style.display = "none";

    criarTabuleiro();
}

// INICIAR
criarTabuleiro();
