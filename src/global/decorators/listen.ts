const convertToIterable = (
	target: HTMLElement | HTMLElement[] | NodeList
): HTMLElement[] => {
	switch (target.constructor.name) {
		case 'NodeList':
			return Array.from(target as NodeList) as HTMLElement[];
		case 'Array':
			return target as HTMLElement[];
		default:
			return [target] as HTMLElement[];
	}
};

const listen = (event: string, targetName: string) => (klass, handlerName) => {
	const ogConnectedCallback = klass.connectedCallback;

	klass.connectedCallback = function () {
		// run the original connected callback
		ogConnectedCallback.call(this);
		
		// this[targetName] is the actual variable for our class.
		// We don't know if it'll be a single element or iterable (like a nodelist) when
		// we decorator is called, so this converts all the options to an iterable.
		const targetArray = convertToIterable(this[targetName]);
		// create the actual handler that we're going to run. This whole dance is
		// to make sure that our `this` objects are the same, even without an arrow
		// function.
		const handler = (event: Event) => this[handlerName].call(this, event);

		// add the event listener(s) at end of connected callback
		targetArray.forEach(target => target.addEventListener(event, handler));
	};
};

export default listen;