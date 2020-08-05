export default (rect, target) => {
  var sw = target[2] / rect[2];
  var sh = target[3] / rect[3];
  var scale = (sw + sh) / 2;

  return [
    target[0] + (target[2] - rect[2] * scale) / 2,
    target[1] + (target[3] - rect[3] * scale) / 2,
    rect[2] * scale,
    rect[3] * scale,
  ];
};
