"use strict";

function showDweet(id, code, fps = 60) {
  if (typeof code !== "string") {
    throw new TypeError("type of code has to be a string");
  }

  let steps = 0;
  const unlock = fps === Infinity;

  if (!unlock) {
    if (typeof fps !== "number" || isNaN(fps)) {
      throw new TypeError("fps has to be a number that is also not NaN");
    }
    if (fps < 0) {
      throw new RangeError("fps has to be greater than 0");
    }
  }

  const div = document.getElementById(id);
  if (div === null) {
    throw new Error(
      "couldn't find div to put the canvas (did you get the id wrong?)"
    );
  }

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

  const R = (r, g = 0, b = 0, a = 1) => {
    const f = (n) =>
      typeof n === "number" && !isNaN(n) && Math.abs(n) !== Math.abs(Infinity)
        ? n
        : 0;
    return `rgba(${f(r)},${f(g)},${f(b)},${f(a)})`;
  };

  const c = document.createElement("canvas");
  c.width = 1920;
  c.height = 1080;

  const x = c.getContext("2d");

  let u = new Function("t", "c", "x", "R", "C", "S", "T", code);

  const visible = () => {
    const bounding = canvas.getBoundingClientRect();
    return (
      bounding.left < window.innerWidth &&
      bounding.right > 0 &&
      bounding.top < window.innerHeight &&
      bounding.bottom > 0
    );
  };

  let wastedTime = 0;
  let prevTime = 0;

  const update = (currTime) => {
    canvas.width = canvas.width;
    let t = (currTime - wastedTime) / 1000;
    let animate = unlock;

    if (!unlock) {
      if (t >= steps / fps) {
        steps++;
        animate = true;
        t = steps / fps;
      }
    }

    if (visible()) {
      if (animate) {
        u(t, c, x, R, C, S, T);
      }
      context.save();
      context.scale(canvas.width / c.width, canvas.height / c.height);
      context.drawImage(c, 0, 0);
      context.restore();
    } else {
      wastedTime += currTime - prevTime;
    }
    prevTime = currTime;
    requestAnimationFrame(update);
  };
  update(0);
}
