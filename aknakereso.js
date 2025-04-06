let palya = [];
let bombak = 10;
let bombakSzama = 0;
let jatekvége = false; // Új változó, ami jelezni fogja, hogy vége a játéknak
let osszesCella=0;
let felfedettCella=0;
function palya_generalas(sorok, oszlopok) {
    palya = [];
    bombakSzama = 0;
	osszesCella=sorok*oszlopok-bombak

    for (let i = 0; i < sorok; i++) {
        let sor = [];
        for (let j = 0; j < oszlopok; j++) {
            sor.push(0);
        }
        palya.push(sor);
    }

    while (bombakSzama < bombak) {
        let bS = Math.floor(Math.random() * sorok);
        let bO = Math.floor(Math.random() * oszlopok);
        if (palya[bS][bO] !== "💣") {
            palya[bS][bO] = "💣";
            bombakSzama++;
        }
    }
}

function bomba_szomszedok_szamolasa(sorok, oszlopok) {
    for (let i = 0; i < sorok; i++) {
        for (let j = 0; j < oszlopok; j++) {
            if (palya[i][j] === "💣") continue;

            let bombaSzam = 0;

            if (i > 0 && j > 0 && palya[i-1][j-1] === "💣") bombaSzam++;
            if (i > 0 && palya[i-1][j] === "💣") bombaSzam++;
            if (i > 0 && j < oszlopok - 1 && palya[i-1][j+1] === "💣") bombaSzam++;
            if (j > 0 && palya[i][j-1] === "💣") bombaSzam++;
            if (j < oszlopok - 1 && palya[i][j+1] === "💣") bombaSzam++;
            if (i < sorok - 1 && j > 0 && palya[i+1][j-1] === "💣") bombaSzam++;
            if (i < sorok - 1 && palya[i+1][j] === "💣") bombaSzam++;
            if (i < sorok - 1 && j < oszlopok - 1 && palya[i+1][j+1] === "💣") bombaSzam++;

            if (bombaSzam > 0) {
                palya[i][j] = bombaSzam;
            }
        }
    }
}

function megjelenites() {
    const container = document.getElementById("palya-container");
    container.innerHTML = "";

    const tabla = document.createElement("table");

    // Tároljuk az összes cellát, hogy könnyen eltávolíthassuk az eseménykezelőket
    let cellak = [];

    for (let i = 0; i < palya.length; i++) {
        const sor = document.createElement("tr");
        for (let j = 0; j < palya[i].length; j++) {
            const cella = document.createElement("td");
            cella.dataset.ertek = palya[i][j];
            cella.textContent = ""; // kezdetben üres

            // Az eseménykezelőt itt definiáljuk, hogy később eltávolíthassuk
            function kattintasEsemany() {
                if (!jatekvege) {  // Csak akkor kattintható, ha nincs vége a játéknak
                    feddFelCella(cella, kattintasEsemany);
                }
            }

            // Hozzáadjuk az eseménykezelőt
            cella.addEventListener("click", kattintasEsemany);

            // Eseménykezelők tárolása
            cellak.push({ cella, kattintasEsemany });

            sor.appendChild(cella);
        }
        tabla.appendChild(sor);
    }

    container.appendChild(tabla);

    // Tárolt cellák, amiket később eltávolíthatunk, ha a játék véget ér
    this.cellak = cellak;
}

function feddFelCella(cella, kattintasEsemany) {
    if (cella.classList.contains("felfedve")) return;

    cella.textContent = cella.dataset.ertek;
    cella.classList.add("felfedve");
	felfedettCella++;

	if (cella.dataset.ertek === "💣") {
    // Az összes cella elérése a HTML-ben
   /* const tabla = document.getElementById("palya-container").querySelector("table"); 

    // Minden soron végigmegyünk
    for (let i = 0; i < tabla.rows.length; i++) {
        const sor = tabla.rows[i];  // Az aktuális sor (tr)

        // Minden cellán végigmegyünk az adott sorban
        for (let j = 0; j < sor.cells.length; j++) {
            const cella = sor.cells[j]; // Az aktuális cella (td)

            // A cella értékének megadása, amit a palya tömb tárol (készítse el a cella dataset-et)
            cella.textContent = cella.dataset.ertek;  // Cella értéke a dataset-ből

            // Felfedjük a cellát
            cella.classList.add("felfedve");  // Osztály hozzáadása, hogy felfedjük a cellát
        }
    }
    */
    const ertekek = palya.flat();
    const cellak = document.querySelectorAll("td");
    
    for(let i=0;i<ertekek.length;i++)
    {
        cellak[i].textContent=ertekek[i];
        cellak[i].dataset.ertek=ertekek[i];
    }

	alert("💥 BUMM! Ráléptél egy bombára!");
        jatekvege = true; // A játék vége, nem lehet több cellára kattintani
        // Eltávolítjuk az összes eseménykezelőt, így leállítjuk a játékot
        this.cellak.forEach(item => {
            item.cella.removeEventListener("click", item.kattintasEsemany);
				
			
        });

    }
	if(felfedettCella==osszesCella)
		alert("🎉🎉Nyertél,Gratulálok!🎉🎉")

	
}

function ujPalya() {
    jatekvege = false;  // Játék kezdetekor false-ra állítjuk a véget
    palya_generalas(5, 5);
    bomba_szomszedok_szamolasa(5, 5);
    megjelenites();
}

window.onload = ujPalya;
