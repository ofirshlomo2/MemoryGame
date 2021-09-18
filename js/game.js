import { creatTimer, Counter, shuffle } from './utils.js';


const config = {
	light: {
		variants: ['html', 'css', 'js', 'react', 'vue', 'angular', 'redux', 'jest', 'github', 'npm', 'webpack', 'babel'],
	},
	dark: {
		variants: ['cat', 'dog', 'fox', 'horse', 'jiraf', 'lion', 'cheetah', 'snake', 'squirrel', 'elephant', 'donkey', 'birde'],
	},
};

export function MemoryGame({ target, timerTarget, movesTarget, onGameOver }) { // creat new game 
	const DOM = {
		app: target,
		timerEl: timerTarget,
		board: _createElement('div', { id: 'board', className: 'board' }),
		alert : document.getElementById('alert'),
		alertgame :  document.getElementById('alertgame'),
	};

	const counter = Counter(movesTarget);
	const timer = creatTimer({ targetEl: DOM.timerEl });

	DOM.app.appendChild(DOM.board);
	DOM.alert.style.display = "none"
	DOM.alertgame.style.display = "none"

	let mode = 'light'; // light | dark
	let cards = [];
	let size = 0;
	let score = 0;
	let selectedCard = null;
	let canPlay = true; // wait until card flip end
	let isGameStarted = false;
	let selectedLevel = '';
	let mistakes = 0;
	let history = []; // games history
	let isPaused = false;

	function init(level = selectedLevel) {
		timer.reset();
		mistakes = 0;
		isGameStarted = false;
		size = _getSize(level);
		cards = initCards(size);
		selectedLevel = level;
		_creatBoard(cards);
	}
	function start() {
		if (!size) return DOM.alert.style.display = "block"
		//alert(' init board first..'); // board not ready

		if (!isGameStarted) {
			timer.start();
			isGameStarted = true;
			DOM.alert.style.display = "none"
			DOM.alertgame.style.display = "none"
		}
	}
	function stop() {
		isPaused = true;
		timer.stop();
	}
	function resume() {
		isPaused = false;
		timer.start();
	}
	function restart() {
		timer.reset();
		size = 0;
		score = 0;
		selectedCard = null;
		canPlay = true; // wait until card flip end
		isGameStarted = false;
		mistakes = 0;
		counter.reset()
		init(selectedLevel);

	}

	function _handleTurn(event, clickedCard) {
		if (isPaused) return;
		if (!selectedCard) {
			// first click
			if (!isGameStarted) {
				return DOM.alertgame.style.display = "block" 
			}
			counter.add();
			toogleCard(event.currentTarget);
			selectedCard = clickedCard;
		} else {
			counter.add();
			toogleCard(event.currentTarget);
			// second click
			if (selectedCard.value === clickedCard.value) {
				// match
				score++;
				console.log('yes');
				console.log('score', score);
				if (score === size / 2) {
					timer.stop();
					const newGame = {
						level: selectedLevel,
						mistakes: mistakes,
						time: timer.getTime(),
					};
					history.push(newGame);
					onGameOver({
						history: history,
					});
				}
				selectedCard = null;
			} else {
				// not match
				mistakes++;
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

	function _getSize(level) {
		if (level == 'easy') return 12;
		if (level == 'medium') return 18;
		if (level == 'ninja') return 24;
	}

	function _creatBoard(cards) {
		DOM.board.innerHTML = '';
		cards.forEach(card => {
			const cellDiv = _createElement('div', {
				className: `cell ${selectedLevel}`,
			});
			console.log('here');
			DOM.board.appendChild(cellDiv);

			const cardDiv = document.createElement('div');
			cardDiv.classList.add('flip-card');
			cardDiv.id = `card-${card.id}`;

			const cardBody = document.createElement('div');
			cardBody.className = 'flip-card-inner';

			const frontSide = document.createElement('div');
			frontSide.className = 'flip-card-front card-bg1';

			const backSide = document.createElement('div');
			backSide.className = 'flip-card-back';

			const image = document.createElement('img');
			image.src = `/images/${mode}/${card.value}.png`;
			image.alt = card.value;

			backSide.append(image);
			cardBody.append(frontSide, backSide);
			cardDiv.append(cardBody);

			cardDiv.addEventListener('click', event => {
				if (cardDiv.classList.contains('active')) return;
				if (!canPlay) return;
				_handleTurn(event, card);
			});
			cellDiv.append(cardDiv);
		});
	}

	function toggleMode(){
		mode = mode === 'light' ? 'dark' : 'light';
		return mode;
	}

	function initCards(count) { //creat cards
		const variants = config[mode].variants;
		const size = count / 2;
		const options = variants.slice(0, size);
		let items = new Array(count).fill({});
		items = items.map((item, index) => {
			console.log(index, size, index % size);
			return {
				value: options[index % size],
				id: index,
			};
		});
		const result = shuffle(items);
		return result;
	}

	return {
		init,
		start,
		stop,
		resume,
		restart,
		toggleMode
	};
}



function _createElement(tag, props) {
	const element = document.createElement(tag);
	element.className = props.className || '';
	if (props.id) {
		element.id = props.id;
	}
	return element;
}

function toogleCard(cardDiv) {
	cardDiv.classList.toggle('active');
}
