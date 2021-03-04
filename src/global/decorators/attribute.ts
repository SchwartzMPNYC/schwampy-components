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
	defaultVal: any
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
	const { alias, defaultVal, isBoolean = false, getterAndSetter } = config;

	return (klass, propertyName) => {
		const attributeName = alias || propertyName;
		const ogObservedAttributes = klass.constructor.observedAttributes ?? [];

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
	};
};

export { attribute, generateAttributeGettersAndSetters, AttributeConfig };
