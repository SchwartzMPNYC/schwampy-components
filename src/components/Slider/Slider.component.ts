import { defineSchwampyComponent, SchwampyDefintionConfig } from '../../global/decorators/defineSchwampyComponent';
import { attribute, generateAttributeGettersAndSetters, AttributeConfig } from '../../global/decorators/attribute';
import listen from '../../global/decorators/listen';
import output from '../../global/decorators/output';
import GetterAndSetter from '../../global/interfaces/GetterAndSetter';

import template from './Slider.template.html';
import styles from './Slider.styles.scss';

/* Todo
 * styling (duh)
 */

const minGetterAndSetter: GetterAndSetter = {
	get: generateAttributeGettersAndSetters('min', false, 0).get,
	set: function (newMin: number): void {
		this.setAttribute('min', newMin);
		this.minLabel.textContent = newMin;
		this.slider.min = newMin;
		this.numberInput.min = newMin;
		this.value = this.value;
	},
};

const maxGetterAndSetter: GetterAndSetter = {
	get: generateAttributeGettersAndSetters('max', false, 100).get,
	set: function (newMax: number): void {
		this.setAttribute('max', newMax);
		this.maxLabel.textContent = newMax;
		this.slider.max = newMax;
		this.numberInput.max = newMax;
		this.value = this.value;
	},
};

const valueGetterAndSetter: GetterAndSetter = {
	get: generateAttributeGettersAndSetters('value', false).get,
	set: function (newValue: number): void {
		if (!isNaN(newValue)) {
			this.setAttribute('value', newValue);

			this.slider.value = newValue;
			this.numberInput.value = newValue;
			this.updateFillPercent();
		}
	},
};

const stepGetterAndSetter: GetterAndSetter = {
	get: generateAttributeGettersAndSetters('step', false, 1).get,
	set: function (newStep: number): void {
		this.setAttribute('step', newStep);
		this.slider.step = newStep;
		this.numberInput.step = newStep;
		this.value = this.value;
	},
};

@defineSchwampyComponent({
	tagName: 'schwampy-slider',
	template,
	styles,
})
class Slider extends HTMLElement {
	private slider: HTMLInputElement;
	private numberInput: HTMLInputElement;
	private minLabel: HTMLSpanElement;
	private maxLabel: HTMLSpanElement;

	private fillPercent: number;

	@attribute({ getterAndSetter: valueGetterAndSetter })
	public value: number;

	@attribute({ getterAndSetter: minGetterAndSetter, defaultVal: 0 })
	public min: number;

	@attribute({ getterAndSetter: maxGetterAndSetter, defaultVal: 100 })
	public max: number;

	@attribute({ getterAndSetter: stepGetterAndSetter, defaultVal: 1 })
	public step: number;

	connectedCallback() {
		this.slider = this.shadowRoot.querySelector('#slider');
		this.numberInput = this.shadowRoot.querySelector('#number-input');
		this.minLabel = this.shadowRoot.querySelector('#min');
		this.maxLabel = this.shadowRoot.querySelector('#max');

		// Make sure our setters get called based on attr values
		this.max = this.max;
		this.min = this.min;
		this.step = this.step;

		this.value = this.value ?? Math.floor((this.min + this.max) / 2);
		this.updateFillPercent();
	}

	@listen('change', (inst: Slider) => inst.slider)
	@listen('input', (inst: Slider) => [inst.slider, inst.numberInput])
	@output('change', (inst: Slider) => inst.value)
	private updateValue({ currentTarget }: InputEvent | Event): void {
		this.value = Number((currentTarget as HTMLInputElement).value);
	}

	private updateFillPercent() {
		this.style.setProperty('--fill-percent', `${(Number(this.value) / Number(this.max)) * 100}%`);
	}
}
