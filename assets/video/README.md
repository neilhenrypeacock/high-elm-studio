# Hero film

`hero.mp4` (1920×816) plays on desktop and `hero-720.mp4` (1280×544) on
phones and small tablets. Both are a 60-second silent loop cut from
`a_portrait_of_spain_v11.mp4`, from the 26-second mark (the point the design
calls for) to just before the end card at 88 seconds. If either file is
missing the hero falls back to the Vimeo background embed, and if that fails,
to the still.

## What to export

- **Pre-trimmed loops only.** The page plays each file from frame one and
  loops it as is; it does not seek. Keep the end card out of the cut.
- **1920 wide, H.264 (High profile), yuv420p**, so every browser decodes it.
- **No audio track at all** — it is a silent backdrop, and dropping the audio
  saves weight and avoids autoplay problems.
- **`faststart`**, so playback can begin before the whole file arrives.
- **Keep the weight down.** These load on every visit; `faststart` lets
  playback begin long before the whole file has arrived, but the phone cut in
  particular should stay as lean as the picture allows.

A reasonable recipe, from a source file:

    ffmpeg -ss 26 -t 60 -i source.mov \
      -an -vf "crop=1920:816:0:131" \
      -c:v libx264 -profile:v high -pix_fmt yuv420p \
      -crf 30 -preset slow -movflags +faststart \
      hero.mp4

And the phone cut:

    ffmpeg -ss 26 -t 60 -i source.mov \
      -an -vf "crop=1920:816:0:131,scale=1280:-2" \
      -c:v libx264 -profile:v high -pix_fmt yuv420p \
      -crf 29 -preset slow -movflags +faststart \
      hero-720.mp4

The source is a widescreen picture letterboxed inside a 16:9 frame, so both
cuts crop the 130px black bars off top and bottom (`cropdetect` finds the
numbers). The still that shows before the film, `hero-poster.jpg`, is the
first frame of `hero.mp4`:

    ffmpeg -i hero.mp4 -frames:v 1 -q:v 3 hero-poster.jpg

## Checking it on a phone

Open the homepage with `?herodebug` on the address
(`https://highelmstudio.com/?herodebug`) and a small readout appears in the
bottom-left corner listing which file was chosen, whether reduced motion is
on, and every media event as it happens (`loadedmetadata`, `canplay`,
`playing`, `play refused`, `source error` and so on). It is only built when
that query is present, so it costs nothing on a normal visit. The code lives
in `assets/js/home.js` under `heroDebug`.
