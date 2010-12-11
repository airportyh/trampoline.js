// demonstrates how to create and start a new thread
function spawn(generator) {
	return new Thread(generator).start();
}

// the classic sleep method implementation
function sleep(millis) {
	setTimeout((yield CONTINUATION), millis);
	yield SUSPEND;
}

// a simple counting function that demonstrates how to sleep
function count(elem, max) {
	elem.innerHTML += "started ";
	yield sleep(500);
	for (var i = 1; i <= max; i++) {
		elem.innerHTML += i + " ";
		yield sleep(500);
	}
	elem.innerHTML += " done.";
}

// global vars for thread management
var activeThreads = [];
var waitingThreads = [];
var threadCount = 0;

// a rudimentary thread manager for our application
spawn( function() {
	// wait for the page to load
	while (document.body == null) {
		yield sleep(100);
	}

	// a div to show our status
	var div = document.createElement("div");
	document.body.appendChild(div);

	// this thread runs for the lifetime of the page
	while (true) {
		// wait for all running threads to end
		while (activeThreads.length) {
			// show that we're active
			div.innerHTML = "thread manager: active";			
			yield activeThreads.shift().join();
		}

		// show that we're idle
		div.innerHTML = "thread manager: idle";

		// launch a thread if one is waiting
		if (waitingThreads.length) {
			var thread = waitingThreads.shift();
			activeThreads.push(thread);
			thread.start();
		}

		// wait for new threads if necessary
		while (!activeThreads.length && !waitingThreads.length) {
			yield sleep(100);
		}
	}
});

// creates a new thread for counting, unstarted
function createCounter() {
	threadCount++;
	var div = document.createElement("div");
	div.innerHTML = "click " + threadCount + ": ";
	document.body.appendChild(div);

	return new Thread(
		count(div, 10)
	);
}

// starts a counting thread the moment it is called
function startImmediate() {
	var thread = createCounter();
	activeThreads.push(thread);
	thread.start();
}
	
// starts a new counting thread after all current threads are complete
function startOnIdle() {
	waitingThreads.push(createCounter());
}