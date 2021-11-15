let nome = { name: ""}
let mensagem = {from: "",
   to:"",   
	text: "",
	type: "",
   time: ""
}
let ultimaMensagem = document.querySelector('ul').lastChild;

function conectar(){
 const nameInput = document.querySelector(".nome").value;
 const telaDeLogin = document.querySelector(".bonus-login");
 nome = {
    name: nameInput
 };
 telaDeLogin.innerHTML = `<img src="assets/images/logo.png"></img>
 <img src="assets/images/loading.gif"></img>`

 promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants",nome );
 promessa.then(entrouNoChat);
 promessa.catch(tratarErro);
}

function entrouNoChat(){
   const telaDeLogin = document.querySelector(".bonus-login");
   const telaPrincipal = document.querySelector(".layout");
   telaDeLogin.classList.add("hidden");
   telaPrincipal.classList.remove("hidden");
   carregarMensagens();
   buscarParticipantes();
   setInterval(manterConexão, 5000);
   setInterval(carregarMensagens, 3000);
   setInterval(buscarParticipantes, 10000);
}

function carregarMensagens(){
const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
 promessa.then(buscarMensagens);
 promessa.catch(tratarErro);
}


function tratarErro(erro) {
   alert("Nome inválido.")
   window.location.reload();
 }


 function manterConexão(){
   axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nome);
 }

 

 function buscarMensagens(resposta){
    const mensagens = resposta.data
    const ulMensagens = document.querySelector("ul");
      ulMensagens.innerHTML = "";
      for(let i = 0; i<mensagens.length; i++){

         if(mensagens[i].type === "status"){
            const remetente = mensagens[i].from;
            const texto = mensagens[i].text;
            const hora = mensagens[i].time; 
              
            ulMensagens.innerHTML += `<il class = "status" data-identifier="message">
            <p><span class = "time"> (${hora}) </span> <span class = "from"> ${remetente} </span> <span class = "text">${texto}</span></p>
        </il>`
         }
         if(mensagens[i].type === "message"){
            const remetente = mensagens[i].from;
            const texto = mensagens[i].text;
            const hora = mensagens[i].time;
            const destinatario = mensagens[i].to;
         
         ulMensagens.innerHTML += `<il class = "message" data-identifier="message">
           <p><span class = "time"> (${hora}) </span> <span class = "from"> ${remetente} </span> para <span class = "to"> ${destinatario}:</span> <span class = "text">${texto}</span></p>
        </il>`
         }
         if(mensagens[i].type === "private_message"){
            const remetente = mensagens[i].from;
            const texto = mensagens[i].text;
            const hora = mensagens[i].time;
            const destinatario = mensagens[i].to;
            if(nome.name === destinatario || nome.name === remetente){
               ulMensagens.innerHTML += `<il class = "private_message" data-identifier="message">
               <p><span class = "time"> (${hora}) </span> <span class = "from"> ${remetente} </span> reservadamente para <span class = "to"> ${destinatario}:</span> <span class = "text">${texto}</span></p>
               </il>`
            }
        
         }
      }
      const novaUltimaMensagem = document.querySelector('ul').lastChild;
         if(novaUltimaMensagem.innerHTML !== ultimaMensagem.innerHTML){
         ultimaMensagem = document.querySelector('ul').lastChild;
         ultimaMensagem.scrollIntoView();
      }
   } 


function botaoEnviar(){
   const mensagemInput = document.querySelector(".msg-input input");
   mensagem.from = nome.name;
   mensagem.text = mensagemInput.value;
   mensagemInput.value = "";

   if(mensagem.to === ""){
      mensagem.to = "Todos";
   }
   if(mensagem.type === ""){
      mensagem.type = "message";
   }

   const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", mensagem);
   promessa.then(carregarMensagens);
   promessa.catch(tratarErroEnvio);
   }

function sideBar(){
   const telaDeParticipantes = document.querySelector(".bonus-layout");
   telaDeParticipantes.classList.toggle("hidden");
}

function selecionarPessoa(pessoa){
   let info = document.querySelector(".info");
   const verificar = document.querySelector(".person-selected");
   const check = pessoa.querySelector(".checkmark");
   const selecionado = pessoa.querySelector("span").innerHTML;
   if(verificar !== null){
      verificar.classList.remove("person-selected");
   }
   check.classList.add("person-selected");
   mensagem.to = selecionado;
   info.innerHTML = `Enviando para ${mensagem.to} (Público)`;
   if(mensagem.type === "message"){
      info.innerHTML = `Enviando para ${mensagem.to} (Público)`;
   }
   if(mensagem.type === "private_message"){
      info.innerHTML = `Enviando para ${mensagem.to} (Reservadamente)`;
   }
   
}

function selecionarPm(opcao){
   let info = document.querySelector(".info");
   const verificar = document.querySelector(".pm-selected");
   const check = opcao.querySelector(".checkmark");
   const selecionado = opcao.querySelector("span").innerHTML;
   if(verificar !== null){
   verificar.classList.remove("pm-selected");
   }
   check.classList.add("pm-selected"); 
   info.innerHTML = `Enviando para ${mensagem.to} (${selecionado})`;
   if(selecionado === "Público"){
      mensagem.type = "message";
   }
   if(selecionado === "Reservadamente"){
      mensagem.type = "private_message";
   }
   }

   function buscarParticipantes(){
      const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
      promessa.then(atualizarLista)
      promessa.catch(tratarErro);
   }

   function atualizarLista(resposta){
      const participantes = resposta.data;
      const lista = document.querySelector(".contacts")
      lista.innerHTML = `<div onclick="selecionarPessoa(this)" class="person">
      <ion-icon name="people"></ion-icon> <span>Todos</span>
      <ion-icon class = "checkmark" name="checkmark"></ion-icon>` 
      for(let i = 0; i < participantes.length; i++ ){
         lista.innerHTML += `<div onclick="selecionarPessoa(this)" data-identifier="participant"  class="person">
         <ion-icon name="person-circle"></ion-icon> <span>${participantes[i].name}</span>
         <ion-icon class = "checkmark" name="checkmark"></ion-icon>
     </div>`

      }
   }
   
function tratarErroEnvio(){
         alert ("Desconectado do servidor");
         window.location.reload();
      }
  
function enterKey(input){
      const keyEnter = event.keyCode;
   if(input.classList.contains("nome")){
      if (keyEnter === 13) {
      conectar();
         }
      }
      else{
   if (keyEnter === 13) {
      botaoEnviar();
    }
   }
}


