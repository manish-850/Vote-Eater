# Vote Eater

**A satirical, politician-eating snake game.**  
Eat the images (food) to grow, avoid walls and yourself. Designed as a lightweight HTML/CSS/JS project for learning and sharing.

---

## Demo
Open `index.html` in your browser or serve the project folder with a static server.

### Quick serve (recommended)
If you have `npm` installed:
```bash
npx serve .
```
or
```bash
npx http-server .
```
Then open http://localhost:5000 (or the URL shown by the server).

---

## Controls
- Arrow keys: Move the snake (Up, Down, Left, Right)

---

## Project structure (expected)
```
/ (project root)
├─ index.html
├─ style.css
├─ app.js
├─ README.md
└─ img/
   ├─ rahul2.jpg
   ├─ mamta.png
   ├─ arvind.jpeg
   ├─ lallu.webp
   └─ tejpratap.jpg
```

If you named files differently, update the `foodImg` array in `app.js`.

---

## How it works (brief)
- The board is a grid computed from container size and `side` (cell size).
- Snake is stored as an array of `{x, y}` coordinates where `x` = row, `y` = column.
- Each tick (`setInterval`) calls:
  1. `moveSnake()` — compute new head and update `snake` array
  2. `drawSnake()` — apply `.snake` class to the cells that match coordinates
  3. `playGame()` — generate food, check eating, grow tail

---

## Known issues & suggestions (you must fix these)
- **Food overlap:** Use a loop to ensure food doesn't spawn on the snake. Replace single-check logic with a `while` loop and `snake.some(...)`.
- **Performance:** Avoid nested loops over all cells for each snake part (`O(n²)`). Use `document.querySelector('[data-row="..."][data-col="..."]')` to find cells directly.
- **Growth bug:** When eating, push a copy of the **tail** (`snake[snake.length-1]`) — not the head — to grow correctly.
- **Collision / game over:** Add boundary and self-collision checks. If head goes out of bounds or overlaps a body part, end the game.
- **Image assignment:** When setting a food image, set `cell.style.backgroundImage` directly instead of `document.querySelector('.food')` to avoid selecting the wrong element.
- **Resize handling:** Recreate grid on resize and redraw snake; ensure coordinates remain valid for new cols/rows.

---

## Feature ideas / TODO
- Add score display and high score persistence (`localStorage`).
- Add pause / resume and start/restart buttons.
- Add sound effects for eating and game over.
- Add levels with different speeds.
- Mobile touch controls (swipe detection) or on-screen arrows.
- Add a settings panel to toggle political images (or use generic icons for neutral mode).

---

## License
This project is released under the MIT license. See `LICENSE` for details (create one if you need it).

---

## Contribution
If you improve this project:
1. Fork the repo.
2. Create a branch `fix/<short-description>`.
3. Open a PR with a clear description of the change and any screenshots or demos.

---

## Contact / Credits
Created by Manish (developer). Use the `img/` folder for any custom food images. Remove or replace images if they are copyrighted or sensitive.
