import defineSchwampyComponent from '../../global/decorators/defineSchwampyComponent';
import listen from '../../global/decorators/listen';
import SchwampyDefintionConfig from '../../global/interfaces/SchwampyDefintionConfig';

// @ts-expect-error
import template from './Button.template.html';
// @ts-expect-error
import styles from './Button.styles.scss';

const config: SchwampyDefintionConfig = {
	tagName: 'schwampy-btn',
	template,
	styles
};

@defineSchwampyComponent(config)
export default class Button extends HTMLElement {
	private button: HTMLButtonElement;
	private counter = 0;

	private connectedCallback() {
		this.button = this.shadowRoot.querySelector('button');
	}

	@listen('click', 'button')
	private increment(event: MouseEvent): void {
		console.log(`Clicked ${++this.counter} time(s)`);
	}

	@listen('mouseout', 'button')
	@listen('focusout', 'button')
	private reset(event: MouseEvent): void {
		this.counter = 0;
	}
}
