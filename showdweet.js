function showDweet(id, code, unlock = false) {
  const div = document.getElementById(id);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = 1920;
  canvas.height = 1080;
  canvas.style.width = "100%";
  canvas.style.backgroundColor = "white";

  // this is in case you want to access this canvas by id
  canvas.id = id + "-canvas";
  div.appendChild(canvas);

  // dwitter shorthand
  const C = Math.cos;
  const S = Math.sin;
  const T = Math.tan;

  const c = document.createElement("canvas");
  c.width = 1920;
  c.height = 1080;
  const x = c.getContext("2d");

  const R = (r, g = 0, b = 0, a = 1) => `rgba(${r},${g},${b},${a})`;

  const update = (time) => {
    canvas.width = canvas.width; // clear the screen
    const t = time / 1000;
    x.save();
    eval(code);
    x.restore();
    context.save();
    context.scale(canvas.width / c.width, canvas.height / c.height);
    context.drawImage(c, 0, 0);
    context.restore();
    requestAnimationFrame(update);
  };
  update(0);
}
