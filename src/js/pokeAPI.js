const url = "https://pokeapi.co/api/v2/pokemon";

function ifError(er) {
    document.getElementById("pokeIDInput").placeholder = "Enter a valid ID";
    document.getElementById("pokeIDInput").value = "";
}

async function getPokemonDetails(id) {
    const response = await fetch(`${url}/${id}`);
    const data = await response.json();
    return data;
}

function transformPokemon(jsonPokeObj) {
    const pokeObject = {};
    pokeObject.name = jsonPokeObj.name;
    pokeObject.weight = jsonPokeObj.weight;
    pokeObject.id = jsonPokeObj.id;
    pokeObject.type = "";
    jsonPokeObj.types.forEach((type) => {
        pokeObject.type += type.type.name + " ";
    });
    return pokeObject;
}
function toggleLoader(onoroff) {
    if (onoroff) { document.getElementById("loader").style.display = "initial"; }
    else { document.getElementById("loader").style.display = "none"; }
}

function clearData() {
    document.getElementById("pokemonDetails").innerHTML = "";
}

export function getPokeAndOutput(id) {
    toggleLoader(true);
    clearData();
    let pokePromise = Promise.resolve(getPokemonDetails(id))
    pokePromise.then((jsonObj) => {
        toggleLoader(false);
        const pokeObject = transformPokemon(jsonObj);
        document.getElementById("pokemonDetails").innerHTML = `
          <tr>
            <td>${pokeObject.id}</td>
            <td>${pokeObject.name}</td>
            <td>${pokeObject.type}</td>  
            <td>${pokeObject.weight}</td>           
          </tr>       
        `;
    document.getElementById("pokeIDInput").placeholder = "Enter a Pokemon id";
    
    }).catch(ifError);
}
