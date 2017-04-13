let log   = require('./logger'),
	utils = require('./utils');

const deferredState = {
	pending : 'pending',
	resolved: 'resolved',
	rejected: 'rejected'
};

const handlerTypes = {
	fail: 0,
	done: 1,
	then: 2
}

const helper = {
	executeHandlers: (handlers, state, args) => {

		if (state === deferredState.pending) { return; }

		let params;

		try {
			utils.foreach(handlers, (handler) => {

				if (state === deferredState.resolved) {
					switch (handler.type) {

						case handlerTypes.done:
							handler.cb.execute(args);
							break;

						case handlerTypes.then:
							params = handler.cb.execute(args);
							handler.child.resolve.call(null, params);
							break;
					}
				}
				else if (state === deferredState.rejected) {

					switch (handler.type) {

						case handlerTypes.fail:
							handler.cb.execute(args);
							break;

						case handlerTypes.then:
							handler.child.reject.apply(null, args);
							break;
					}
				}
			});
		}
		catch (ex) { log.error(ex, args); }
	},

	addHandler: function (target, type, args, chainedDeferred) {

		if (typeof args[0] !== 'function') { return; }

		var callback = new Callback(args[0], typeof args[1] === 'object' ? args[1] : null);

		target.push(new Handler(type, callback, chainedDeferred));
	}
};

class Handler {

	constructor (type, callback, child) {
		this.type  = type;
		this.cb    = callback;
		this.child = child;
	}
}

class Callback {

	constructor (func, ctx) {
		this.func = func;
		this.ctx  = typeof ctx === 'object' ? ctx : null;
	}

	execute (args) {
		return this.func.apply(this.ctx, args);
	}
}

function Deferred () {

	let state, promise, handlers, resolve, reject, args;

	state    = deferredState.pending;
	handlers = [];
	promise  = {
		state: () => { return state; },

		done: function () {
			helper.addHandler(handlers, handlerTypes.done, arguments);

			if (state === deferredState.resolved) { resolve(); }

			return promise;
		},

		fail: function () {
			helper.addHandler(handlers, handlerTypes.fail, arguments);

			if (state === deferredState.rejected) { reject(); }

			return promise;
		},

		then: function () {
			let child = new Deferred();

			helper.addHandler(handlers, handlerTypes.then, arguments);

			return child.promise;
		},

		always: function () {
			promise.done.apply(null, arguments).fail.apply(null, arguments);
			return promise;
		}
	};

	resolve = function () {
		state = deferredState.resolved;
		args  = arguments.length ? arguments : args;

		let handlersCopy = handlers.splice(0, handlers.length);

		helper.executeHandlers(handlersCopy, state, args);

		return promise;
	};

	reject = function () {
		state = deferredState.rejected;
		args  = arguments.length ? arguments : args;

		let handlersCopy = handlers.splice(0, handlers.length);

		helper.executeHandlers(handlersCopy, state, args);
		
		return promise;
	};

	this.promise = promise;
	this.resolve = resolve;
	this.reject  = reject;
};

module.exports = Deferred;