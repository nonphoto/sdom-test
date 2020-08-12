import S from "./lib/flyd.js";
import { createElement, serialize } from "./lib/sdom.js";

const time = S.stream(0);
const loop = (t) => {
  time(t);
  requestAnimationFrame(loop);
};

const background = S.map((t) => {
  const v = (t * 0.01) % 255;
  return `rgb(${v}, ${v}, ${v})`;
}, time);

const counter = () => {
  const onclick = S.stream();
  const count = S.scan(
    (a, b) => a + b,
    0,
    S.map(() => 1, onclick)
  );
  return ["button", { onclick }, count];
};

const main = () => {
  const moreClick = S.stream();
  const lessClick = S.stream();
  return [
    "div",
    { style: { background } },
    ["button", { onclick: lessClick }, "less"],
    ["button", { onclick: moreClick }, "more"],
    ["div", { push: S.map(counter, moreClick), pop: lessClick }],
  ];
};

document.body.appendChild(createElement(main()));
loop();

console.log(serialize(main()));
