// We don't know if the target will be a single element or iterable (like a nodelist) when
// the decorator is called, so this converts all the options to an iterable.
const convertToIterable = (target: HTMLElement | HTMLElement[] | NodeList): HTMLElement[] =>
	(target.hasOwnProperty('forEach') ? target : [target]) as HTMLElement[];

const listen = (event: string, getTarget: (any) => any) => (klass, handlerName, descriptor) => {
	const ogConnectedCallback = klass.connectedCallback ?? (() => {});
	const ogDisonnectedCallback = klass.disconnectedCallback ?? (() => {});

	// declare this up here so that we can remove in the disconnectedCallback
	let handler: (Event) => any;

	klass.connectedCallback = function () {
		ogConnectedCallback.call(this);

		// create the actual handler that we're going to run. This whole dance is
		// to make sure that our `this` objects are the same, even without an arrow
		// function.
		handler = (event: Event) => descriptor.value.call(this, event);

		convertToIterable(getTarget(this)).forEach(target => target.addEventListener(event, handler));
	};

	klass.disconnectedCallback = function () {
		ogDisonnectedCallback.call(this);

		convertToIterable(getTarget(this)).forEach(target => target.removeEventListener(event, handler));
	};
};

export default listen;
