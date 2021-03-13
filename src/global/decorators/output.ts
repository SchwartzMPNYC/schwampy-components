const output = (eventName: string, getDetail?: (any) => any) => (klass, funcName, descriptor) => {
	const ogFunc = descriptor.value;

	descriptor.value = function (...args: any[]) {
		ogFunc.apply(this, args);

		const detail = getDetail?.(this);

		this.dispatchEvent(new CustomEvent(eventName, { detail }));
	};

	return descriptor;
};

export default output;
