"use strict";

/**
 * plop a dweet into a div
 * @param {string} id the id of the div for the canvas
 * @param {string} code the dweet code that defines the draw cycle
 * @param {number} fps can't be NaN or <= 0. pass in Infinity for unlocked fps
 */
function addDweet(id, code, fps = 60) {
  /** cap for how many updates to do in one animation frame */
  const MAX_STEPS = 4;

  // code for draw function has to be a string
  if (typeof code !== "string") {
    throw new TypeError("type of code has to be a string");
  }

  let totalSteps = 0;
  const unlock = fps === Infinity;

  // bad fps can result in either a type error or range error
  if (!unlock) {
    if (typeof fps !== "number" || isNaN(fps)) {
      throw new TypeError("fps has to be a number that is also not NaN");
    }
    if (fps < 0) {
      throw new RangeError("fps has to be greater than 0");
    }
  }

  // try to get the div for adding the display canvas
  const div = document.getElementById(id);
  if (div === null) {
    throw new Error(
      "couldn't find div to put the canvas (did you get the id wrong?)"
    );
  }

  // create the display canvas
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // set display canvas properties
  canvas.width = 1920;
  canvas.height = 1080;
  canvas.style.width = "100%";
  canvas.style.backgroundColor = "white";

  // add the display canvas to the document
  div.appendChild(canvas);

  // dwitter shorthand
  const C = Math.cos;
  const S = Math.sin;
  const T = Math.tan;

  /**
   * takes in values of any type and makes an rbga string, mimicking the
   * behavior of dwitter
   * @param {*} r red
   * @param {*} g green
   * @param {*} b blue
   * @param {*} a alpha
   */
  const R = (r, g = 0, b = 0, a = 1) => {
    /**
     * turns non-numbers and weird numbers into 0 like dwitter does
     * @param {number} n
     */
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

  /** returns whether the canvas is visible */
  const visible = () => {
    const bounding = canvas.getBoundingClientRect();
    return (
      bounding.left < window.innerWidth &&
      bounding.right > 0 &&
      bounding.top < window.innerHeight &&
      bounding.bottom > 0
    );
  };

  /**
   * how much the dweet's time should differ from the time returned by
   * requestAnimationFrame
   */
  let wastedTime = 0;
  /** previous time returned by requestAnimationFrame */
  let prevTime = 0;
  /** how many times to run the dwitter draw function */
  let currSteps = 1; // won't change from 1 if framerate is unlocked

  const update = (currTime) => {
    canvas.width = canvas.width;
    let t = (currTime - wastedTime) / 1000;

    if (visible()) {
      // step animation correctly for locked framerate
      if (!unlock) {
        if (t >= totalSteps / fps) {
          const trueSteps = Math.floor(t * fps - totalSteps);
          currSteps = Math.min(trueSteps, MAX_STEPS);
          // back time up if we are not doing all of the steps
          wastedTime += ((trueSteps - currSteps) / fps) * 1000;
          totalSteps += currSteps;
          t = totalSteps / fps;
        }
      }

      // run the dwitter drawing function, potentially stepping > 1 times if fps
      // is higher than your refresh rate, or not at all if fps is lower than
      // your refresh rate
      for (let i = 0; i < currSteps; i++) {
        u(t, c, x, R, C, S, T);
      }
      // copy the dwitter canvas onto the display canvas
      context.save();
      context.scale(canvas.width / c.width, canvas.height / c.height);
      context.drawImage(c, 0, 0);
      context.restore();
    } else {
      // keep track of time not on screen (important for unlocked framerate)
      wastedTime += currTime - prevTime;
    }
    prevTime = currTime;
    requestAnimationFrame(update);
  };
  update(0);
}
