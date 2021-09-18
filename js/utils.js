export function creatTimer({ targetEl }) {
	// private
	let intervalId = null;
	let timer = 0;

	function _update(t) {
		timer = t; // timer state
		targetEl.innerHTML = t;
	}
	// public
	function start() {
		intervalId = setInterval(() => {
			_update(timer + 1);
		}, 1000);
	}
	function stop() {
		clearInterval(intervalId);
	}
	function reset() {
		stop();
		_update(0);
	}
	function restart() {
		reset();
		start();
	}

	function getTime() {
		return timer;
	}
	return {
		start,
		stop,
		reset,
		restart,
		getTime,
	};
}

export function Counter(target) {
	let movesCouner = 0;

	function add() {
		movesCouner++;
		target.innerHTML = movesCouner;
	}

	function reset() {
		movesCouner = 0;
		target.innerHTML = movesCouner;
	}

	return {
		add,
		reset,
	};
}

export function shuffle(array) {
	const result = [...array];
	return result.sort(() => {
		return Math.random() - 0.5;
	});
}
