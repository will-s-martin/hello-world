# Pomodoro (web prototype)

Static, dependency-free PWA. Open `index.html` or serve the folder:

    python3 -m http.server 8000   # then visit http://<your-computer-ip>:8000 on your phone

"Add to Home Screen" for a full-screen, offline app. Updates are picked up on the next launch (the service worker refreshes its cache in the background).

Defaults: 25 / 5 / 15 min, long break every 4 focus sessions, sounds Bell / Chime / Gong.
Sounds are synthesized with Web Audio (see `RECIPES` in `index.html`) — no audio files.

Known web limits (reasons to go native): audio can't fire while the phone is locked or the tab is
backgrounded, iOS mutes Web Audio with the silent switch, and after a reload iOS needs one tap before
sound can play (the app asks for it). The timer uses wall-clock time: if a window ends while you're
away it settles silently when you return, counting the finished window, and with auto-start on it
replays the schedule so you land where the timer would have been.
