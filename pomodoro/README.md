# Pomodoro (web prototype)

Static, dependency-free PWA. Open `index.html` or serve the folder:

    python3 -m http.server 8000   # then visit http://<your-computer-ip>:8000 on your phone

"Add to Home Screen" for a full-screen, offline app. Bump `CACHE` in `sw.js` after changes.

Defaults: 25 / 5 / 15 min, long break every 4 focus sessions, sounds Bell / Chime / Gong.
Sounds are synthesized with Web Audio (see `RECIPES` in `index.html`) — no audio files.

Known web limits (reasons to go native): audio can't fire reliably when the phone is locked or the tab
is backgrounded, and iOS mutes Web Audio with the silent switch. The timer itself uses wall-clock time,
so it stays correct and catches up when you return.
