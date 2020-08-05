import S from "./lib/s.js";
import { render, h } from "./lib/sdom.js";

const t = S.data(0),
  loop = (_t) => (t(_t), requestAnimationFrame(loop));

const background = S(() => `rgb(${(t() * 0.01) % 255}, 100, 100)`);

const counter = () => {
  const count = S.value(0);
  return h("button", { onclick: (e) => count(count() + 1) }, count);
};

const main = h(
  "ul",
  { style: { background } },
  h("li", { hidden: S(() => Math.floor(t() * 0.001) % 2 === 0) }, "hello"),
  h("li", {}, counter())
);

document.body.appendChild(render(main));
loop();
