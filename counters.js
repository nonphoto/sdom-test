import S from "./lib/s.js";
import { render, h, isStream } from "./lib/sdom.js";
import range from "./lib/range.js";

const t = S.data(0),
  loop = (_t) => (t(_t), requestAnimationFrame(loop));

const background = S(() => `rgb(${(t() * 0.01) % 255}, 100, 100)`);

const counter = () => {
  const count = S.data(0);
  return h("button", { onclick: (e) => count(count() + 1) }, [count]);
};

const counters = S.data({ type: "none", value: null });

const main = h("div", { style: { background } }, [
  h("button", { onclick: () => counters({ type: "pop" }) }, ["less"]),
  h("button", { onclick: () => counters({ type: "push", value: counter() }) }, [
    "more",
  ]),
  h("div", {}, counters),
]);

document.body.appendChild(render(main));
loop();
