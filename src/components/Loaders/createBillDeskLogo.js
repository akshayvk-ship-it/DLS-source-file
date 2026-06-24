/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export default function animateBillDeskPaint(svg) {
  if (!svg) return;

  const paths = svg.querySelectorAll("g[mask] path");
  const ns = "http://www.w3.org/2000/svg";

  const directions = ["down", "right", "right", "up", "left", "left", "left", "down", "right", "right", "up", "left"];

  const PATH_INTERVAL = 150;
  const DRAW_DURATION = 150;
  const LOOP_DELAY = 150;
  const FADE_DURATION = 300;
  const HOLD_DELAY = 500;

  let index = 0;
  let interval;

  function fadeAndClear() {
    const animated = svg.querySelectorAll("[clip-path]");

    // Fade out all drawn paths
    animated.forEach(el => {
      el.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        {
          duration: FADE_DURATION,
          easing: "ease-out",
          fill: "forwards"
        }
      );
    });

    // Remove after fade
    setTimeout(() => {
      svg.querySelectorAll("clipPath").forEach(c => c.remove());
      animated.forEach(el => el.remove());
    }, FADE_DURATION);
  }


function animatePath(path, direction) {
  if (!path) return;

  const color = path.getAttribute("fill") || "#F15701";

  const clone = path.cloneNode(true);
  clone.dataset.animated = "true";

  const bbox = path.getBBox();

  // Create clipPath with polygon (moving edge)
  const clip = document.createElementNS(ns, "clipPath");
  clip.dataset.temp = "true";

  const poly = document.createElementNS(ns, "polygon");

  const id = `clip-${Math.random().toString(36).slice(2)}`;
  clip.setAttribute("id", id);

  clip.appendChild(poly);
  svg.appendChild(clip);

  clone.setAttribute("clip-path", `url(#${id})`);
  clone.setAttribute("fill", color);

  svg.appendChild(clone);

  const start = performance.now();

  function frame(now) {
    let p = (now - start) / DRAW_DURATION;
    p = Math.min(Math.max(p, 0), 1);

    const x0 = bbox.x;
    const y0 = bbox.y;
    const x1 = bbox.x + bbox.width;
    const y1 = bbox.y + bbox.height;


    if (direction === "down") {
      poly.setAttribute(
        "points",
        `${x0},${y0} ${x1},${y0} ${x1},${y0 + bbox.height * p} ${x0},${y0 + bbox.height * p}`
      );
    }

    if (direction === "up") {
      poly.setAttribute(
        "points",
        `${x0},${y1 - bbox.height * p} ${x1},${y1 - bbox.height * p} ${x1},${y1} ${x0},${y1}`
      );
    }

    if (direction === "right") {
      poly.setAttribute(
        "points",
        `${x0},${y0} ${x0 + bbox.width * p},${y0} ${x0 + bbox.width * p},${y1} ${x0},${y1}`
      );
    }

    if (direction === "left") {
      poly.setAttribute(
        "points",
        `${x1 - bbox.width * p},${y0} ${x1},${y0} ${x1},${y1} ${x1 - bbox.width * p},${y1}`
      );
    }

    if (direction === "diag-br") {
      poly.setAttribute(
        "points",
        `${x0},${y1} ${x0 + bbox.width * p},${y1} ${x0 + bbox.width * p},${y1 - bbox.height * p} ${x0},${y1 - bbox.height * p}`
      );
    }

    if (direction === "diag-bl") {
      poly.setAttribute(
        "points",
        `${x1 - bbox.width * p},${y1} ${x1},${y1} ${x1},${y1 - bbox.height * p} ${x1 - bbox.width * p},${y1 - bbox.height * p}`
      );
    }

    if (p < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}


  function startLoop() {
    interval = setInterval(() => {
      const direction = directions[index % directions.length];

      animatePath(paths[index], direction);

      index += 1;

      if (index >= paths.length) {
        clearInterval(interval);

        // Wait for last path draw to finish
        setTimeout(() => {

          // Fade out all color
          fadeAndClear();

          // Restart after fade + delay
          setTimeout(() => {
            index = 0;
            startLoop();
          }, FADE_DURATION + LOOP_DELAY);

        }, HOLD_DELAY);
      }
    }, PATH_INTERVAL);
  }

  startLoop();

  // eslint-disable-next-line consistent-return
  return () => clearInterval(interval);
}

