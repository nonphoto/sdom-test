import S from "./lib/flyd.js";
import { createElement } from "./lib/sdom.js";

const M = {
  pop: () => ({ type: "pop" }),
  push: (component) => (...args) => ({
    type: "push",
    value: component(...args),
  }),
};

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
  const counters = S.merge(
    S.map(M.pop, lessClick),
    S.map(M.push(counter), moreClick)
  );
  return [
    "div",
    { style: { background } },
    ["button", { onclick: lessClick }, "less"],
    ["button", { onclick: moreClick }, "more"],
    ["div", { mutator: counters }],
  ];
};

document.body.appendChild(createElement(main()));
loop();
