import confetti from "canvas-confetti";

const GHANA = ["#CE1126", "#FCD116", "#006B3F"];
const NAIJA = ["#008751", "#ffffff"];
const PARTY = [...GHANA, ...NAIJA];

/** Big celebration burst — used when someone takes over the #1 spot. */
export function celebrate() {
  const end = Date.now() + 1200;
  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 60,
      origin: { x: 0 },
      colors: PARTY,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 60,
      origin: { x: 1 },
      colors: PARTY,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors: PARTY });
  frame();
}

/** Quick pop — used for smaller moments like a score being added. */
export function pop(team?: "ghana" | "nigeria") {
  const colors = team === "ghana" ? GHANA : team === "nigeria" ? NAIJA : PARTY;
  confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 }, colors, scalar: 0.9 });
}
