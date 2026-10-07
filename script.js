function toTitle(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

function containsValue(obj, target) {
    if (typeof obj === "string") {
        const regex = new RegExp(`\\b${target}\\b`, "i");
        return regex.test(obj);
    }

    if (typeof obj === "object" && obj !== null) {
        return Object.values(obj).some(value =>
            containsValue(value, target)
        );
    }

    return false;
}

function getGuessDesc(index, prettyrow1, prettyrow2, prettyrow3, col1, col2, col3) {

    if (index === 0) return prettyrow1 + " X " + col1;
    if (index === 1) return prettyrow1 + " X " + col2;
    if (index === 2) return prettyrow1 + " X " + col3;

    if (index === 3) return prettyrow2 + " X " + col1;
    if (index === 4) return prettyrow2 + " X " + col2;
    if (index === 5) return prettyrow2 + " X " + col3;

    if (index === 6) return prettyrow3 + " X " + col1;
    if (index === 7) return prettyrow3 + " X " + col2;
    if (index === 8) return prettyrow3 + " X " + col3;
}

async function Guess(guess, index, row1, row2, row3, col1, col2, col3) {

    const res = await fetch(
        "https://awedtan.ca/api/operator/" + guess
    );

    const operator = await res.json();

    if (operator && Object.keys(operator).length === 0 && operator.constructor === Object) return false;

    console.log(operator)

    console.log(operatorInfo[toTitle(guess)])

    if (index === 0) return containsValue(operator.value.data.profession, row1) && containsValue(operator.value.factions, col1);
    if (index === 1) return containsValue(operator.value.data.profession, row1) && operatorInfo[toTitle(guess)].race.includes(col2);
    if (index === 2) return containsValue(operator.value.data.profession, row1) && containsValue(operator.value.data.itemObtainApproach, col3);

    if (index === 3) return containsValue(operator.value.data.rarity, row2) && containsValue(operator.value.factions, col1);
    if (index === 4) return containsValue(operator.value.data.rarity, row2) && operatorInfo[toTitle(guess)].race.includes(col2);
    if (index === 5) return containsValue(operator.value.data.rarity, row2) && containsValue(operator.value.data.itemObtainApproach, col3);

    if (index === 6) return operatorInfo[toTitle(guess)].gender == row3 && containsValue(operator.value.factions, col1);
    if (index === 7) return operatorInfo[toTitle(guess)].gender == row3 && operatorInfo[toTitle(guess)].race.includes(col2);
    if (index === 8) return operatorInfo[toTitle(guess)].gender == row3 && containsValue(operator.value.data.itemObtainApproach, col3);

    return false;
}

async function getcanon(name) {

    const res = await fetch(
        "https://awedtan.ca/api/operator/" + name
    );

    const operator = await res.json();
    return operator.canon
}

async function getname(name) {

    const res = await fetch(
        "https://awedtan.ca/api/operator/" + name
    );

    const operator = await res.json();
    return operator.keys[1]
}

async function findOperatorImage(name) {
    const response = await fetch(
        "https://api.github.com/repos/fexli/ArknightsResource/contents/charpack"
    );

    const files = await response.json();

    const match = files.find(file =>
        file.name.toLowerCase().includes(name.replace(/^\D+/g, ''))
    );

    if (match) {
        return match.download_url;
    }

    return null;
}

async function main() {

    //const response = await fetch(
    //    "https://awedtan.ca/api/operator"
    //);

    //const operators = await response.json();

    const cats = ["class", "gender", "faction", "rarity", "race", "tag"]

    const classes = ["CASTER", "TANK", "WARRIOR", "MEDIC", "SNIPER", "SPECIAL", "SUPPORT", "PIONEER"]

    const classes_pretty = ["Caster", "Defender", "Guard", "Medic", "Sniper", "Specialist", "Supporter", "Vanguard"]

    const genders = ["Male", "Female"]

    const genders_pretty = ["Male", "Female"]

    const factions = ["Penguin", "Lungmen", "Yan", "Victoria", "Ursus", "Siracusa", "Sargon", "Sami", "Rim", "Rhodes", "Minos", "Leithanien", "Laterano", "Kjerag", "Kazimierz", "Iberia", "Followers", "Columbia", "Bolivar", "Babel", "Aegir"]

    const rarities = ["TIER_3", "TIER_4", "TIER_5", "TIER_6"]

    const rarities_pretty = ["3 STAR", "4 STAR", "5 STAR", "6 STAR"]

    const races = [
    "Aegir", "Anaty", "Anura", "Archosauria", "Aslan", 
    "Caprinae", "Cautus", "Cerato", "Elafia", "Feline", 
    "Forte", "Itra", "Kuranta", "Liberi", "Lupo", 
    "Manticore", "Perro", "Petram", "Phidia", "Pilosa", 
    "Reproba", "Savra", "Ursus", "Vouivre", "Vulpo", "Zalak"
    ]

    const rand1 = Math.floor(Math.random() * classes.length)
    const row1 = classes[rand1]
    const row1pretty = classes_pretty[rand1]
    document.getElementById("row1").textContent = row1pretty;

    const rand2 = Math.floor(Math.random() * rarities.length)
    const row2 = rarities[rand2]
    const row2pretty = rarities_pretty[rand2]
    document.getElementById("row2").textContent = row2pretty;

    const rand3 = Math.floor(Math.random() * genders.length)
    const row3 = genders[rand3]
    const row3pretty = genders_pretty[rand3]
    document.getElementById("row3").textContent = row3pretty;

    const col1 = factions[Math.floor(Math.random() * factions.length)]
    document.getElementById("col1").textContent = col1;

    const col2 = races[Math.floor(Math.random() * races.length)]
    document.getElementById("col2").textContent = col2;

    const col3 = "Recruitment"
    document.getElementById("col3").textContent = col3;

    //console.log(operators);

    //const result = operators.filter(operator =>
        //containsValue(operator.value.factions, "lungmen")
        //containsValue(operator.value.bases, "office")
        //containsValue(operator.value.data.profession, "SPECIAL")
        //containsValue(operator.value.data.rarity, "TIER_3")
        //containsValue(operator.value.data, "he")
        //containsValue(operator.value.data.itemObtainApproach, "Recruitment")
        //console.log("ignore")
    //);

    //console.log(result)

    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("close-popup");
    const submit = document.getElementById("submit");
    const squares = document.querySelectorAll(".game-grid button");

    let clickedIndex;

    squares.forEach((square, index) => {
        square.addEventListener("click", () => {
            clickedIndex = index;
            popup.style.display = "flex";
            console.log(clickedIndex);
            guessdesc = getGuessDesc(clickedIndex, row1pretty, row2pretty, row3pretty, col1, col2, col3);
            document.getElementById("guessdesc").textContent = guessdesc;
        });
    });

    closePopup.addEventListener("click", () => {
        popup.style.display = "none";
    });

    submit.addEventListener("click", async () => {
        guess = document.getElementById("operator-search").value.toLowerCase()
        if (await Guess(guess, clickedIndex, row1, row2, row3, col1, col2, col3)) {
            console.log("yup");
            const canon = await getcanon(guess)
            console.log(canon)
            const imageUrl = await findOperatorImage(canon);
            console.log(imageUrl);
            const image = document.createElement("img");
            image.src = imageUrl;
            squares[clickedIndex].appendChild(image);
            squares[clickedIndex].disabled = true;
            const contenedor = document.createElement('div');
            contenedor.style.position = 'relative';
            contenedor.style.display = 'inline-block';
            image.parentNode.insertBefore(contenedor, image);
            contenedor.appendChild(image);
            image.style.display = 'block';
            const texto = document.createElement('div');
            const name = await getname(guess)
            texto.textContent = name;
            texto.style.position = 'absolute';
            texto.style.top = '90%';
            texto.style.left = '50%';
            texto.style.transform = 'translate(-50%, -90%)';
            texto.style.color = 'white';
            texto.style.fontSize = '14px';
            texto.style.fontWeight = 'bold';
            texto.style.fontFamily = 'sans-serif';
            texto.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
            texto.style.pointerEvents = 'none';
            contenedor.appendChild(texto);
        } else {
            console.log("nah");
        }
        popup.style.display = "none";
    });
}

main();