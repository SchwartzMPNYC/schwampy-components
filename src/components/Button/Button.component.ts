import { defineSchwampyComponent, SchwampyDefintionConfig } from '../../global/decorators/defineSchwampyComponent';
import listen from '../../global/decorators/listen';
import { attribute, generateAttributeGettersAndSetters, AttributeConfig } from '../../global/decorators/attribute';
import GetterAndSetter from '../../global/interfaces/GetterAndSetter';

import template from './Button.template.html';
import styles from './Button.styles.scss';

const config: SchwampyDefintionConfig = {
	tagName: 'schwampy-btn',
	template,
	styles,
};

const counterGetterAndSetter: GetterAndSetter = {
	get: generateAttributeGettersAndSetters('counter', false, 0).get,
	set: function (newValue) {
		this.setAttribute('counter', newValue);
		this.loud = this.counter == 5;
	},
};

@defineSchwampyComponent(config)
export default class Button extends HTMLElement {
	private button: HTMLButtonElement;

	@attribute({ defaultVal: 0, getterAndSetter: counterGetterAndSetter })
	public counter: number;

	@attribute({ isBoolean: true, defaultVal: false })
	public loud: boolean;

	private connectedCallback() {
		this.button = this.shadowRoot.querySelector('button');
	}

	@listen('click', (inst: Button) => inst.button)
	private increment(): void {
		this.counter++;
	}

	@listen('mouseout', (inst: Button) => inst.button)
	@listen('focusout', (inst: Button) => inst.button)
	private reset(): void {
		this.counter = 0;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		console.log(name, oldValue, newValue);
	}
}
