//Basic JS goes in this file, that the page loads in.

import { getPokeAndOutput } from "./pokeAPI.js";


function loadPoke(event) {
    if (event.keyCode === 13) {
        const inputID = document.getElementById("pokeIDInput").value;
        getPokeAndOutput(inputID);
        return false;
    }
}

//Expose functions so theyre accessible in html page

window.loadPoke = loadPoke;
