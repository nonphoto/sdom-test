import { createElement } from "./lib/sdom.js";

const main = () => {
  return ["div", { style: {} }, ["div", {}, "hello"], ["div", {}, "world"]];
};

document.body.appendChild(createElement(main()));
