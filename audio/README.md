# Memory Color Music Files

This directory is used to store music files corresponding to different memory colors.

## Current Files and Color Mapping

- Blue (Calm): `meditation-relaxing-music.mp3`
- Green (Nature): `meditation-flute-music.mp3`
- Purple (Mystic): `meditation-deep-music.mp3`
- Yellow (Energy): `meditation-immersive-music.mp3`
- Pink (Gentle): `meditation-relaxing-music.mp3` (shared with Blue)
- Orange (Warm): `meditation-flute-music.mp3` (shared with Green)

## Audio File Requirements

- Format: MP3 format is recommended for best browser compatibility
- Size: Files should be under 20MB for reasonable loading times
- Duration: 3-10 minutes recommended, can be looped
- Quality: 128kbps or higher bitrate recommended

## How to Add or Replace Audio Files

If you want to add dedicated music for Pink and Orange, or replace any color's music, follow these steps:

1. Place new audio files in this directory
2. Modify the `playMemoryMusic` function in the `guided-meditation-session.js` and `meditation-journey.js` files to update the audio file mapping
3. Refresh the page to use the new audio files

## Audio File Source Suggestions

You can obtain suitable audio files from:

- Royalty-free music websites (such as Pixabay, Bensound, etc.)
- Self-created music
- Commercially licensed music

Please ensure you have the rights to use these audio files. 