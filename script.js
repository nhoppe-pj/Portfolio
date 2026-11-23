// Podsumowanie moich projektów
// Po kliknięciu przycisku skrypt pobiera stronę projects.html,
// odczytuje z niej karty projektów i układa z nich kilka zdań.

const przycisk = document.querySelector("#przycisk");
const podsumowanie = document.querySelector("#podsumowanie");

przycisk.addEventListener("click", async function () {
  try {
    // pobieram stronę z projektami jako tekst
    const odpowiedz = await fetch("projects.html");
    if (!odpowiedz.ok) {
      throw new Error(`Nie udało się pobrać projects.html: ${odpowiedz.status}`);
    }
    const html = await odpowiedz.text();

    // zamieniam tekst na dokument, w którym mogę szukać elementów
    const strona = new DOMParser().parseFromString(html, "text/html");
    const karty = strona.querySelectorAll(".projekt");

    let technologie = [];
    let tematy = [];
    let naStudia = 0;
    let wlasne = 0;

    for (let i = 0; i < karty.length; i++) {
      const karta = karty[i];
      const tytul = karta.querySelector("h3");
      if (tytul) {
        tematy.push(tytul.textContent.trim());
      }

      // "Technologie: HTML, CSS, JavaScript" -> ["HTML", "CSS", "JavaScript"]
      const elementTechnologii = karta.querySelector(".technologia");
      if (elementTechnologii) {
        const tekstTechnologii = elementTechnologii.textContent;
        const listaTechnologii = tekstTechnologii.replace("Technologie:", "").split(",");

        for (let j = 0; j < listaTechnologii.length; j++) {
          const technologia = listaTechnologii[j].trim();
          if (technologia && !technologie.includes(technologia)) {
            technologie.push(technologia);
          }
        }
      }

      const rodzaj = karta.querySelector(".tag").textContent.trim();
      if (rodzaj === "Studia") {
        naStudia++;
      } else {
        wlasne++;
      }
    }

    const lista = document.createElement("ul");

    function dodajPunkt(tekst, podpunkty) {
      const punkt = document.createElement("li");
      punkt.textContent = tekst;

      if (podpunkty) {
        const podlista = document.createElement("ul");
        for (let i = 0; i < podpunkty.length; i++) {
          const podpunkt = document.createElement("li");
          podpunkt.textContent = podpunkty[i];
          podlista.appendChild(podpunkt);
        }
        punkt.appendChild(podlista);
      }

      lista.appendChild(punkt);
    }

    dodajPunkt("Liczba projektów: " + karty.length);
    dodajPunkt("Używane technologie", technologie);
    dodajPunkt("Projekty", tematy);
    dodajPunkt("Projekty na studia: " + naStudia + ", projekty własne: " + wlasne);

    podsumowanie.replaceChildren(lista);
  } catch (blad) {
    console.error("Nie udało się wygenerować podsumowania projektów:", blad);
    podsumowanie.textContent = "Nie udało się wczytać projektów. Otwórz stronę przez Live Server albo na GitHub Pages.";
  }
});
 