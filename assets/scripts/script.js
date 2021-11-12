let nome = { name: ""}

function conectar(){
 const nameInput = document.querySelector(".nome").value;
 console.log(nameInput);
 nome = {
    name: nameInput
 };
promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants",nome );
 
 promessa.then(entrouNoChat);
 promessa.catch(tratarErro);
}

function entrouNoChat(resposta){
   const telaDeLogin = document.querySelector(".bonus-login");
   const telaPrincipal = document.querySelector(".layout");
   telaDeLogin.classList.add("hidden");
   telaPrincipal.classList.remove("hidden");
   setInterval(manterConexão, 5000);
   setInterval(carregarMensagens, 3000);
}

//function carregarMensagens(){
const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
 promessa.then(buscarMensagens);
//}


function tratarErro(erro) {
   console.log(erro.response);
 }


 function manterConexão(){
   axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nome);
   
 }

 

 function buscarMensagens(resposta){
    const mensagens = resposta.data
    const ulMensagens = document.querySelector("ul");
      for(let i = 0; i<mensagens.length; i++){
         if(mensagens[i].type === "status"){
            const remetente = mensagens[i].from;
            const texto = mensagens[i].text;
            const hora = mensagens[i].time; 
              
            ulMensagens.innerHTML += `<il class = "status">
            <p class = "time"> (${hora}) </p> <p class = "from"> ${remetente} </p> <p class "text">${texto}</p>
        </il>`
         }
         if(mensagens[i].type === "message"){
            const remetente = mensagens[i].from;
            const texto = mensagens[i].text;
            const hora = mensagens[i].time;
            const destinatario = mensagens[i].to;
         
         ulMensagens.innerHTML += `<il class = "message">
            <p class = "time"> (${hora}) </p> <p class = "from"> ${remetente} </p> para <p class = "to"> ${destinatario}</p> <p class "text">${texto}</p>
        </il>`
         }
         if(mensagens[i].type === "private_message"){
            const remetente = mensagens[i].from;
            const texto = mensagens[i].text;
            const hora = mensagens[i].time;
            const destinatario = mensagens[i].to;
            if(nome.name === destinatario || nome.name === remetente){
               ulMensagens.innerHTML += `<il class = "private_message">
               <p class = "time"> (${hora}) </p> <p class = "from"> ${remetente} </p> reservadamente para <p class = "to"> ${destinatario}</p> <p class "text">${texto}</p>
               </il>`
            }   
        
         }
      }
   } 

   
