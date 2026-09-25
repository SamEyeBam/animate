Run the app from this directory:

```sh
python3 serve.py --port 5501
```

Open http://localhost:5501/wave-machine or
http://localhost:5501/minds-eye-is-full-of-flowers.
Preset names are case-insensitive; replace spaces with hyphens (URL-encoded
spaces also work). Loading a preset from the Presets menu updates the URL,
and browser Back/Forward loads the corresponding preset.

Built-in presets work in any browser. Saved presets only work where they are
stored in localStorage, on the same browser and origin (including port).
Unknown names show a message and leave an empty scene.

Use this server for direct links and refreshes. An alternative host must serve
`index.html` for preset paths; trailing slashes should redirect to the same path
without the slash so relative assets load correctly.

For **ball of life**, enter cylinder height/radius, ball radius, and ground line
length in centimetres. Point spacing is also in centimetres (10 means one point
every 10 cm). A 1000 cm column at 10 cm spacing has 101 points including the
base and top. Ground lines continue from the base without duplicating its point.
If a length is not divisible by its spacing, the remaining end section is empty.
Ball spacing follows each longitude from pole to pole along the surface; both
poles are included, so the final gap may be shorter. Longitude lines remain a
total count. Zoom changes only the view, not the physical dimensions or counts.
