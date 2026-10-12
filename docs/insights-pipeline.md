# Insights pipeline: video to post

Every video in the Human Expansion folder becomes one Insights post:
title, the video, a summary, key points, then the full transcript.

Three stages. The first is the only one that takes real time.

## 1. Transcribe, on the Mac, once

Download the launch set from Drive to a local folder. Twelve files:

| File | Post |
|---|---|
| Episode 11 History of PM.mp4 | History of PM |
| Episode 12 - 6 Truths.mp4 | 6 Truths |
| Episode 13 - How To Pay.mp4 | How To Pay |
| Episode 14 - 4 Factors for Great Performance.mp4 | 4 Factors for Great Performance |
| Episode 15 - Why I show up.mp4 | Why I Show Up |
| Episode 16 - Foundation for Unstoppable Performance.mp4 | Foundation for Unstoppable Performance |
| Episode 17 - The Missing Link for Healthy Habits.mp4 | The Missing Link for Healthy Habits |
| Episode 18 - Autonomy.mp4 | Autonomy |
| Rahul Tara Global Mind Project.mp4 | Global Mind Project, with Sapien Labs |
| Rahul Tara MHQ Video.mp4 | MHQ, with Sapien Labs |
| Rahul Leaders Lounge Keynote Nov 2025.mp4 | Leaders Lounge keynote |
| Wellbeing=Performance.mp4 | Wellbeing = Performance |

Horizontal cuts only. Skip the `Vertical` files, same audio.

Then:

```bash
brew install ffmpeg
pip install mlx-whisper
scripts/transcribe.sh ~/Downloads/samuh-videos content/insights/transcripts
```

Roughly one minute per ten minutes of video on an M-series Mac. The 4.4GB
keynote is the long one. Start it before bed. The script skips anything
already done, so it can be re-run.

Output lands in `content/insights/transcripts/` as `.txt`, `.srt` and
`.json`. Commit the `.txt` and `.srt`. The `.srt` is what the scope means by
"transcript where there is video", and it doubles as captions.

**YouTube captions, checked 12 Oct 2026.** The channel is
youtube.com/@HumanExpansion-ACorePurpose and auto-captions exist for all
eighteen episodes. `yt-dlp --write-auto-sub --skip-download URL` pulls them
in seconds, but they have no punctuation or sentence breaks, so they are not
publishable as transcripts. Use them to read and summarise; run Whisper for
the published `.txt` and `.srt`. Audio only is enough:
`yt-dlp -f "ba[ext=m4a]" -o "episode-NN.%(ext)s" URL`.

## 2. Host the video

Scope rules out self-hosting. Each post embeds from YouTube. The eighteen
episodes are on youtube.com/@HumanExpansion-ACorePurpose and the `videoUrl`
in each post points there. The keynotes and the Sapien Labs long cuts are not
on the channel; SAMUH uploads those if they are to be posts.

## 3. Write the posts, with Claude Code

One MDX file per video in `content/insights/`. Structure, fixed:

```mdx
---
title: ""
slug: ""
date: ""            # original publish date from docs/insights-inventory.md
type: video
author: Rahul Varma
videoUrl: ""        # YouTube watch URL
episode: 0          # series number, for ordering
duration: ""        # from the transcript json
tags: []            # from: capacity, team practices, rituals, measurement
summary: ""         # one sentence, for the index card and Open Graph
transcript: transcripts/NAME.srt
---

## Summary

Three to five sentences. What Rahul argues, in his framing, no new claims.

## Key points

- Four to six bullets, each one idea from the talk

## Transcript

<Transcript src="transcripts/NAME.txt" />
```

The prompt, one post at a time:

```
Read docs/content.md and CLAUDE.md rule 1. Then read
content/insights/transcripts/[NAME].txt.

Write content/insights/[slug].mdx using the structure in
docs/insights-pipeline.md. The summary and key points come only from what
Rahul says in the transcript. Do not add statistics, names or claims that
are not in it. If he cites a figure, quote it as his. Tags from the four
hubs in docs/scope.md. videoUrl is TODO(content). No em dashes.

Show me the frontmatter and the summary before writing the file.
```

Read the summary against the transcript before you approve it. The transcript
is Rahul's words. The summary is the thing a visitor actually reads, and the
thing that gets quoted back.

## Rules

- Transcripts are published as recorded, lightly cleaned for filler words and
  false starts only. Meaning never changes
- A summary never contains a claim the transcript does not
- Episodes 1 to 10 wait for Rahul's call on which belong on a B2B site.
  Episode 10 does not
- The two Sapien Labs conversations carry "in partnership with Sapien Labs"
  in the summary and the tag `measurement`
