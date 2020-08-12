import S from "./flyd.js";

const isStream = (s) => typeof s === "function" && typeof s.end === "function";

const setAttribute = (element, key, value) => {
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
};

const setStyle = (element, key, value) => {
  if (value == null) {
    element.style.removeProperty(key, value);
  } else {
    element.style.setProperty(key, String(value));
  }
};

const end = (listener) => () => listener.end(true);

export const createElement = (blueprint) => {
  if (isStream(blueprint)) {
    const textNode = document.createTextNode("");
    textNode.onremove = end(
      S.on((value) => {
        textNode.nodeValue = value;
      }, blueprint)
    );
    return textNode;
  } else if (typeof blueprint === "string") {
    return document.createTextNode(blueprint);
  } else {
    const [tag, attributes, ...children] = blueprint;
    const element = document.createElement(tag);
    const listeners = [];
    for (let [key, value] of Object.entries(attributes)) {
      if (key === "style") {
        for (let [styleKey, styleValue] of Object.entries(value)) {
          if (isStream(styleValue)) {
            listeners.push(
              S.on((v) => {
                setStyle(element, styleKey, v);
              }, styleValue)
            );
          } else {
            setStyle(element, styleKey, styleValue);
          }
        }
      } else if (key === "push" && isStream(value)) {
        listeners.push(
          S.on((args) => {
            element.appendChild(createElement(args));
          }, value)
        );
      } else if (key === "pop" && isStream(value)) {
        listeners.push(
          S.on(() => {
            element.removeChild(element.lastChild);
          }, value)
        );
      } else if (!key.startsWith("on") && isStream(value)) {
        listeners.push(
          S.on((v) => {
            setAttribute(element, key, v);
          }, value)
        );
      } else {
        setAttribute(element, key, value);
      }
    }
    if (typeof children !== "undefined") {
      if (children instanceof Array) {
        for (let child of children) {
          element.appendChild(createElement(child));
        }
      } else {
        element.appendChild(createElement(children));
      }
    }
    element.onremove = () => {
      for (let listener of listeners) {
        listener.end(true);
      }
    };
    return element;
  }
};

export const serialize = (blueprint) => {
  if (isStream(blueprint)) {
    return serialize(blueprint());
  } else if (blueprint instanceof Array) {
    const [tag, attributes, ...children] = blueprint;
    const a = {};
    for (let [key, value] of Object.entries(attributes)) {
      if (!key.startsWith("on") && isStream(value)) {
        a[key] = String(value());
      } else {
        a[key] = String(value);
      }
    }
    const serializedAttributes = Object.entries(a)
      .map((entry) => entry.join("="))
      .join(" ");
    return `<${tag} ${serializedAttributes}>${children.map(
      serialize
    )}</${tag}>`;
  } else {
    return String(blueprint);
  }
};

const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    for (let node of mutation.removedNodes) {
      if (typeof node.onremove === "function") {
        node.onremove();
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
