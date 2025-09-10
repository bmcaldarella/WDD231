const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector("#cards");




const getProphetData = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.table(data.prophets);
    displayProphets(data.prophets);

  } catch (e) {
    console.log("Error" + e);
  }

};

const displayProphets = (prophets) => {
  prophets.forEach((prophet) => {
    const card = document.createElement('section');
    const fullName = document.createElement('h2');
    const portrait = document.createElement('img');
    const birth = document.createElement('p');

    card.classList.add('card');


    fullName.textContent = `${prophet.name} ${prophet.lastname}`;
    birth.textContent = `Born: ${prophet.birthdate} in ${prophet.birthplace}`;
    portrait.setAttribute('src', prophet.imageurl);
    portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
    portrait.setAttribute('loading', 'lazy');
    portrait.setAttribute('width', '200');
    portrait.setAttribute('height', '240');

    card.appendChild(fullName);
    card.appendChild(birth);
    card.appendChild(portrait);
    cards.appendChild(card);
  });
};

getProphetData();
