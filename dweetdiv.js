"use strict";

/**
 * @typedef {Object} Credits
 * @property {string} title
 * @property {string} author
 * @property {string} link
 */

/**
 * @typedef {Object} Options
 * @property {number} [fps] has to be number => 0 (including Infinity)
 * @property {number} [intermediateDraws]
 * @property {boolean} [showCode]
 * @property {Credits} [credits]
 */

/**
 * plop a dweet into a div
 * @param {string} id the id of the div for the canvas
 * @param {string} code the dweet code that defines the draw cycle
 * @param {Options} options configuration
 */
function addDweet(id, code, options) {
  /** cap for how many updates to do in one animation frame */
  const fps = options?.fps === undefined ? 60 : options.fps;
  // if fps is 120, you probably want 2 intermediate draws by default; if 60 you
  // probably just want 1
  const maxSteps =
    options?.intermediateDraws === undefined
      ? Math.max(1, Math.ceil(fps / 60))
      : options?.intermediateDraws;

  // error checking for type and range errors
  const numErr = (str, num) => {
    if (typeof fps !== "number" || isNaN(fps)) {
      throw new TypeError(str + "has to be a number that is also not NaN");
    }
  };

  numErr("fps", fps);
  numErr("intermediateDraws", maxSteps);

  if (fps < 0) {
    throw new RangeError("fps has to be greater or equal to 0");
  }

  if (maxSteps <= 0 || maxSteps !== Math.floor(maxSteps)) {
    throw new RangeError(
      "drawIntermediate has to be integer greater than 0 or Infinity"
    );
  }

  if (typeof code !== "string") {
    throw new TypeError("type of code has to be a string");
  }

  // will also be false with unlocked framerate because `maxSteps` will be
  // Infinite due to the FPS being infinite
  const drawIntermediate = maxSteps !== Infinity;

  let totalSteps = 0;
  const unlock = fps === Infinity;

  // try to get the div for adding the display canvas
  const targetDiv = document.getElementById(id);
  if (targetDiv === null) {
    throw new Error(
      "couldn't find div to put the canvas (did you get the id wrong?)"
    );
  }

  let momentaryPause = false;

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") momentaryPause = true;
  });

  const styleDiv = () => {
    const styledDiv = document.createElement("div");
    styledDiv.style.width = "100%";
    styledDiv.style.backgroundColor = "black";
    styledDiv.style.color = "white";
    styledDiv.style.padding = "4px";
    styledDiv.style.boxSizing = "border-box";
    styledDiv.style.fontFamily = "monospace";
    styledDiv.style.wordBreak = "break-all";
    return styledDiv;
  };

  // add the credits div to the document
  if (options?.credits) {
    const creditsDiv = styleDiv();
    const title = options.credits?.title;
    const author = options.credits?.author;
    const link = options.credits?.link;
    // creating elements instead of directly creating a string of html to avoid
    // breaking the html with input that contains markup, even though it's
    // verbose
    const creditsSpan = document.createElement("span");
    creditsSpan.innerText =
      "/* " + (title ? " " + title : "") + (author ? " by " + author : "");
    creditsDiv.appendChild(creditsSpan);
    if (link) {
      creditsSpan.innerText += " ";
      const creditsLink = document.createElement("a");
      creditsLink.innerText = link;
      creditsLink.href = link;
      creditsLink.style.color = "#aaaaaa";
      creditsDiv.appendChild(creditsLink);
    }
    const closingComment = document.createElement("span");
    closingComment.innerText = " */";
    creditsDiv.appendChild(closingComment);
    targetDiv.appendChild(creditsDiv);
  }

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
  const R = (r, g, b, a = 1) => `rgba(${r | 0},${g | 0},${b | 0},${a})`;

  const c = document.createElement("canvas");
  c.width = 1920;
  c.height = 1080;
  c.style.width = "100%";

  /** the div to hide extra length when canvas has a changed width */
  const containingDiv = document.createElement("div");

  // for constant aspect ratio
  containingDiv.style.width = "100%";
  containingDiv.style.height = "0";
  containingDiv.style.paddingBottom = "56.25%"; // for 16:9 aspect ratio
  containingDiv.style.overflow = "hidden";

  containingDiv.appendChild(c);
  targetDiv.appendChild(containingDiv);

  const x = c.getContext("2d");

  let u = new Function("t", "c", "x", "R", "C", "S", "T", code);

  // create and add the code div
  if (options?.showCode) {
    const codeDiv = styleDiv();
    codeDiv.innerText = code;
    targetDiv.appendChild(codeDiv);
  }

  /** returns whether the canvas is visible */
  const visible = () => {
    const bounding = c.getBoundingClientRect();
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

  /**
   * kick off the animation requests
   * @param {number} currTime
   */
  const update = (currTime) => {
    if (momentaryPause) {
      momentaryPause = false;
      wastedTime += currTime - prevTime;
      // request a new animation frame without doing anything
      prevTime = currTime;
      requestAnimationFrame(update);
    }

    let finalTime = (currTime - wastedTime) / 1000;

    if (visible()) {
      // step animation correctly for locked framerate
      if (!unlock) {
        // has to be handled separately to avoid division by zero
        if (fps === 0) currSteps = 1;
        else if (finalTime >= totalSteps / fps) {
          const trueSteps = Math.floor(finalTime * fps - totalSteps);
          currSteps = Math.min(trueSteps, maxSteps);
          // back time up if we are not doing all of the steps
          wastedTime += ((trueSteps - currSteps) / fps) * 1000;
          totalSteps += currSteps;
        }
      }

      // run the dwitter drawing function, potentially stepping > 1 times if fps
      // is higher than your refresh rate, or not at all if fps is lower than
      // your refresh rate
      if (drawIntermediate) {
        for (let i = 0; i < currSteps; i++) {
          // draw intermediate steps to canvas even though they aren't drawn to
          // the screen
          u((totalSteps + (i - currSteps)) / fps, c, x, R, C, S, T);
        }
      } else if (currSteps) {
        u(finalTime, c, x, R, C, S, T);
      }

      if (fps === 0) return;
    } else {
      // keep track of time not on screen
      wastedTime += currTime - prevTime;
    }
    prevTime = currTime;
    requestAnimationFrame(update);
  };
  update(0);
}
