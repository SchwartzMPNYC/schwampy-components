import SchwampyDefintionConfig from '../interfaces/SchwampyDefintionConfig';

const defineSchwampyComponent = ({
	tagName,
	template,
	styles
}: SchwampyDefintionConfig) => (klass) => {
	const ogConnectedCalback =
		klass.prototype.connectedCallback || function () {};

	klass.prototype.connectedCallback = function () {
		this.attachShadow({ mode: "open" });

		if (!klass.template) {
			klass.template = document.createElement("template");
			klass.template.innerHTML = `<link rel="stylesheet" href="${styles}">${template}`;
			document.body.append(klass.template);
		}

		this.shadowRoot.append(
			document.importNode(klass.template.content, true)
		);

		ogConnectedCalback.call(this);
	};

	customElements.define(tagName, klass);
};

export default defineSchwampyComponent;
