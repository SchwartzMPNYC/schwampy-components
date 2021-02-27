// @ts-expect-error
import innerTemplate from "./Button.template.html";

class Button extends HTMLElement {
	private static template: HTMLTemplateElement;
	private button: HTMLButtonElement;
	private counter = 0;

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	private connectedCallback() {
		if (!Button.template) {
			Button.template = document.createElement('template');
			Button.template.innerHTML = innerTemplate;
			document.body.append(Button.template);
		}

		this.shadowRoot.append(
			document.importNode(Button.template.content, true)
		);

		this.button = this.shadowRoot.querySelector('button');
		this.button.addEventListener('click', this.clicked);
	}

	public clicked = (): void => {
		console.log(`Clicked ${++this.counter} time(s)`);
	}
}

customElements.define("schwampy-btn", Button);

export default Button;
