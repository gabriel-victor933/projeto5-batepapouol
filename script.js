let url_entrar = "https://mock-api.driven.com.br/api/v6/uol/participants";
let url_status = "https://mock-api.driven.com.br/api/v6/uol/status";
let url_mensagens = "https://mock-api.driven.com.br/api/v6/uol/messages";
let url_enviar = "https://mock-api.driven.com.br/api/v6/uol/messages";
let url_part = "https://mock-api.driven.com.br/api/v6/uol/participants";

let usuario = { name: "" };
let mensagem_enviada = {
    from: "nome do usuário",
    to: "",
    text: "",
    type: "message"
}
let usuarioValido = false;

let main = document.querySelector("main");
let text = document.querySelector("input");
let button = document.getElementsByName("paper-plane-outline");
let aside = document.querySelector("header button");
let paginaPart = document.querySelector("aside");
let part = document.getElementById("participantes");
let inicial = document.querySelectorAll(".inicial");
let dest = document.querySelector(".dest");
let visibilidade = document.querySelector(".visibilidade");


button[0].addEventListener("click", enviar);
aside.addEventListener("click", abrirParticipantes);
document.addEventListener("keypress", (tecla) => {
    if (tecla.key == "Enter") enviar();
})



setInterval(manterConexao, 5000);
setInterval(buscarMensagens, 3000);
setInterval(participantes, 10000);


function perguntaNome() {

    usuario.name = inicial[0].querySelector("input").value
    entrar();
}

function entrar() {
    let promessa = axios.post(url_entrar, usuario);

    inicial.forEach(alterarTelaInicial)

    promessa.then(trocarTela);
    promessa.catch(erroEntrar);
}

function erroEntrar() {
    alert("Erro!! insira outro nome!");
    inicial.forEach(alterarTelaInicial);
    inicial[0].querySelector("input").value = "";
}

function alterarTelaInicial(tela) {
    tela.classList.toggle("hide");
}

function trocarTela() {
    usuarioValido = true;
    alterarTelaInicial(inicial[1]);
    buscarMensagens();
    participantes();
}


function buscarMensagens() {
    if (!usuarioValido) return;
    let promessa = axios.get(url_mensagens);
    promessa.then(carregarMensagens)
}

function manterConexao() {
    if (!usuarioValido) return;
    axios.post(url_status, usuario);
}

function carregarMensagens(resposta) {



    main.innerHTML = ""

    for (let i = 0; i < resposta.data.length; i++) {
        // let tipo = resposta.data[i].type;

        switch (resposta.data[i].type) {
            case "status": tipoStatus(resposta.data[i]); break;
            case "message": tipoMens(resposta.data[i]); break;
            case "private_message": tipoPrivado(resposta.data[i]); break;
        }
    }

    let divss = document.querySelectorAll("main div");
    divss[divss.length - 1].scrollIntoView();





}

function tipoStatus(mensagem) {

    main.innerHTML = `${main.innerHTML}            
    <div class="status" data-test="message">
        <p>
            <span class="hora">(${mensagem.time})</span>
            <span class="usuario"><strong>${mensagem.from}</strong> </span>
            <span class="mensagem">${mensagem.text}</span>

        </p>
    </div>`


}

function tipoMens(mensagem) {

    main.innerHTML = `${main.innerHTML}            
    <div class="normais" data-test="message">
        <p>
            <span class="hora">(${mensagem.time})</span>
            <span class="usuario"><strong> ${mensagem.from}</strong>
                        para <strong>${mensagem.to}</strong>:</span>
            <span class="mensagem">${mensagem.text}</span>

        </p>
    </div>`
}

function tipoPrivado(mensagem) {

    if (mensagem.to != usuario.name && mensagem.from != usuario.name) return;

    main.innerHTML = `${main.innerHTML}            
    <div class="reservadas" data-test="message">
    <p>
        <span class="hora">(${mensagem.time})</span>
        <span class="usuario"><strong>${mensagem.from}</strong> reservadamente
            para <strong>${mensagem.to}</strong>:</span>
        <span class="mensagem">${mensagem.text}</span>

    </p>
</div>`
}

function enviar() {

    if (!text.value) return;

    mensagem_enviada.from = usuario.name;
    mensagem_enviada.to = dest.innerHTML;
    mensagem_enviada.text = text.value;
    mensagem_enviada.type = visibilidade.innerHTML === "Reservadamente" ? "private_message" : "message";

    text.value = "";



    let promessa = axios.post(url_enviar, mensagem_enviada);
    promessa.then(buscarMensagens);
    promessa.catch(menNaoEnviada);




}

function menNaoEnviada() {
    window.location.reload()
}

function abrirParticipantes() {

    if (paginaPart.style.display == "none") {
        document.querySelector("aside").style.display = "flex";
    } else {
        document.querySelector("aside").style.display = "none";
    }


}

function participantes() {
    if (!usuarioValido) return;
    let promessa = axios.get(url_part);
    promessa.then(mostrarPart);
}

function mostrarPart(resposta) {

    part.innerHTML = "";
    for (let i = 0; i < resposta.data.length; i++) {


        if (resposta.data[i].name == dest.innerHTML) {
            part.innerHTML += `<div data-test="participant" onclick="selecionarPart(this)" class="selecionadoPart">
        <ion-icon name="person-circle"></ion-icon>
        <p>${resposta.data[i].name}</p>
        <ion-icon name="checkmark-sharp" data-test="check"></ion-icon>
    </div>`
        } else {
            part.innerHTML += `<div data-test="participant" onclick="selecionarPart(this)">
        <ion-icon name="person-circle"></ion-icon>
        <p>${resposta.data[i].name}</p>
        <ion-icon name="checkmark-sharp" data-test="check"></ion-icon>
    </div>`
        }
    }
}


function selecionarPart(selecionado) {

    if (document.querySelector(".selecionadoPart")) {
        document.querySelector(".selecionadoPart").classList.remove("selecionadoPart");

    }

    selecionado.classList.toggle("selecionadoPart");
    dest.innerHTML = selecionado.querySelector("p").innerHTML;


}


function selecionarVisib(selecionado) {

    if (document.querySelector(".selecionadoVisib")) {
        document.querySelector(".selecionadoVisib").classList.remove("selecionadoVisib");

    }
    selecionado.classList.toggle("selecionadoVisib");

    visibilidade.innerHTML = selecionado.querySelector("p").innerHTML;

}







