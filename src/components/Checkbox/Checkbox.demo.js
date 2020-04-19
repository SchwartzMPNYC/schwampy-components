// export default () => {
const checkboxStandard = document.createElement("styled-checkbox");
checkboxStandard.innerText = "Checkbox!?";

const checkboxCheckedWithAttr = document.createElement("styled-checkbox");
checkboxCheckedWithAttr.innerText = "I'm checked by default.";
checkboxCheckedWithAttr.setAttribute("checked", true);

document.body.append(checkboxStandard, checkboxCheckedWithAttr);
