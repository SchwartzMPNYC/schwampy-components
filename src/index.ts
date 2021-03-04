import "./global/styles/global.scss";

// @ts-expect-error
import btnDemo from "./components/Button/Button.demo.html";
// It feels like there's probably a better way to do this...
document.write(btnDemo);
