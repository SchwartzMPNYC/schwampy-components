import defineSchwampyComponent from "../../global/decorators/defineSchwampyComponent";
import SchwampyDefintionConfig from "../../global/interfaces/SchwampyDefintionConfig";

// @ts-expect-error
import template from "./Button.template.html";

const config: SchwampyDefintionConfig = {
	tagName: "schwampy-btn",
	template,
};

@defineSchwampyComponent(config)
class Button extends HTMLElement {
	private button: HTMLButtonElement;
	private counter = 0;

	private connectedCallback() {
		this.button = this.shadowRoot.querySelector("button");
		this.button.addEventListener("click", this.clicked);
	}

	public clicked = (): void => {
		console.log(`Clicked ${++this.counter} time(s)`);
	};
}

export default Button;
