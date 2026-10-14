#!/usr/bin/env bash
# Convert GIFs to small H.264 MP4s that browsers can stream.
#
# Single clip (for new content):
#   scripts/convert-media.sh <input.gif> <output.mp4> [poster.jpg]
#
# One-off migration of the GIFs that used to live in public/images/
# (run with no arguments): converts every GIF to public/media/<slug>/,
# extracts a cover.jpg for each project hero and deletes the originals.
set -euo pipefail

cd "$(dirname "$0")/.."

# At most 960 px wide, even dimensions (required by yuv420p).
SCALE="scale='min(960,trunc(iw/2)*2)':-2"

to_mp4() {
  local in=$1 out=$2
  mkdir -p "$(dirname "$out")"
  ffmpeg -hide_banner -loglevel error -y -i "$in" \
    -vf "$SCALE" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p \
    -movflags +faststart -an "$out"
  echo "$in -> $out ($(du -h "$out" | cut -f1))"
}

to_poster() {
  local in=$1 out=$2
  mkdir -p "$(dirname "$out")"
  ffmpeg -hide_banner -loglevel error -y -i "$in" -vf "$SCALE" -frames:v 1 -q:v 3 "$out"
  echo "$in -> $out ($(du -h "$out" | cut -f1))"
}

if [[ $# -gt 0 ]]; then
  to_mp4 "$1" "$2"
  [[ -n ${3:-} ]] && to_poster "$1" "$3"
  exit 0
fi

# public/images/<dir>  ->  project slug and content folder
declare -A SLUG=([babymon]=babymon [buckey_boy]=bucketboy [rouse]=rouse)
declare -A ENTRY=([babymon]=Babymon [buckey_boy]=BucketBoy [rouse]=Rouse)
declare -A HERO=(
  [babymon]=Babymon_zoom.gif
  [buckey_boy]=Bucket_boy_floating.gif
  [rouse]=Rouse_aiming_abort_sprint.gif
)

for dir in "${!SLUG[@]}"; do
  src="public/images/$dir"
  [[ -d $src ]] || continue
  for gif in "$src"/*.gif; do
    name=$(basename "$gif" .gif)
    if [[ $(basename "$gif") == "${HERO[$dir]}" ]]; then
      to_mp4 "$gif" "public/media/${SLUG[$dir]}/cover.mp4"
      to_poster "$gif" "src/content/projects/${ENTRY[$dir]}/cover.jpg"
    else
      to_mp4 "$gif" "public/media/${SLUG[$dir]}/$name.mp4"
    fi
    rm "$gif"
  done
  rmdir --ignore-fail-on-non-empty "$src"
done
rmdir --ignore-fail-on-non-empty public/images 2>/dev/null || true
