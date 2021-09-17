  
  const DOM = {
  appDiv : document.getElementById('app'),
  boardDiv : document.getElementById('board'),
  timerDiv : document.getElementById('timer'),
  movesDiv : document.getElementById('moves'),
  levels : document.getElementById('levels'),
  modal : document.getElementById('modal'),
};

let setTimer = 0;
let rowsNumber = 3;
let colNumber = 4;
let size = rowsNumber * colNumber;
let selectedCard = null;
let canPlay = true;
let movesCouner = 0;
const variants = ['html', 'css', 'js', 'react', 'vue', 'angular', 'redux', 'jest'];
const levels = [{name:'Easy' , id:"easy"}, {name:"Medium",id:"medium"}, {name:'Ninja',id:"ninja"}];
let cards = [];
let score = 0;
const timer = creatTimer()
//timer._start();


function creatTimer(){
	let intervalId = null;
	function _update(t){
		setTimer = t; // timer state
		DOM.timerDiv.innerHTML = t;
	}
	function _start() {
		intervalId = setInterval(() => {
			_update(setTimer + 1);
		}, 1000);
	}
	function _stop(){
		clearInterval(intervalId);
	}
	function _reset(){
		_stop();
		_update(0);
	}
	function _restart() {
		_reset();
		_start();
	}
	return {
		_start,
		_stop,
		_reset,
		_restart,
	};
}

function creatMovesCounter(){
	const score = _createElement("div", { className: "score" });
	DOM.movesDiv.appendChild(score);
	movesCouner++
	DOM.movesDiv.innerHTML = movesCouner;
}


function shuffle(array) {
  const result = [...array];
  return result.sort(() => {
    return Math.random() - 0.5;
  });
}


function setGameLevel(levels){
	console.log(levels)
	const level = _createElement("ul" , { className: "star"});
	level.className =" star-rating";
	DOM.levels.append(level);
	levels.map(l => {
    const li = document.createElement('li');
    li.className = "fa fa-star";
	li.id = l.id;
	li.innerHTML = l.name;
	li.addEventListener('click' , ()=> {
		console.log('level:' ,l.name) // add level selctore
		initBoard(l.id);
	})
	level.append(li)
	})

}

setGameLevel(levels);

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
if(level == 'easy'){
	rowsNumber =6;
	colNumber =6;
}
  const count = rowsNumber * colNumber;
  cards = initCards(count);
  console.log(count);
}

function creatModal(){
DOM.modal.append(modalDiv);

const modalDiv = document.createElement('div');
modalDiv.className ="modal-dialog";

const modalHeader = document.createElement('div');
modalHeader.className = "modal-header";

const modalBody = document.createElement('div');
modalBody.className =" modal-body";

const modalFooter = document.createElement('div');
modalFooter.className = "modal-footer";
modalDiv.append(modalHeader , modalBody, modalFooter)

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
		if (cardDiv.classList.contains('active')) return;
		if (!canPlay) return;
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
	creatMovesCounter()
	if (!selectedCard) {
		// first click
		// canPlay = false;
		if(setTimer == 0) {
			return alert("start timer") // start timer
		}
		
		toogleCard(event.currentTarget);
		selectedCard = clickedCard;
		
		
	} else {
		toogleCard(event.currentTarget);
		// second click
		if (selectedCard.value === clickedCard.value) {
			// match
			score ++
			console.log('yes');
			console.log('score', score);
			if (score === size / 2) {
				setTimeout(() => {
					alert('game over'); // add modal
					creatModal();
				});
				timer._stop();
			}
				selectedCard = null;
		} else { 
			// not match
			const currentTarget = event.currentTarget;
			canPlay = false;
			setTimeout(() => {
				toogleCard(currentTarget);
				const prevCard = document.getElementById(`card-${selectedCard.id}`);
				toogleCard(prevCard);
				canPlay = true;
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