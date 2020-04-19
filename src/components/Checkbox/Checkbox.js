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

	static get observedAttributes() {
		return ["checked", "name"];
	}

	attributeChangedCallback(attr, oldVal, newVal) {
		if (newVal === null) this[attr] = false;
		else if (oldVal !== newVal) this[attr] = this.getAttribute(attr);
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
		this.input = this.shadowRoot.querySelector("input");

		this.input.addEventListener("change", (event) => {
			event.target.checked
				? this.setAttribute("checked", true)
				: this.removeAttribute("checked");
		});
	}

	get checked() {
		return this.hasAttribute("checked");
	}

	set checked(value) {
		const testedValue = this.testStringsForLikelyFalsy(value);

		if (testedValue) {
			this.setAttribute("checked", testedValue);
			this.input.checked = testedValue;
		} else {
			this.removeAttribute("checked");
			this.input.removeAttribute("checked");
		}
	}

	get name() {
		return this.getAttribute("name");
	}

	set name(value) {
		const testedValue = this.testStringsForLikelyFalsy(value);

		if (testedValue) {
			this.setAttribute("name", testedValue);
			this.input.setAttribute("name", testedValue);
		} else {
			this.removeAttribute("name");
			this.input.removeAttribute("name");
		}
	}

	testStringsForLikelyFalsy(toTest) {
		return toTest && !/^(false|null|undefined|0)$/.test(toTest)
			? toTest
			: "";
	}
}

customElements.define("styled-checkbox", StyledCheckbox);

export default StyledCheckbox;
