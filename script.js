DOM = {
  appDiv : document.getElementById('app'),
  boardDiv : document.getElementById('board'),
};

let rowsNumber = 3;
let colNumber = 4;
let selectedCard = null;
const variants = ['html', 'css', 'js', 'react', 'vue', 'angular', 'redux', 'jest'];
let cards = [];

function shuffle(array) {
  const result = [...array];
  return result.sort(() => {
    return Math.random() - 0.5;
  });
}

function initCards(count) {
  const size = count / 2;
  const options = variants.slice(0, size);
  let items = new Array(count).fill({});
  items = items.map((item, index) => {
    console.log(index, size, index % size);
    return {
      value : options[index % size],
      id : index,
    };
  });
  const result = shuffle(items);
  console.log("result", result);
  return result;
}



function initBoard(level) {
  const count = rowsNumber * colNumber;
  cards = initCards(count);
  console.log(count);
}



function creatBoard(cards) {
  cards.forEach((card) => {
    const cellDiv = _createElement("div", { className: "cell" });
    DOM.boardDiv.appendChild(cellDiv);
	
	const cardDiv = document.createElement('div');
	cardDiv.classList.add('flip-card');
	cardDiv.id = `card-${card.id}`;

	const cardBody = document.createElement('div');
	cardBody.className ="flip-card-inner";
	
	const frontSide = document.createElement('div');
	frontSide.className ="flip-card-front";

	const backSide = document.createElement('div');
	backSide.className = "flip-card-back";
	
	const image = document.createElement('img');
	image.src  = `/images/${card.value}.png`;
	image.alt = card.value;

	backSide.append(image)
	cardBody.append(frontSide, backSide)
	cardDiv.append(cardBody)
	
	cardDiv.addEventListener('click' , event => {
		handleTurn(event, card);
	})
	cellDiv.append(cardDiv);
  });
}


initBoard();

function toogleCard(cardDiv) {
	cardDiv.classList.toggle('active');
}

function handleTurn(event, clickedCard) {
	console.log('clickedCard', clickedCard);
	console.log('selectedCard', selectedCard);
	if (!selectedCard) {
		// first click
		toogleCard(event.currentTarget);
		selectedCard = clickedCard;
	} else {
		toogleCard(event.currentTarget);
		// second click
		if (selectedCard.value === clickedCard.value) {
			// match
			console.log('yes');
		} else {
			// not match
			const currentTarget = event.currentTarget;
			setTimeout(() => {
				toogleCard(currentTarget);
				const prevCard = document.getElementById(`card-${selectedCard.id}`);
				toogleCard(prevCard);
				selectedCard = null;
			}, 1000);
		}
	}
}

creatBoard(cards);

function _createElement(tag, props) {
	const element = document.createElement(tag);
	element.className = props.className || '';
	if (props.id) {
		element.id = props.id;
	}
	return element;
}