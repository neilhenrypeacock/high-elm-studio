# Hero film

`hero.mp4` (1920×1080) plays on desktop and `hero-720.mp4` (1280×720) on
phones and small tablets. Both are a 16-second silent loop cut from
`a_portrait_of_spain_v11.mp4` at the 26-second mark, which is the point the
design calls for. If either file is missing the hero falls back to the Vimeo
background embed, and if that fails, to the still.

## What to export

- **A pre-trimmed loop is best.** Roughly 10–20 seconds, cut so it starts and
  ends on a similar frame. Then it plays from the first frame with no seeking.
- If you drop in the full film instead, the page joins it at 26 seconds (the
  point the design calls for) and loops back to 26 rather than to the opening.
- **1920 wide, H.264 (High profile), yuv420p**, so every browser decodes it.
- **No audio track at all** — it is a silent backdrop, and dropping the audio
  saves weight and avoids autoplay problems.
- **`faststart`**, so playback can begin before the whole file arrives.
- **Aim for under about 4 MB.** This loads on every desktop visit.

A reasonable recipe, from a source file:

    ffmpeg -ss 26 -t 16 -i source.mov \
      -an -vf "crop=1920:816:0:131" \
      -c:v libx264 -profile:v high -pix_fmt yuv420p \
      -crf 29 -preset slow -movflags +faststart \
      hero.mp4

And the phone cut:

    ffmpeg -ss 26 -t 16 -i source.mov \
      -an -vf "crop=1920:816:0:131,scale=1280:-2" \
      -c:v libx264 -profile:v high -pix_fmt yuv420p \
      -crf 27 -preset slow -movflags +faststart \
      hero-720.mp4

The source is a widescreen picture letterboxed inside a 16:9 frame, so both
cuts crop the 130px black bars off top and bottom (`cropdetect` finds the
numbers). The still that shows before the film, `hero-poster.jpg`, is the
first frame of `hero.mp4`:

    ffmpeg -i hero.mp4 -frames:v 1 -q:v 3 hero-poster.jpg
