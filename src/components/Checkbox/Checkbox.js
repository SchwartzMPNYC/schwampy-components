import innerTemplate from "./Checkbox.template.html";

const templateId = "styled-checkbox-template";
const template = document.createElement("template");

template.innerHTML = innerTemplate;
template.id = templateId;

class StyledCheckbox extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		const { shadowRoot } = this;

		if (!document.getElementById(templateId))
			document.body.append(template);

		const checkboxTemplate = document.importNode(
			document.getElementById(templateId).content,
			true
		);

		shadowRoot.append(checkboxTemplate);
	}
}

customElements.define("styled-checkbox", StyledCheckbox);

export default StyledCheckbox;
