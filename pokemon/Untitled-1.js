// const fetch = require('node-fetch');

const imageLoc = 'https://leonselby.github.io/JavaScript%20Exercises/pokemonTask/pokeSprites/';
const typesArray = [
    "normal",
    "fighting",
    "flying",
    "poison",
    "ground",
    "rock",
    "bug",
    "ghost",
    "steel",
    "fire",
    "water",
    "grass",
    "electric",
    "psychic",
    "ice",
    "dragon",
    "dark",
    "fairy"
]// index + 1 is its ID

let typeOfMove;

Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

async function fetchPokemonNames() {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=151`);
    const data = await response.json();
    const results = data['results'];
    let names = [];
    results.forEach((a) => {
        names.push(a.name)
    })
    return names;
}

async function fetchPokemonMoves(PokeID) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${PokeID + 1}`);
    const data = await response.json();
    let moves = data['moves'];
    moves = moves.map((c) => {
        return c.move.name
    });
    return moves;
}

async function fetchPokemonTypes(PokeID) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${PokeID}`);
    const data = await response.json();
    let types = data['types'];
    types = types.map((c) => {
        return c.type.name
    });
    return types;
}

async function fetchMovesTypes(MoveName) {
    const response = await fetch(`https://pokeapi.co/api/v2/move/${MoveName}`);
    const data = await response.json();
    let type = data['type'].name;
    return type;
}

async function fetchTypeSuperEffectivesPromise(TypeName) {
    let typeID = typesArray.indexOf(typeOfMove.toLowerCase()) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/type/${typeID}`);
    const data = await response.json();
    const damageRelations = data['damage_relations'];
    const doubleDMGTo = damageRelations['double_damage_to'];
    let names = doubleDMGTo.map((a) => { return a.name })
    return names;
}

async function resolveTypeSupEffectPromise(TypeName) {
    let names = [];
    let namesProm = await Promise.resolve(fetchTypeSuperEffectivesPromise(TypeName))
        .then((a) => {
            a.forEach((b) => {
                names.push(b);
            })
        })
    return names;
}

async function resolveDefTypesPromise(defPokeID) {
    let defTypes = [];
    let promise4 = await Promise.resolve(fetchPokemonTypes(defPokeID))
        .then((z) => {
            z.forEach((y) => {
                defTypes.push(y);
            })
        })
    return defTypes;
}

async function determineResult(moveName, defPokeID) {
    let counter = 0;
    let damageMultiplier = 1;
    let realDefID = defPokeID + 1;
    let defTypes = await resolveDefTypesPromise(realDefID); //returns array
    let doubleAgainstTypes = await resolveTypeSupEffectPromise(typeOfMove); //returns array

    doubleAgainstTypes.forEach((type) => {
        defTypes.forEach((defType) => {
            if (type === defType) {
                counter++;
            }
        })
    })
    if (counter === 1) {
        damageMultiplier = 2;
    } else if (counter === 2) {
        damageMultiplier = 4;
    }
    let outPara = document.getElementById('outputpara');
    outPara.innerHTML = moveName + " will do " + damageMultiplier + "x damage!";

}

async function resolveMoveTypePromise(moveName) {
    let moveType;
    let promise3 = await Promise.resolve(fetchMovesTypes(moveName))
        .then((a) => moveType = a);
    return promise3;
}



function populateNameboxes() {
    let box = document.getElementById('PokemonList1');
    let box2 = document.getElementById('PokemonList2');
    let namesArray = [];
    let promise1 = Promise.resolve(fetchPokemonNames());
    promise1.then((a) => {
        a.forEach((b) => {
            let option = document.createElement('option');
            let option2 = document.createElement('option');
            option.text = b;
            option2.text = b;
            box2.add(option2, box.length)
            box.add(option, box.length)
            option.id = box.length;
            option2.id = box2.length;
        })
    })
}

function clearBoxes() {
    let movesBox = document.getElementsByTagName('select')[1];
    movesBox.childNodes.forEach(z => {
        movesBox.removeChild(z);
    })
}

function populateMovesBox(pokemonID) {
    let metabox = document.getElementById('formoves');
    let movesBox = document.createElement('select');
    movesBox.id = "movesboxx";
    movesBox.size = "30";
    if (metabox.hasChildNodes()) {
        metabox.removeChild(metabox.childNodes[0]);
    }
    metabox.appendChild(movesBox);
    let att = document.createAttribute("onClick")
    att.value = "console.log(\"1\")";
    let promise2 = Promise.resolve(fetchPokemonMoves(pokemonID));
    promise2.then((a) => {
        a.forEach((b) => {
            let moveOption = document.createElement('option');
            moveOption.text = b;
            movesBox.add(moveOption, movesBox.length);
            moveOption.id = movesBox.length;
            let att2 = document.createAttribute("onClick")
            att2.value = "storeMovesTypes(movesboxx.value)";
            moveOption.setAttributeNode(att2);
        })
    })
}

async function storeMovesTypes(moveName){
    typeOfMove = await resolveMoveTypePromise(moveName);
    console.log(typeOfMove + " type")
}

function placeImageAtk(numID) {
    let numberID = numID + 1;
    let imageLocID = imageLoc + numberID + ".png";
    let ele = document.getElementById("attackingpokemon");
    if (ele.hasChildNodes()) {
        ele.removeChild(ele.childNodes[0]);
    }
    let image = document.createElement('img');
    image.id = numberID;
    image.src = imageLocID;
    ele.appendChild(image);
}

function placeImageDef(numID) {
    let numberID = numID + 1;
    let imageLocID = imageLoc + numberID + ".png";
    let el = document.getElementById("defendingpokemon");
    if (el.hasChildNodes()) {
        el.removeChild(el.childNodes[0]);
    }
    let image = document.createElement('img');
    image.id = numberID;
    image.src = imageLocID;
    el.appendChild(image);
}

function selectPokeMethod(numIDatk, numIDdef) {
    placeImages(numIDatk, numIDdef);
    populateMovesBox(numIDatk);
}

function placeImages(numIDatk, numIDdef) {
    placeImageAtk(numIDatk);
    placeImageDef(numIDdef);
}

populateNameboxes();
