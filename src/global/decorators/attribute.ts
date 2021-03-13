import GetterAndSetter from '../interfaces/GetterAndSetter';

interface AttributeConfig {
	alias?: string;
	defaultVal?: any;
	isBoolean?: boolean;
	getterAndSetter?: GetterAndSetter;
}

const generateAttributeGettersAndSetters = (
	attributeName: string,
	isBoolean: boolean,
	defaultVal?: any
): GetterAndSetter => {
	const defaultGetter = function (): any {
		return this.getAttribute(attributeName) ?? defaultVal;
	};

	const defaultSetter = function (newValue: any): void {
		this.setAttribute(attributeName, newValue);
	};

	const booleanGetter = function (): any {
		return this.hasAttribute(attributeName);
	};

	const booleanSetter = function (newValue: any): void {
		newValue ? this.setAttribute(attributeName, attributeName) : this.removeAttribute(attributeName);
	};

	return isBoolean ? { get: booleanGetter, set: booleanSetter } : { get: defaultGetter, set: defaultSetter };
};

const attribute = (config?: AttributeConfig) => {
	const { alias, defaultVal, isBoolean = false, getterAndSetter } = config ?? {};

	return (klass, propertyName) => {
		const attributeName = alias || propertyName;
		const ogObservedAttributes = klass.constructor.observedAttributes ?? [];
		const ogAttributeChangedCallback = klass.attributeChangedCallback ?? ((name, oldValue, newValue) => {});

		Object.defineProperty(
			klass,
			propertyName,
			(getterAndSetter ??
				generateAttributeGettersAndSetters(attributeName, isBoolean, defaultVal)) as PropertyDescriptor
		);

		Object.defineProperty(klass.constructor, 'observedAttributes', {
			get: function () {
				return [...ogObservedAttributes, attributeName];
			},
			configurable: true,
		});

		klass.attributeChangedCallback = function (name, oldValue, newValue) {
			ogAttributeChangedCallback.call(this, name, oldValue, newValue);

			// Will have to make sure this doesn't suck for performance...
			if (name === propertyName && oldValue !== newValue) this[propertyName] = newValue;
		};
	};
};

export { attribute, generateAttributeGettersAndSetters, AttributeConfig };
