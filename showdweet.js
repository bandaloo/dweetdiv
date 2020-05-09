"use strict";

function showDweet(id, code, unlock = false) {
  const FPS = 60;
  let steps = 0;

  const div = document.getElementById(id);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = 1920;
  canvas.height = 1080;
  canvas.style.width = "100%";
  canvas.style.backgroundColor = "white";

  div.appendChild(canvas);

  // dwitter shorthand
  const C = Math.cos;
  const S = Math.sin;
  const T = Math.tan;

  const R = (r, g = 0, b = 0, a = 1) => `rgba(${r},${g},${b},${a})`;

  const c = document.createElement("canvas");
  c.width = 1920;
  c.height = 1080;

  const x = c.getContext("2d");

  let u = new Function("t", "c", "x", "R", "C", "S", "T", code);

  const update = (time) => {
    canvas.width = canvas.width; // clear the screen
    let t = time / 1000;
    let animate = unlock;

    if (!unlock) {
      if (t > steps / FPS) {
        // can't just increment in case you skip by more than one step
        steps = Math.floor(t * FPS) + 1;
        animate = true;
        // this makes it so that t being passed into u doesn't depend on slight
        // time differences
        t %= steps / FPS;
      }
    }

    if (animate) {
      x.save();
      u(t, c, x, R, C, S, T);
      x.restore();
    }
    context.save();
    context.scale(canvas.width / c.width, canvas.height / c.height);
    context.drawImage(c, 0, 0);
    context.restore();
    requestAnimationFrame(update);
  };
  update(0);
}
