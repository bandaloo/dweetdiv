# dweetdiv

You can see a
[live example here](https://www.bandaloo.fun/dweetdiv/example.html).

This is a simple script that will make it easy to add a dweet to your
webpage. A dweet is a thing that people make on
[dwitter](https://www.dwitter.net/). It is basically just a draw loop for a
canvas, but you're encouraged to make the code tweet-sized. If you are making
a blog post about dwitter or just want to host your dweets on your own
personal site, this will make things easy, since it handles timing and will
pause dweets when they are out of frame of the window.

Include the `dweetdiv.js` or `dweetdiv.min.js` in a script tag, and call
`addDweet` with the id of the div you want to add the dweet to. The width for
the canvas is set to 100% so it will horizontally fill the div you are adding
to.

```html
<div id="id-of-div" style="width: 960px;"></div>
<script src="dweetdiv.min.js"></script>
<script>
  addDweet("id-of-div", `// code for dweet`);
</script>
```

As a third parameter, you can pass in an options object. Here's an example.

```javascript
addDweet("id-of-div", `// code for dweet` {fps: Infinity, showCode: true});
```

You can lock the FPS at something other than 60, or pass in `Infinity` to
unlock your frame rate. This can look very beautiful if you have a high
refresh rate monitor, but not all dweets on dwitter were made with this in
mind. (My hunch is that most work just fine, though!) Setting `showCode` to
`true` will place a div underneath the canvas that contains the code that
defines the draw loop. The options object can also contain credits object
which will display above the canvas. See `example.html` for a full example.

There are also very picky timing options. By default, no draw calls will be
skipped because that could potentially change the look of the dweet,
especially if you are not clearing the canvas. If you want to skip draw calls
to run at a constant time, add `drawIntermediate: Infinity` to the options
object.

I'm not a dwitter expert so some things might be slightly inaccurate. The
time is sliced _ever so slightly_ differently in 60 FPS. This will only
really matter if you are converting `t` to a string or passing in `t` to
`fillText` or something. If you find a problem and think you can address it,
open a PR :)
