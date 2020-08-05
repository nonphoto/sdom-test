import S from "https://cdn.skypack.dev/s-js";

const isStream = (s) => typeof s === "function" && s.name === "computation";

const h = (tag, attributes, ...children) => {
  return {
    tag,
    attributes,
    children,
  };
};

function setAttribute(element, key, value) {
  if (key === "style") {
    element.style.cssText = value;
  }
  if (key.slice(0, 6) === "xlink:") {
    element.setAttributeNS("http://www.w3.org/1999/xlink", key.slice(6), value);
  } else if (key in element) {
    element[key] = value;
  } else if (typeof value === "boolean") {
    if (value) {
      element.setAttribute(key, "");
    } else {
      element.removeAttribute(key);
    }
  } else {
    element.setAttribute(key === "className" ? "class" : key, value);
  }
}

function setStyle(element, key, value) {
  if (value == null) {
    element.style.removeProperty(key, value);
  } else {
    element.style.setProperty(key, String(value));
  }
}

const render = (node) => {
  if (typeof node === "string") {
    return document.createTextNode(node);
  } else {
    const element = document.createElement(node.tag);
    for (let [key, value] of Object.entries(node.attributes)) {
      if (key === "style") {
        for (let [styleKey, styleValue] of Object.entries(value)) {
          S(() => {
            setStyle(
              element,
              styleKey,
              isStream(styleValue) ? styleValue() : styleValue
            );
          });
        }
      } else {
        S(() => {
          setAttribute(element, key, isStream(value) ? value() : value);
        });
      }
    }
    if (node.children) {
      for (let child of node.children) {
        element.appendChild(render(child));
      }
    }
    return element;
  }
};

const t = S.data(0),
  loop = (_t) => (t(_t), requestAnimationFrame(loop));

const background = S(() => `rgb(${(t() * 0.01) % 255}, 100, 100)`);

const main = h(
  "ul",
  { style: { background } },
  h("li", { hidden: S(() => (t() * 0.001) % 2 === 0) }, "hello"),
  h("li", {}, "world")
);

document.body.appendChild(render(main));
loop();
