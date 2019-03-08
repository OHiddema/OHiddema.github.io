var steen = []; // images van de getoonde stenen
var waarde = []; // aantal ogen op de getoonde stenen
var beurten = 3; // aantal beurten binnen een ronde loopt af van 3 naar 1
var rondes = 1; // aantal rondes loopt op van 1 naar 13
var ChooseScore = false;  // geeft aan of speler een score mag kiezen in de tabel

// zet alle DOM-elementen in variabelen
var id_btnDobbel = document.getElementById("btnDobbel");
var id_btnPlayAgain = document.getElementById("btnPlayAgain");
var id_Var = document.getElementById("variabel");
var id_Vast = document.getElementById("vast");
var id_Mes = document.getElementById("message");
var cl_TdClick = document.getElementsByClassName("td_clickable");

window.onload = function () {
  for (i = 0; i < 5; i++) {
    steen[i] = document.createElement("img");
    id_Var.appendChild(steen[i]);
    steen[i].style.display = "none"; // maak de stenen nog niet zichtbaar

    //verplaats steen van rij
    steen[i].onclick = function () {
      if (id_Var.contains(this)) {
        id_Var.removeChild(this);
        id_Vast.appendChild(this);
      }
      else {
        id_Vast.removeChild(this);
        id_Var.appendChild(this);
      }
    }
  }
}

id_btnDobbel.onclick = function () {
  for (i = 0; i < 5; i++) {
    // dobbel met de stenen op de 1e rij
    if (id_Var.contains(steen[i])) {
      waarde[i] = (Math.floor(6 * Math.random()) + 1);
      steen[i].src = "dice" + waarde[i] + ".svg";
      steen[i].style.display = "inline";
    }
  }

  beurten = beurten - 1;
  ChooseScore = true;
  switch (beurten) {
    case 0: {
      id_Mes.innerHTML = "Kies je score!";
      id_btnDobbel.disabled = true;
    }
      break;
    case 1: {
      id_Mes.innerHTML = "Nog eenmaal dobbelen...";
    }
      break;
    default: {  // beurten = 2 is de enige optie die overblijft
      id_Mes.innerHTML = "Nog tweemaal dobbelen...";
    }
  }
  id_Mes.style.visibility = "visible"
  score_opties();
}

function score_opties() {
  var aantal = []; //het aantal gedobbelde enen, tweeeen, ... , zessen in de worp
  var som_stenen = 0; // de som van de waarde van alle stenen in de worp

  // initialisatie array
  for (i = 1; i <= 6; i++) { aantal[i] = 0; }

  // tel het aantal enen, tweeen, ... zessen
  for (i = 0; i < 5; i++) { aantal[waarde[i]] += 1; }

  // bepaal de som van alle stenen (voor chance)
  for (i = 1; i <= 6; i++) { som_stenen += aantal[i] * i }

  // zet punten voor enen t/m zessen in de tabel
  for (i = 1; i <= 6; i++) {
    var myId = "td" + i;
    var id = document.getElementById(myId);
    if (id.style.fontWeight < 900) {
      if (aantal[i] > 0) {
        id.innerHTML = aantal[i] * i;
      } else {
        id.innerHTML = "";
      }
    }
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

  // Three of a kind
  var id = document.getElementById("threeofakind");
  if (id.style.fontWeight < 900) {
    if (blnThree) {
      id.innerHTML = som_stenen;
    } else {
      id.innerHTML = "";
    }
  }

  // Four of a kind
  var id = document.getElementById("fourofakind");
  if (id.style.fontWeight < 900) {
    if (blnFour) {
      id.innerHTML = som_stenen;
    } else {
      id.innerHTML = "";
    }
  }

  // Full house 
  var id = document.getElementById("fullhouse");
  if (id.style.fontWeight < 900) {
    if (blnFullHouse) {
      id.innerHTML = 25;
    } else {
      id.innerHTML = "";
    }
  }

  // Kleine straat
  var id = document.getElementById("kleinestraat");
  if (id.style.fontWeight < 900) {
    if (blnKleineStraat) {
      id.innerHTML = 30;
    } else {
      id.innerHTML = "";
    }
  }

  // Grote straat
  var id = document.getElementById("grotestraat");
  if (id.style.fontWeight < 900) {
    if (blnGroteStraat) {
      id.innerHTML = 40;
    } else {
      id.innerHTML = "";
    }
  }

  // Chance
  var id = document.getElementById("chance");
  if (id.style.fontWeight < 900) {
    id.innerHTML = som_stenen;
  }

  // Yahtzee
  var id = document.getElementById("yahtzee");
  if (id.style.fontWeight < 900) {
    if (blnYahtzee) {
      id.innerHTML = 50;
    } else {
      id.innerHTML = "";
    }
  }
}

for (i = 0; i < cl_TdClick.length; i++) {
  cl_TdClick[i].onclick = function () {
    if ((ChooseScore == true) && (this.style.fontWeight < 900)) {
      this.style.cursor = "auto";
      this.style.fontWeight = 900;
      this.style.backgroundColor = "#4CAF50";
      this.style.color = "black"
      ChooseScore = false;
      beurten = 3;
      rondes += 1;

      // bepaal of velden 1 t/m 6 allemaal gevuld zijn en bepaal totaal
      var blnAlleGevuld = true;
      var Totaal_EenTotZes = 0;
      var blnBonus = false;
      for (i = 1; i <= 6; i++) {
        myId = "td" + i;
        var id = document.getElementById(myId);
        if (id.style.fontWeight == 900) {
          Totaal_EenTotZes += Number(id.innerHTML);
        } else {
          blnAlleGevuld = false;
        }
      }

      if (Totaal_EenTotZes > 0) {
        document.getElementById("totaal").innerHTML = Totaal_EenTotZes;
      }

      if (blnAlleGevuld && (Totaal_EenTotZes >= 63)) {
        blnBonus = true;
        document.getElementById("bonus").innerHTML = 35;
      }

      // bereken totaalscore, leeg overige velden
      totaal = 0;
      for (j = 0; j < cl_TdClick.length; j++) {
        if (cl_TdClick[j].style.fontWeight == 900) {
          totaal = totaal + Number(cl_TdClick[j].innerHTML);
        } else {
          cl_TdClick[j].innerHTML = "";
        }
      }
      if (blnBonus == true) {
        totaal += 35;
      }
      document.getElementById("score").innerHTML = totaal;

      // Spel is voltooid
      if (rondes > 13) {
        setInterval(function () {
          id = document.getElementById("score");
          if (id.style.backgroundColor == "4CAF50") {
            id.style.backgroundColor = "white";
          } else {
            id.style.backgroundColor = "4CAF50";
          }
        }
          , 500);
      }

      if (rondes <= 13) {
        id_btnDobbel.disabled = false;
      }
      id_Mes.style.visibility = "hidden";
      for (k = 0; k < 5; k++) {
        if (id_Vast.contains(steen[k])) {
          id_Vast.removeChild(steen[k]);
          id_Var.appendChild(steen[k]);
        }
        steen[k].style.display = "none";
      }
    }
  }
}

for (i = 0; i < cl_TdClick.length; i++) {
  cl_TdClick[i].onmouseenter = function () {
    if (this.style.fontWeight < 900) {
      this.style.backgroundColor = "#4CAF50";
    }
  }
  cl_TdClick[i].onmouseleave = function () {
    if (this.style.fontWeight < 900) {
      this.style.backgroundColor = "white";
    }
  }
}

// Pagina vernieuwen
id_btnPlayAgain.onclick = function () { location.reload(); }