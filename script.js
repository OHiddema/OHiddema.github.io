var steen = []; // images van de getoonde stenen
var waarde = []; // aantal ogen op de getoonde stenen
var beurten = 3; // aantal beurten binnen een ronde loopt af van 3 naar 1
var rondes = 1; // aantal rondes loopt op van 1 naar 13
var ChooseScore = false;  // geeft aan of speler een score mag kiezen in de tabel
var i; //loop counter

const clrGreen500 = "#4CAF50";

// zet DOM-elementen in variabelen
var id_btnDobbel = document.getElementById("btnDobbel");
var id_Var = document.getElementById("variabel");
var id_Vast = document.getElementById("vast");
var cl_TdClick = document.getElementsByClassName("td_clickable");
var cl_TdClick_after = document.getElementsByClassName("td_clickable_after");

var id_worp1 = document.getElementById("worp1");
var id_worp2 = document.getElementById("worp2");
var id_worp3 = document.getElementById("worp3");

var id_audioDice = document.getElementById("audioDice");
var id_volumeMin = document.getElementById("volumeMin");
var id_volumeMax = document.getElementById("volumeMax");
var id_refresh = document.getElementById("refresh");

id_volumeMin.onclick = function () {
  id_audioDice.volume = 1;
  this.style.display = "none";
  id_volumeMax.style.display = "inline";
};

id_volumeMax.onclick = function () {
  id_audioDice.volume = 0;
  this.style.display = "none";
  id_volumeMin.style.display = "inline";
};

for (i = 0; i < 5; i++) {
  steen[i] = document.createElement("img");
  id_Var.appendChild(steen[i]);
  steen[i].style.display = "none"; // maak de stenen nog niet zichtbaar
  steen[i].addEventListener("click", function () { verplaatsSteen(this); });
}

function verplaatsSteen(element) {
  if (id_Var.contains(element)) {
    id_Var.removeChild(element);
    id_Vast.appendChild(element);
  }
  else {
    id_Vast.removeChild(element);
    id_Var.appendChild(element);
  }
}

id_btnDobbel.onclick = function () {
  var aantalVar;

  id_audioDice.load(); //forceert opnieuw afspelen als geluidsfragment nog niet is afgelopen
  id_audioDice.play();

  aantalVar = 0;
  for (i = 0; i < 5; i++) {
    // dobbel met de stenen op de 1e rij
    if (id_Var.contains(steen[i])) {
      waarde[i] = (Math.floor(6 * Math.random()) + 1);
      steen[i].src = "image/dice" + waarde[i] + ".svg";
      steen[i].style.display = "none";
      aantalVar++;
      myDelayDisplay(i, aantalVar);
    }
  }

  // setTimeout kan niet in de for-loop staan, omdat de argumenten niet mogen veranderen tijdens het wachten!
  function myDelayDisplay(a, b) {
    setTimeout(function () { steen[a].style.display = "inline"; }, 500 * b);
  }

  ChooseScore = true;

  beurten = beurten - 1;
  switch (beurten) {
    case 0: {
      id_btnDobbel.disabled = true;
      id_btnDobbel.innerHTML = "Kies een score!";
      id_worp3.style.visibility = "visible";
    }
      break;
    case 1: {
      id_worp2.style.visibility = "visible";
    }
      break;
    default: {  // beurten = 2 is de enige optie die overblijft
      id_worp1.style.visibility = "visible";
    }
  }
  score_opties();
};

function score_opties() {
  var aantal = []; //het aantal gedobbelde enen, tweeeen, ... , zessen in de worp
  var som_stenen = 0; // de som van de waarde van alle stenen in de worp
  var id; //als tijdelijke opslag DOM variabele

  // initialisatie array
  for (i = 1; i <= 6; i++) { aantal[i] = 0; }

  // tel het aantal enen, tweeen, ... zessen
  for (i = 0; i < 5; i++) { aantal[waarde[i]] += 1; }

  // bepaal de som van alle stenen (voor chance)
  for (i = 1; i <= 6; i++) { som_stenen += aantal[i] * i; }

  // zet punten voor enen t/m zessen in de tabel
  for (i = 1; i <= 6; i++) {
    id = document.getElementById("td" + i);
    if (id.classList.contains("td_clickable")) { id.innerHTML = aantal[i] * i; }
  }

  //Let's use Regular Expressions!
  var tmp = waarde.slice(); //maak een kopie van het array
  tmp.sort(function (a, b) { return a - b; }); //sorteer het array met numerieke waarden
  var tmpStr = tmp.join(""); //maak van de inhoud van het array een string

  var blnThree = /(.)\1{2}/.test(tmpStr);
  var blnFour = /(.)\1{3}/.test(tmpStr);
  var blnFullHouse = /(.)\1{2}(.)\2|(.)\3(.)\4{2}/.test(tmpStr);
  var blnKleineStraat = /1234|2345|3456/.test(tmpStr.replace(/(.)\1/, "$1"));
  var blnGroteStraat = /12345|23456/.test(tmpStr);
  var blnYahtzee = /(.)\1{4}/.test(tmpStr);

  id = document.getElementById("threeofakind");
  if (id.classList.contains("td_clickable")) { id.innerHTML = blnThree * som_stenen; }

  id = document.getElementById("fourofakind");
  if (id.classList.contains("td_clickable")) { id.innerHTML = blnFour * som_stenen; }

  id = document.getElementById("fullhouse");
  if (id.classList.contains("td_clickable")) { id.innerHTML = blnFullHouse * 25; }

  id = document.getElementById("kleinestraat");
  if (id.classList.contains("td_clickable")) { id.innerHTML = blnKleineStraat * 30; }

  id = document.getElementById("grotestraat");
  if (id.classList.contains("td_clickable")) { id.innerHTML = blnGroteStraat * 40; }

  id = document.getElementById("chance");
  if (id.classList.contains("td_clickable")) { id.innerHTML = som_stenen; }

  id = document.getElementById("yahtzee");
  if (id.classList.contains("td_clickable")) { id.innerHTML = blnYahtzee * 50; }
}

// Hier wordt het klikken op een scoreveld afgehandeld
for (i = 0; i < cl_TdClick.length; i++) {
  cl_TdClick[i].addEventListener("click", clickScoreveld);
}

function clickScoreveld() {
  var myId, totaal, j, k;
  if (ChooseScore) {
    this.classList.replace("td_clickable", "td_clickable_after");
    this.removeEventListener("mouseenter", changeGreen);
    this.removeEventListener("mouseleave", changeWhite);
    this.removeEventListener("click", clickScoreveld);
    id_btnDobbel.innerHTML = "Dobbel";
    ChooseScore = false;
    beurten = 3;
    rondes += 1;
    id_btnDobbel.disabled = (rondes > 13);
    id_worp1.style.visibility = "hidden";
    id_worp2.style.visibility = "hidden";
    id_worp3.style.visibility = "hidden";

    // bepaal totaal bovenste helft (1 t/m 6)
    var Totaal_EenTotZes = 0;

    for (i = 1; i <= 6; i++) {
      myId = "td" + i;
      var id = document.getElementById(myId);
      if (id.classList.contains("td_clickable_after")) {
        Totaal_EenTotZes += Number(id.innerHTML);
      }
    }

    if (Totaal_EenTotZes > 0) {
      document.getElementById("totaal").innerHTML = Totaal_EenTotZes;
    }

    // bereken totaalscore
    totaal = 0;
    for (j = 0; j < cl_TdClick_after.length; j++) {
      totaal = totaal + Number(cl_TdClick_after[j].innerHTML);
    }

    if (Totaal_EenTotZes >= 63) {
      totaal += 35;
      document.getElementById("bonus").innerHTML = 35;
    }

    // maak nog niet gekozen velden weer leeg
    for (j = 0; j < cl_TdClick.length; j++) {
      cl_TdClick[j].innerHTML = "";
    }

    document.getElementById("score").innerHTML = totaal;

    if (rondes > 13) {
      // spel is afgelopen
      setInterval(function () {
        id = document.getElementById("score");
        if (id.style.backgroundColor != "white") {
          id.style.backgroundColor = "white";
        } else {
          id.style.backgroundColor = clrGreen500;
        }
      }, 500);
    }

    // zet alle stenen terug naar de eerste rij en maak ze onzichtbaar
    for (k = 0; k < 5; k++) {
      if (id_Vast.contains(steen[k])) {
        id_Vast.removeChild(steen[k]);
        id_Var.appendChild(steen[k]);
      }
      steen[k].style.display = "none";
    }
  }
}

for (i = 0; i < cl_TdClick.length; i++) {
  cl_TdClick[i].addEventListener("mouseenter", changeGreen);
  cl_TdClick[i].addEventListener("mouseleave", changeWhite);
}

function changeWhite() {
  this.style.backgroundColor = "white";
}

function changeGreen() {
  this.style.backgroundColor = clrGreen500;
}

// Pagina vernieuwen
id_refresh.onclick = function () { location.reload(); };