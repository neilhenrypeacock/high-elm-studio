# Hero film

Drop a file here named `hero.mp4` and the homepage uses it instead of the
Vimeo embed. Optionally add `hero.webm` alongside — it is preferred when the
browser supports it, and is usually 30–40% smaller.

No code change is needed. With no file here the hero falls back to the Vimeo
background embed, and if that fails, to the still.

## What to export

- **A pre-trimmed loop is best.** Roughly 10–20 seconds, cut so it starts and
  ends on a similar frame. Then it plays from the first frame with no seeking.
- If you drop in the full film instead, the page joins it at 26 seconds (the
  point the design calls for) and loops back to 26 rather than to the opening.
- **1920×1080, H.264 (High profile), yuv420p**, so every browser decodes it.
- **No audio track at all** — it is a silent backdrop, and dropping the audio
  saves weight and avoids autoplay problems.
- **`faststart`**, so playback can begin before the whole file arrives.
- **Aim for under about 4 MB.** This loads on every desktop visit.

A reasonable recipe, from a source file:

    ffmpeg -ss 26 -t 16 -i source.mov \
      -an -vf "scale=1920:-2" \
      -c:v libx264 -profile:v high -pix_fmt yuv420p \
      -crf 26 -preset slow -movflags +faststart \
      hero.mp4

And the optional WebM:

    ffmpeg -ss 26 -t 16 -i source.mov \
      -an -vf "scale=1920:-2" \
      -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 \
      hero.webm
