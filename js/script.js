import { MemoryGame } from './game.js';

const DOM = {
	appDiv: document.getElementById('app'),
	levels: document.getElementById('levels'),
	theme: document.getElementById('theme'),
	resetBtn: document.getElementById('resetBtn'),
	startBtn: document.getElementById('startBtn'),
	pauseBtn: document.getElementById('pauseBtn'),
	historyTable: document.getElementById('historyTable'),
};


let gamesHistory = [];

let game = MemoryGame({
	target: DOM.appDiv,
	timerTarget: document.getElementById('timer'),
	movesTarget: document.getElementById('moves'),
	onGameOver: onGameOver,
});


function onGameOver({ history }) {
	const lastGame = history[history.length - 1];
	gamesHistory = history;
	updateHistory();
	Modal.open(lastGame);
}
init();

function init() {
	addListeners();
}

updateHistory();


function updateHistory() {
	DOM.historyTable.innerHTML = '';
	gamesHistory.sort((a, b) => a.mistakes - b.mistakes);
	gamesHistory.forEach(game => {
		console.log('sad', game);
		const row = `
			<tr>
				<td>${game.level}</td>
				<td>${game.time}</td>
				<td>${game.mistakes}</td>
			</tr>
		`;
		DOM.historyTable.innerHTML += row;
	});
}


function addListeners() {
	DOM.theme.addEventListener('click', () => {
		const mode = game.toggleMode();
		game.init();
		document.documentElement.classList.toggle('dark');
		if(mode == 'dark'){
			DOM.theme.innerHTML = 'Animals Cards'
		}
		if(mode == 'light'){
			DOM.theme.innerHTML = 'Developing Cards'
		}
		console.log(mode);
	});
	DOM.resetBtn.addEventListener('click', () => {
		game.restart();
	});
	DOM.startBtn.addEventListener('click', () => {
		game.start();
	});
	DOM.pauseBtn.addEventListener('click', () => {
		game.stop();
	});
}

const levels = [
	{ name: 'Easy', id: 'easy' },
	{ name: 'Medium', id: 'medium' },
	{ name: 'Ninja', id: 'ninja' },
];

function setGameLevel(levels) {
	console.log(levels);
	const level = _createElement('ul', { className: 'star' });
	level.className = ' star-rating';
	DOM.levels.append(level);
	levels.map(l => {
		const li = document.createElement('li');
		li.className = 'fa fa-star';
		li.id = l.id;
		li.innerHTML = l.name;
		li.addEventListener('click', () => {
			console.log('level:', l.name); // add level selctore
			game.init(l.id);
		});
		level.append(li);
	});
}

setGameLevel(levels);

const Modal = {
	root: document.getElementById('modal'),
	closeBtn: document.getElementById('modal-close'),
	level: document.getElementById('modal-level'),
	mistakes: document.getElementById('modal-mistakes'),
	time: document.getElementById('modal-time'),

	open: data => {
		Modal.root.style.display = 'block';
		Modal.level.innerHTML = data.level;
		Modal.mistakes.innerHTML = data.mistakes;
		Modal.time.innerHTML = data.time;
	},

	close: () => {
		Modal.root.style.display = 'none';
	},
};

Modal.closeBtn.addEventListener('click', () => Modal.close());

function _createElement(tag, props) {
	const element = document.createElement(tag);
	element.className = props.className || '';
	if (props.id) {
		element.id = props.id;
	}
	return element;
}
