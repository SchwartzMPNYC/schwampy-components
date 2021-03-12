interface addAndRemoveListenerFuncs {
	addListener: (target: HTMLElement, event: string | string[], handler: (Event) => any) => void;
	removeListener: (target: HTMLElement, event: string | string[], handler: (Event) => any) => void;
}

const objIsIterable = obj => typeof obj !== 'string' && typeof obj[Symbol.iterator] === 'function';

// We don't know if the target will be a single element or iterable (like a nodelist) when
// the decorator is called, so this converts all the options to an iterable.
const convertToIterable = (target: HTMLElement | HTMLElement[] | NodeList): HTMLElement[] =>
	(objIsIterable(target) ? target : [target]) as HTMLElement[];

const singleEventListeners: addAndRemoveListenerFuncs = {
	addListener: (target: HTMLElement, event: string, handler: (Event) => any) =>
		target.addEventListener(event, handler),
	removeListener: (target: HTMLElement, event: string, handler: (Event) => any) =>
		target.addEventListener(event, handler),
};

const multipleEventListeners: addAndRemoveListenerFuncs = {
	addListener: (target: HTMLElement, events: string[], handler: (Event) => any) =>
		events.forEach(event => target.addEventListener(event, handler)),
	removeListener: (target: HTMLElement, events: string[], handler: (Event) => any) =>
		events.forEach(event => target.addEventListener(event, handler)),
};

const listen = (eventNames: string | string[], getTarget: (any) => any) => (klass, handlerName, descriptor) => {
	const ogConnectedCallback = klass.connectedCallback ?? (() => {});
	const ogDisonnectedCallback = klass.disconnectedCallback ?? (() => {});

	// declare this up here so that we can remove in the disconnectedCallback
	let handler: (Event) => any;

	const { addListener, removeListener }: addAndRemoveListenerFuncs = objIsIterable(eventNames)
		? multipleEventListeners
		: singleEventListeners;

	klass.connectedCallback = function () {
		ogConnectedCallback.call(this);

		// create the actual handler that we're going to run. This whole dance is
		// to make sure that our `this` objects are the same, even without an arrow
		// function.
		handler = (event: Event) => descriptor.value.call(this, event);

		convertToIterable(getTarget(this)).forEach(target => addListener(target, eventNames, handler));
	};

	klass.disconnectedCallback = function () {
		ogDisonnectedCallback.call(this);

		convertToIterable(getTarget(this)).forEach(target => removeListener(target, eventNames, handler));
	};
};

export default listen;
