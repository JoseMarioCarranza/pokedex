var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

const name_input = document.getElementById("name_input");
const container = document.getElementById("container");

const search = async () => {
    let pokemon = await search_pokemon(name_input.value);
    let pokemon_id = get_pokemon_id(pokemon);
    let pokemon_abilities = await abilities_info(pokemon);
    let pokemon_stats_info = get_stats(pokemon)

    console.log(pokemon)

    container.innerHTML = `
    <img id="pokemon_img" src=${pokemon.sprites.other.home.front_default} />

    <div id="top_side">
        <div id="leftside">
            <h1>POKEMON #${pokemon_id}<br>
            Name: ${pokemon.name}<br>
            Type: ${pokemon.types[0].type.name}</h1>
        </div>

        <div id="rightside">
            ${pokemon_stats_info}
        </div>
    </div>

    <div class="pokemon_abilities">
        ${pokemon_abilities}
    </div>
    `
}

const search_pokemon = async (name) => {
    let pokemon = "Falta el pokemon";
    return await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => console.log('error', error));
}

const get_pokemon_id = (pokemon) => {
    let pokemon_id = pokemon.id.toString();

    if (pokemon_id.length <= 2) {
        pokemon_id = "0".repeat(3 - pokemon_id.length) + pokemon_id;
    }

    return pokemon_id;
};

const abilities_info = async (pokemon) => {
    const abilitiesPromises = pokemon.abilities.map(async (ability) => {
        try {
            const response = await fetch(ability.ability.url, requestOptions);
            const result = await response.json();
            const name = result.name;
            const img_pokemon = pokemon.sprites.front_default;
            const description = result.effect_entries[find_language(result.effect_entries)].effect;
            return `
            <div class="pokemonability">
                <div class="leftside">
                    <img class="pokemon_ability_img" src="${img_pokemon}"/>
                </div>
                <div class="rightside">
                    <p> 
                    Ability: ${name}<br>
                    Description: ${description}
                    </p>
                </div>
            </div>`;
        } catch (error) {
            console.log('error', error);
            return "";
        }
    });
    const abilitiesArray = await Promise.all(abilitiesPromises);
    return abilitiesArray.join("");
};

const find_language = (object) => {
    let find_it = false;
    let num_index = 0;
    while (find_it == false) {
        if (object[num_index].language.name == "en") {

            find_it = true;

        } else {

            num_index = num_index + 1;

        }
    }
    return num_index
}

const get_stats = (pokemon) => {
    let stats_info = "";
    pokemon.stats.map((stat) => {
        const name_stat = stat.stat.name;
        const num_stat = stat.base_stat;
        stats_info = stats_info + `${name_stat}: ${num_stat} <br>`;
    })
    return stats_info;
}