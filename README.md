# dweetdiv

This is a simple script that will make it easy to add a dweet to your
webpage. Dweets are things that people make on <dwitter.com>. It's just a
draw loop for a canvas. If you are making a blog post about dwitter or just
want to host your dweets on your own personal site, this will make things
easy.

Include the `dweetdiv.js` or `dweetdiv.min.js` in a script tag, and call
`addDweet` with the id of the div.

```
addDweet("id-of-div", `// code for dweet`);
```

By default, the animation loop is locked to 60. You can pass in a different
FPS as an optional third parameter, or pass in `Infinity` to unlock your
frame rate. This can look very beautiful if you have a high refresh rate
monitor, but not all dweets on dwitter.com were made with this in mind. (My
hunch is that most work just fine, though!)

See `example.html` for a full example.

I'm not a dwitter expert so some things might be slightly inaccurate. One
thing I noticed is that the `R(r, g, b, a)` dwitter shorthand for rgba
strings will turn all non-numeric values into 0, which is useful for some
code golfing tricks, so I emulated this. Also, the time is sliced every so
slightly differently in 60 FPS. If you find a problem and think you can
address it, open a PR :)
