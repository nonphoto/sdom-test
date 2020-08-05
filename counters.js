import S from "./lib/s.js";
import { render, h } from "./lib/sdom.js";

const t = S.data(0),
  loop = (_t) => (t(_t), requestAnimationFrame(loop));

const background = S(() => `rgb(${(t() * 0.01) % 255}, 100, 100)`);

const main = h(
  "ul",
  { style: { background } },
  h("li", { "data-hidden": S(() => (t() * 0.001) % 2 === 0) }, "hello"),
  h("li", {}, "world")
);

document.body.appendChild(render(main));
loop();
