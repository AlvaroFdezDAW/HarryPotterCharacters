const houseColors = 
{
    'Gryffindor': 
    {
        background: 'var(--gryffindor-bg)',
        text: 'var(--gryffindor-text)'
    },

    'Hufflepuff': 
    {
        background: 'var(--hufflepuff-bg)',
        text: 'var(--hufflepuff-text)'
    },

    'Ravenclaw': 
    {
        background: 'var(--ravenclaw-bg)',
        text: 'var(--ravenclaw-text)'
    },

    'Slytherin': 
    {
        background: 'var(--slytherin-bg)',
        text: 'var(--slytherin-text)'
    },

    'default': 
    {
        background: 'var(--unknownHouse-bg)',
        text: 'var(--unknownHouse-text)'
    }
};

async function fetchCharacters() 
{
    const response = await fetch('https://hp-api.onrender.com/api/characters');
    const characters = await response.json();
    return characters;
}

function createCharacterCard(character) 
{
    const card = document.createElement('div');
    card.classList.add('character-info');

    const house = character.house || 'default';
    const { background, text } = houseColors[house];

    card.style.backgroundColor = background;
    card.style.color = text;

    const img = document.createElement('img');
    img.src = character.image || 'Images/Unknown.jpg';
    img.alt = character.name;
    img.style.width = '150px';
    img.style.height = '150px';
    img.style.objectFit = 'contain';

    const name = document.createElement('h3');
    name.textContent = character.name;

    const species = document.createElement('p');
    species.textContent = `Species: ${character.species || 'unknown'}`;

    const houseElement = document.createElement('p');
    houseElement.textContent = `House: ${character.house || 'unknown'}`;

    const actorLabel = character.gender === 'female' ? 'Actress' : 'Actor';

    const additionalInfo = document.createElement('div');
    additionalInfo.classList.add('additional-info');
    additionalInfo.style.display = 'none';
    additionalInfo.innerHTML = `
        <p>Patronus: ${character.patronus || 'unknown'}</p>
        <p>${actorLabel}: ${character.actor || 'unknown'}</p>
    `;

    const seeMoreButton = document.createElement('p');
    seeMoreButton.textContent = 'Show more';
    seeMoreButton.classList.add('show-more');
    seeMoreButton.style.cursor = 'pointer';

    seeMoreButton.addEventListener('click', () => {
        if (additionalInfo.style.display === 'none') 
        {
            additionalInfo.style.display = 'block';
            seeMoreButton.textContent = 'Show less';
        } 
        else 
        {
            additionalInfo.style.display = 'none';
            seeMoreButton.textContent = 'Show more';
        }
    });

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');
    cardContent.appendChild(img);
    cardContent.appendChild(name);
    cardContent.appendChild(species);
    cardContent.appendChild(houseElement);
    cardContent.appendChild(additionalInfo);

    card.appendChild(cardContent);
    card.appendChild(seeMoreButton);

    return card;
}

function displayCharacters(characters, houseFilter = null) 
{
    const container = document.getElementById('characters-container');
    container.innerHTML = '';

    const filteredCharacters = houseFilter
        ? characters.filter(character => character.house === houseFilter)
        : characters;

    filteredCharacters.forEach(character => {
        const card = createCharacterCard(character);
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    let allCharacters = [];

    fetchCharacters().then(characters => {
        allCharacters = characters;
        displayCharacters(allCharacters);

        document.getElementById('gryffindor-btn').addEventListener('click', () => {
            displayCharacters(allCharacters, 'Gryffindor');
        });

        document.getElementById('hufflepuff-btn').addEventListener('click', () => {
            displayCharacters(allCharacters, 'Hufflepuff');
        });

        document.getElementById('ravenclaw-btn').addEventListener('click', () => {
            displayCharacters(allCharacters, 'Ravenclaw');
        });

        document.getElementById('slytherin-btn').addEventListener('click', () => {
            displayCharacters(allCharacters, 'Slytherin');
        });

        document.getElementById('hogwarts-btn').addEventListener('click', () => {
            displayCharacters(allCharacters.filter(character => character.house && character.house !== 'default'));
        });

        document.getElementById('all-btn').addEventListener('click', () => {
            displayCharacters(allCharacters);
        });

        document.getElementById('search').addEventListener('input', (e) => {
            const searchQuery = e.target.value.toLowerCase();
            const filteredCharacters = allCharacters.filter(character => 
                character.name.toLowerCase().includes(searchQuery)
            );
            displayCharacters(filteredCharacters);
        });
    });
});
