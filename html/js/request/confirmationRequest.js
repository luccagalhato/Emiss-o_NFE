var id;
var prod2 = false;

function headers() {
  var h = new Headers();
  h.set("Token", localStorage.getItem("Token"));
  return h;
}
function getCookie(name) {  
  var dc = document.cookie;  
  var prefix = name +"=";  
  var begin = dc.indexOf("; " + prefix);  
  if (begin == -1) {  
      begin = dc.indexOf(prefix);  
      if (begin != 0)return null;  
  } else {  
      begin += 2;  
  }  
  var end = document.cookie.indexOf(";", begin);  
  if (end == -1) {  
      end = dc.length;  
  }  
  return unescape(dc.substring(begin + prefix.length, end));  
}  

// envio de confirmaçao para emissão NFE
function enviarnfe() {
var name = getCookie("Name")
var prefix = name.split(".")
username = prefix[0].charAt(0).toUpperCase() + prefix[0].slice(1) + " "+ prefix[1].charAt(0).toUpperCase() + prefix[1].slice(1);
let data = criarObjeto();
data.id = id
data.producao = prod2
data.username = username 
  restnfe(data);
}
// Homologacao/Producao
function setProd() {
  var btnProd = getElement("btnProd")
  var btnHomo = getElement("btnHomo")
  var iconProd = getElement("iconProd")
  var iconHomo = getElement("iconHomo")
  prod2 = true;
  btnProd.setAttribute("class" , "btn btn-success btn-icon-split")
  btnHomo.setAttribute("class" , "btn btn-secondary btn-icon-split")
  iconProd.setAttribute("class" , "fas fa-check")
  iconHomo.setAttribute("class" , "fas fa-arrow-right") 
}
function setHomo() {
  var btnProd = getElement("btnProd")
  var btnHomo = getElement("btnHomo")
  var iconHomo = getElement("iconHomo")
  var iconProd = getElement("iconProd")
  prod2 = false
  btnProd.setAttribute("class" , "btn btn-secondary btn-icon-split")
  btnHomo.setAttribute("class" ,"btn btn-success btn-icon-split" )
  iconHomo.setAttribute("class" ,  "fas fa-check")
  iconProd.setAttribute("class" ,"fas fa-arrow-right")
}

// requisição
async function restnfe(body) {
  var card = getElement("buttonconfirmed");
  var load = getElement("loadStatus");
  var nfeSucess = getElement("nfeSucess");
  var bttXml = getElement("toastbtn");
  var bttExcel = getElement("buttonExcel");
  var newPedido = getElement("newPedido");

  load.setAttribute("class", "text-center");
  card.setAttribute("class", "container my-auto d-none");
  bttXml.setAttribute("class", "btn btn-primary d-none");
  bttExcel.setAttribute("class", "btn btn-success d-none");

  var myInit = criarInit(JSON.stringify(body),'POST')
  const response = await fetch(
    `${window.location.protocol}//${window.location.host}/addSaidas`,
    myInit
  );

  load.setAttribute("class", "text-center d-none");

  if (response.status == "200") {
    nfeSucess.setAttribute("class", "alert alert-success");

    const data = await (await response.blob()).text();
    //console.log(data)
    const trhead2 = getElement("theadNFE");
    var cabecalho = ["#", "ID", "DOWLOADING...."];
    cabecalho.forEach((col) => {
      var th = document.createElement("th");
      th.setAttribute("scope", "col");
      th.style.fontColor = "black";
      th.innerHTML = col;
      trhead2.appendChild(th);
    });
    const trbody = getElement("tbodyNFE");
    var i = 1;
    for (var id in data.data) {
      ["xml", "pdf"].forEach((type) => {
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.innerHTML = i;
        i++;
        var td1 = document.createElement("td");
        td1.innerHTML = id + " ("+ type+ ")";

        var td2 = document.createElement("td");
        td2.setAttribute("id", id + type);
        if (data.data[id].status == "Autorizada") {
          var spin = document.createElement("div");
          spin.setAttribute("role", "status");
          spin.setAttribute("class", "spinner-border text-primary");
          spin.setAttribute("style", "width: 1rem; height: 1rem;");
          var span = document.createElement("span");
          span.setAttribute("class", "sr-only");
          spin.appendChild(span);
          td2.appendChild(spin);
        } else {
          var a = document.createElement("a");
          a.setAttribute("class", "badge badge-danger");
          a.innerHTML = "Negado";
          td2.appendChild(a);
        }

        [th, td1, td2].forEach((item) => {
          tr.appendChild(item);
        });
        trbody.appendChild(tr);
      })
    }
    for (const i in data.data) {
      console.log(data.data[i]);
      if (data.data[i].status == "Autorizada") {
        await downloadFile(i, data.data[i]);
        // var btntrue = document.getElementById("btnsucess");
        // btntrue.setAttribute("class", "");
      }
    }
    newPedido.setAttribute("class", "text-center");
  } else {
    var cardError = document.getElementById("cardError");
    cardError.setAttribute("class", "");
    //mensagem de erro
    // if data.error printar error
  }
}
