const checkboxStandard = document.createElement("styled-checkbox");
checkboxStandard.innerText = "Checkbox!?";
checkboxStandard.setAttribute('name', 'schwampy-checks');

const checkboxCheckedWithAttr = document.createElement("styled-checkbox");
checkboxCheckedWithAttr.innerText = "I'm checked by default.";
checkboxCheckedWithAttr.setAttribute("checked", true);
checkboxCheckedWithAttr.setAttribute('name', 'schwampy-checks');

document.body.append(checkboxStandard, checkboxCheckedWithAttr);
