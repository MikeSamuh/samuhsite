#!/usr/bin/env bash
# Transcribe every video in a folder with Whisper on Apple Silicon.
# One-time setup:
#   brew install ffmpeg
#   pip install mlx-whisper
# Usage:
#   scripts/transcribe.sh ~/Downloads/samuh-videos content/insights/transcripts
# Output per video: NAME.txt (plain), NAME.srt, NAME.json (word timings).
# large-v3-turbo is accurate and fast; ~1 minute per 10 minutes of audio on M-series.

set -euo pipefail
IN="${1:?input folder}"
OUT="${2:?output folder}"
MODEL="${MODEL:-mlx-community/whisper-large-v3-turbo}"
mkdir -p "$OUT"

shopt -s nullglob
for f in "$IN"/*.mp4 "$IN"/*.mov "$IN"/*.m4a; do
  base="$(basename "${f%.*}")"
  if [[ -s "$OUT/$base.txt" ]]; then echo "skip  $base"; continue; fi
  echo "start $base"
  mlx_whisper "$f" \
    --model "$MODEL" \
    --language en \
    --output-dir "$OUT" \
    --output-name "$base" \
    --output-format all
  echo "done  $base"
done
