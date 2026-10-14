# Happy HBD • Juliana's Birthday Room

A static, mobile-friendly birthday room built with HTML, CSS and JavaScript. The record player plays the included MP3 **within the page** when tapped; it does not open Spotify or YouTube.

## Contents

- `index.html`: welcome screen and clickable room objects
- `style.css`: responsive layout, modals and avatar animation
- `script.js`: interactions and local MP3 playback
- `vercel.json`: static Vercel config
- `assets/room.png`: isometric pixel-art room background
- `assets/girl-portrait.png`: movable girl character
- `assets/hangout-photo.png`: your photo, accessible to site visitors
- `assets/everlong.mp3`: user-provided audio file

## Run locally

For the most reliable test, from the folder containing `index.html`:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000` on your computer. Click **open your gift**, then choose the record player. Music should start immediately from that tap. Some phones or browsers may still require the play button if audio playback is blocked.

## Upload to GitHub manually

1. Open `https://github.com/GabrielFlores32/happy-hbd`.
2. Extract the ZIP onto your computer.
3. In the repository, select **Add file → Upload files** (or **uploading an existing file** if the repository is empty).
4. Drag **all the contents** of this extracted folder into the upload area, including the **entire `assets` folder**. `index.html` must be in the **repository root**, not in a nested folder.
5. Check that `assets/everlong.mp3`, `assets/room.png`, `assets/hangout-photo.png`, `assets/girl-portrait.png`, `script.js`, `style.css`, and `index.html` appear with correct paths.
6. Select **Commit changes** to the `main` branch.

For a later update, upload the changed files to the same paths and commit replacements.

## Deploy to Vercel

1. On `https://vercel.com/new`, select **Import Git Repository** and connect GitHub if prompted.
2. Find and import `GabrielFlores32/happy-hbd`.
3. Set framework preset to **Other**, root directory to `./`, leave build command empty and output directory as default (`./` if requested).
4. Click **Deploy**. New commits on the production branch should update the site automatically.
5. Test on an actual mobile phone by opening the Vercel URL, tapping the record player and checking sound.

## Copyright and privacy

Uploading an MP3 to a publicly accessible GitHub repo and Vercel site makes the recording publicly retrievable. Only publish a recording you have permission to distribute and stream. The original photograph is also publicly retrievable on a public deployment. `noindex` doesn't secure private files.
