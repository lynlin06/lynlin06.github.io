document.documentElement.classList.add("js");

const deck = document.querySelector(".deck");
const slides = [...deck.querySelectorAll(".slide")];
const counter = document.querySelector(".counter");
const bar = document.querySelector(".progress span");
const ticks = document.querySelector(".ticks");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let ready = reduce; // las animaciones de la portada esperan al telón

/* =========================================================
   Pegatinas dibujadas (SVG 100×100). Se pintan dos veces:
   un "halo" blanco grueso (borde de sticker) y la tinta.
   ========================================================= */
const ART = {
  book: '<path class="f-paper" d="M50 30C40 22 22 21 10 26V78C22 73 40 74 50 82C60 74 78 73 90 78V26C78 21 60 22 50 30Z"/><path d="M50 30V82M20 37C28 35 36 36 42 39M20 47C28 45 36 46 42 49M20 57C28 55 36 56 42 59M58 39C64 36 72 35 80 37M58 49C64 46 72 45 80 47M58 59C64 56 72 55 80 57"/>',
  pencil: '<path class="f-gold" d="M24 70 66 28 78 40 36 82Z"/><path class="f-paper" d="M24 70 16 90 36 82Z"/><path class="f-ink" d="M16 90 19.5 81 25 86.5Z"/><path class="f-rose" d="M66 28 72 22Q76 18 80 22L84 26Q88 30 84 34L78 40Z"/><path d="M30 76 72 34"/>',
  scale: '<path d="M50 16V84M30 86H70M14 30H86"/><circle class="f-gold" cx="50" cy="15" r="6"/><path d="M14 30 4 58M14 30 24 58M86 30 76 52M86 30 96 52"/><path class="f-sky" d="M2 58Q14 72 26 58Z"/><path class="f-rose" d="M74 52Q86 66 98 52Z"/>',
  bubble: '<path class="f-paper" d="M18 16H82Q90 16 90 24V58Q90 66 82 66H46L26 86 30 66H18Q10 66 10 58V24Q10 16 18 16Z"/><path class="f-ink" d="M30 32Q30 28 34 28H38Q42 28 42 32V36Q42 45 33 49L31 46Q36 43 36 38H34Q30 38 30 34ZM54 32Q54 28 58 28H62Q66 28 66 32V36Q66 45 57 49L55 46Q60 43 60 38H58Q54 38 54 34Z"/>',
  bulb: '<path class="f-sun" d="M50 16C32 16 22 30 26 46 29 57 38 61 38 70H62C62 61 71 57 74 46 78 30 68 16 50 16Z"/><path d="M40 78H60M42 86H58M43 44 50 54 57 44"/><path d="M50 1V7M17 12 22 17M83 12 78 17M5 40H11M89 40H95"/>',
  monitor: '<rect class="f-sky" x="10" y="16" width="80" height="52" rx="6"/><path d="M42 68 38 84H62L58 68M28 85H72M22 32H52M22 42H64M22 52H44"/>',
  temple: '<path class="f-paper" d="M8 34 50 10 92 34Z"/><path class="f-paper" d="M12 34H88V42H12Z"/><path class="f-paper" d="M17 42H27V80H17ZM36 42H46V80H36ZM54 42H64V80H54ZM73 42H83V80H73Z"/><path class="f-paper" d="M6 80H94V89H6Z"/><circle cx="50" cy="25" r="3"/>',
  vase: '<path d="M34 32C22 30 18 46 30 48M66 32C78 30 82 46 70 48"/><path class="f-paper" d="M40 10H60L58 14C58 22 64 24 68 32 78 50 72 72 60 88H40C28 72 22 50 32 32 36 24 42 22 42 14Z"/><path class="f-ink" d="M27 50H73L71 60H29Z"/><path d="M36 74Q50 68 64 74"/>',
  sparkle: '<path class="f-ink" d="M50 4C53 36 64 47 96 50 64 53 53 64 50 96 47 64 36 53 4 50 36 47 47 36 50 4Z"/>',
  star8: '<path class="f-ink" d="M50 6 56 36 80 18 64 44 94 50 64 56 80 82 56 64 50 94 44 64 20 82 36 56 6 50 36 44 20 18 44 36Z"/>',
  burst: '<path class="thick" d="M24 70 6 62M32 48 18 24M52 40 56 12"/>',
  squiggle: '<path d="M6 80C22 50 44 94 58 62S84 30 74 12"/><path d="M62 16 74 10 82 22"/>',
  gradcap: '<path class="f-ink" d="M6 40 50 22 94 40 50 58Z"/><path class="f-lav" d="M26 50V68C36 77 64 77 74 68V50L50 60Z"/><path d="M88 43V64"/><circle class="f-gold" cx="88" cy="69" r="5"/>',
  apple: '<path class="f-rose" d="M50 30C38 20 14 24 16 50 18 74 34 92 50 84 66 92 82 74 84 50 86 24 62 20 50 30Z"/><path d="M50 30C50 20 54 12 60 8"/><path class="f-sage" d="M54 18C62 8 76 10 80 14 72 22 62 22 54 18Z"/>',
  globe: '<circle class="f-sky" cx="50" cy="50" r="38"/><path class="f-sage" d="M30 24C40 28 44 36 38 44S24 50 22 60C16 48 18 34 30 24ZM58 40C68 36 80 44 86 54 80 66 70 76 62 80 64 66 54 62 56 52Z"/><path d="M12 50H88M50 12C36 30 36 70 50 88M50 12C64 30 64 70 50 88"/>',
  heart: '<path class="f-rose" d="M50 86C20 64 8 46 14 30 20 14 42 12 50 30 58 12 80 14 86 30 92 46 80 64 50 86Z"/><path d="M28 32C30 26 34 24 38 24"/>',
  puzzle: '<path class="f-sun" d="M12 28H38C34 18 40 10 48 10S62 18 58 28H84V52C94 48 98 56 98 62S94 76 84 72V92H12V70C22 74 28 68 28 61S22 48 12 52Z"/>',
  magnifier: '<circle class="f-sky" cx="42" cy="42" r="27"/><path class="thick" d="M62 62 88 88"/><path d="M28 36C31 29 37 25 44 25"/>',
  gear: '<path class="f-gold" d="M44 6H56L58 19 68 23 78 15 86 23 78 33 82 43 95 45V57L82 59 78 69 86 79 78 87 68 79 58 83 56 95H44L42 83 32 79 22 87 14 79 22 69 18 59 5 57V45L18 43 22 33 14 23 22 15 32 23 42 19Z"/><circle class="f-paper" cx="50" cy="51" r="14"/>',
  palette: '<path class="f-paper" d="M50 10C24 10 8 28 8 50S26 90 50 90C58 90 60 84 56 78S54 66 64 66H76C86 66 92 58 92 48 92 26 74 10 50 10Z"/><circle class="f-rose" cx="28" cy="42" r="7"/><circle class="f-sky" cx="44" cy="26" r="7"/><circle class="f-gold" cx="66" cy="28" r="7"/><circle class="f-sage" cx="28" cy="64" r="7"/>',
  candle: '<path class="f-paper" d="M34 44H66V92H34Z"/><path class="f-gold" d="M50 6C59 19 63 28 57 36 53 41 47 41 43 36 37 28 41 19 50 6Z"/><path d="M50 36V44M66 58C59 60 59 67 66 69"/>',
  dove: '<path class="f-paper" d="M12 58C26 56 36 48 44 36 50 26 62 24 70 30L88 26 77 39C80 60 64 78 40 78 30 78 18 72 12 58Z"/><path class="f-sky" d="M38 54C44 34 58 20 76 12 72 32 60 48 38 54Z"/><circle class="f-ink" cx="70" cy="35" r="2.5"/>',
  crescent: '<path class="f-gold" d="M58 10C34 14 18 34 20 56 22 78 42 94 66 90 46 84 36 66 38 48 40 30 50 16 58 10Z"/><path class="f-ink" d="M74 38 77 47 86 47 79 53 82 62 74 57 66 62 69 53 62 47 71 47Z"/>',
  hourglass: '<path class="f-paper" d="M24 8H76V18C76 36 58 42 58 50S76 64 76 82V92H24V82C24 64 42 58 42 50S24 36 24 18Z"/><path class="f-sun" d="M34 82C34 72 46 66 50 62 54 66 66 72 66 82Z"/><path d="M18 8H82M18 92H82"/>'
};

const THEMES = {
  1: ["book", "pencil", "gradcap", "apple"],
  2: ["scale", "globe", "heart", "puzzle"],
  3: ["bubble", "bulb", "magnifier", "gear"],
  4: ["bulb", "monitor", "palette", "hourglass"],
  5: ["temple", "vase", "candle", "dove"]
};

/* Tres acomodos que se van alternando para que ninguna sala se vea igual */
const LAYOUTS = [
  [
    { a: 0, s: "7.6rem", p: "left:46%;top:7%", r: -12, d: 22 },
    { a: 1, s: "8.4rem", p: "right:4%;bottom:5%", r: 10, d: 30 },
    { a: 2, s: "4rem", p: "left:30%;top:1.2%", r: -8, d: 16 },
    { a: 3, s: "4.6rem", p: "right:22%;bottom:.5%", r: 8, d: 24 },
    { a: "sparkle", s: "2.8rem", p: "left:49%;bottom:13%", d: 12 },
    { a: "star8", s: "2.2rem", p: "right:7%;top:6%", d: 34 },
    { a: "squiggle", s: "5.4rem", p: "left:41%;bottom:3%", d: 8 },
    { a: "sparkle", s: "1.8rem", p: "left:24%;top:3%", d: 10 },
    { a: "burst", s: "3.6rem", p: "right:28%;top:1%", r: 20, d: 18 }
  ],
  [
    { a: 0, s: "7.8rem", p: "right:3.5%;top:5%", r: 9, d: 26 },
    { a: 1, s: "8rem", p: "left:46%;bottom:5%", r: -9, d: 20 },
    { a: 2, s: "4rem", p: "left:33%;top:1.2%", r: 10, d: 14 },
    { a: 3, s: "4.4rem", p: "right:24%;bottom:.5%", r: -10, d: 28 },
    { a: "star8", s: "2.6rem", p: "left:48%;top:10%", d: 14 },
    { a: "sparkle", s: "2.2rem", p: "right:5%;bottom:10%", d: 30 },
    { a: "burst", s: "4.6rem", p: "right:12%;top:2%", r: 70, d: 18 },
    { a: "sparkle", s: "1.7rem", p: "left:27%;top:4%", d: 10 },
    { a: "squiggle", s: "4.4rem", p: "right:36%;top:1%", r: -80, d: 12 }
  ],
  [
    { a: 1, s: "7.6rem", p: "left:47%;top:58%", r: -6, d: 24 },
    { a: 0, s: "8rem", p: "right:3%;top:4%", r: 12, d: 30 },
    { a: 2, s: "4.4rem", p: "right:24%;bottom:.5%", r: 6, d: 22 },
    { a: 3, s: "4rem", p: "left:31%;top:1.2%", r: -8, d: 16 },
    { a: "sparkle", s: "3rem", p: "left:51%;top:8%", d: 16 },
    { a: "burst", s: "4.4rem", p: "left:44%;top:3%", r: -10, d: 10 },
    { a: "star8", s: "2rem", p: "right:6%;bottom:8%", d: 26 },
    { a: "sparkle", s: "1.8rem", p: "left:25%;top:3.5%", d: 8 },
    { a: "star8", s: "1.6rem", p: "right:33%;top:3%", d: 20 }
  ]
];

function sticker(name) {
  const m = ART[name];
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><g class="halo">${m}</g><g class="ink">${m}</g></svg>`;
}

/* Divide un título en palabras animables sin cambiar su texto */
function splitWords(el) {
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(" "); return; }
          const w = document.createElement("span");
          w.className = "w";
          const wi = document.createElement("span");
          wi.className = "wi";
          wi.style.setProperty("--w", i++);
          wi.textContent = part;
          w.append(wi);
          frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) {
        walk(n);
      }
    });
  };
  walk(el);
}

function sparkles(slide, list) {
  list.forEach(([pos, size, dl, t]) => {
    const s = document.createElement("span");
    s.className = "spark";
    s.setAttribute("aria-hidden", "true");
    s.style.cssText = `${pos};--s:${size};--dl:${dl}s;--t:${t}s`;
    slide.append(s);
  });
}

/* =========================================================
   Decoración de cada sala
   ========================================================= */
let kraftCount = 0;

slides.forEach((slide, index) => {
  // orden de aparición del texto
  slide.querySelectorAll(".copy > *").forEach((el, i) => el.style.setProperty("--i", i));
  slide.querySelectorAll(".team li, .close li, .mosaic figure").forEach((el, j) => el.style.setProperty("--j", j));

  // marco interior de cada lámina (para el zoom lento)
  slide.querySelectorAll(".plate").forEach((plate) => {
    const img = plate.querySelector("img");
    if (!img || img.parentElement.classList.contains("frame")) return;
    const frame = document.createElement("div");
    frame.className = "frame";
    img.replaceWith(frame);
    frame.append(img);
  });

  // curva blanca que se dibuja sola
  slide.querySelectorAll(".wave path").forEach((p) => p.setAttribute("pathLength", "1"));

  if (slide.classList.contains("kraft")) {
    const plate = slide.querySelector(".plate");
    if (plate) plate.style.setProperty("--tilt", `${kraftCount % 2 ? -2.2 : 1.8}deg`);

    // título con etiqueta de papel + subrayado a mano
    const h2 = slide.querySelector("h2");
    if (h2 && !h2.querySelector(".label")) {
      const label = document.createElement("span");
      label.className = "label";
      while (h2.firstChild) label.append(h2.firstChild);
      h2.append(label);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      line.setAttribute("class", "scribble");
      line.setAttribute("viewBox", "0 0 300 24");
      line.setAttribute("preserveAspectRatio", "none");
      line.setAttribute("aria-hidden", "true");
      line.innerHTML = '<path pathLength="1" d="M4 14C60 6 120 18 180 10S270 8 296 14M40 20C110 15 190 22 250 17"/>';
      h2.after(line);
      line.style.setProperty("--i", h2.style.getPropertyValue("--i"));
    }

    // número gigante de sala
    const num = document.createElement("span");
    num.className = "sala-num";
    num.dataset.depth = "140";
    num.setAttribute("aria-hidden", "true");
    num.textContent = String(index).padStart(2, "0");
    slide.append(num);

    // pegatinas según el bloque temático
    const eyebrow = slide.querySelector(".eyebrow");
    const block = Number((eyebrow?.textContent.match(/Bloque\s*0?(\d)/) || [])[1]) || 1;
    const theme = THEMES[block] || THEMES[1];
    const layout = LAYOUTS[kraftCount % LAYOUTS.length];
    layout.forEach((item, k) => {
      const name = typeof item.a === "number" ? theme[item.a] : item.a;
      const el = document.createElement("div");
      el.className = "doodle";
      el.setAttribute("aria-hidden", "true");
      el.style.cssText = `${item.p};--s:${item.s};--r:${item.r || 0}deg;--d:${item.d};--delay:${(0.5 + k * 0.1).toFixed(2)}s;--f:${(4.5 + (k % 3)).toFixed(1)}s`;
      el.innerHTML = sticker(name);
      slide.append(el);
    });

    kraftCount++;
  }
});

function addDoodles(slide, list) {
  list.forEach(([name, size, pos, r, d], k) => {
    const el = document.createElement("div");
    el.className = "doodle";
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = `${pos};--s:${size};--r:${r}deg;--d:${d};--delay:${(0.9 + k * 0.12).toFixed(2)}s;--f:${(4.5 + (k % 3)).toFixed(1)}s`;
    el.innerHTML = sticker(name);
    slide.append(el);
  });
}

/* ---------- Portada ---------- */
const cover = slides[0];
const h1 = cover.querySelector("h1");
if (h1) splitWords(h1);

const coverPlate = cover.querySelector(".plate");
if (coverPlate) {
  const pick = (name) => (deck.querySelector(`img[src*="${name}"]`) || {}).getAttribute?.("src");
  [["m1", "lamina-religion", "Religión", "1.1s"], ["m2", "lamina-movilidad", "Educación", "1.25s"]].forEach(([cls, file, word, delay]) => {
    const src = pick(file);
    if (!src) return;
    const m = document.createElement("div");
    m.className = `medal ${cls}`;
    m.setAttribute("aria-hidden", "true");
    m.style.setProperty("--delay", delay);
    m.innerHTML = `<div class="medal-in"><span class="disc"><img src="${src}" alt=""></span><b>${word}</b></div>`;
    coverPlate.append(m);
  });

  const badge = document.createElement("div");
  badge.className = "badge";
  badge.setAttribute("aria-hidden", "true");
  badge.innerHTML = '<svg viewBox="0 0 100 100"><defs><path id="ring" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0"/></defs><text><textPath href="#ring" textLength="236" lengthAdjust="spacing">Educación · Religión · Sociedad ·</textPath></text></svg><span class="core"></span>';
  coverPlate.append(badge);
}

addDoodles(cover, [
  ["gradcap", "5.2rem", "left:38%;top:5%", -10, 18],
  ["book", "5rem", "left:43%;bottom:12%", 8, 24],
  ["dove", "4.6rem", "left:28%;bottom:3%", -6, 12],
  ["temple", "4.4rem", "right:3%;bottom:4%", 6, 28]
]);

sparkles(cover, [
  ["left:44%;top:16%", "2.4rem", 0, 3.4],
  ["left:41%;bottom:24%", "1.3rem", 1.2, 2.8],
  ["right:6%;top:12%", "1.9rem", .6, 3.8],
  ["right:30%;bottom:16%", "1.1rem", 2, 3],
  ["left:2.2%;top:30%", "1rem", 1.6, 4],
  ["left:30%;top:6%", ".9rem", .3, 3.2]
]);

const closing = slides[slides.length - 1];
if (closing && closing !== cover) {
  addDoodles(closing, [
    ["heart", "4.4rem", "left:12%;top:12%", -12, 16],
    ["bulb", "4.8rem", "left:9%;bottom:16%", 8, 22],
    ["star8", "2.4rem", "left:22%;top:7%", 0, 10],
    ["gradcap", "5.6rem", "right:9%;top:9%", 12, 30],
    ["book", "5rem", "right:8%;bottom:15%", -10, 26],
    ["dove", "4.8rem", "left:20%;bottom:7%", -8, 20],
    ["temple", "4.4rem", "right:20%;bottom:6%", 6, 18],
    ["sparkle", "2.6rem", "right:24%;top:6%", 0, 12],
    ["palette", "4rem", "left:4%;top:42%", -6, 24],
    ["candle", "3.6rem", "right:9%;top:42%", 8, 24]
  ]);
  sparkles(closing, [
    ["left:30%;top:14%", "2rem", 0, 3.4],
    ["right:30%;top:16%", "1.6rem", 1, 3],
    ["left:28%;bottom:18%", "1.4rem", 1.8, 3.6],
    ["right:28%;bottom:20%", "1.8rem", .7, 2.8],
    ["left:50%;top:5%", "1.2rem", 1.3, 3.2]
  ]);
}

/* ---------- Gracias ---------- */
const thanks = document.querySelector(".thanks");
if (thanks) {
  const word = thanks.querySelector(".thanks-word");
  const text = word.textContent;
  word.textContent = "";
  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "ch";
    span.style.setProperty("--c", i);
    span.textContent = ch;
    word.append(span);
  });

  const sub = thanks.querySelector(".thanks-sub");
  sub.insertAdjacentHTML("beforeend", '<svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 12C70 4 140 16 210 8S280 6 296 12"/></svg>');

  [["min(52vw, 78vh)", "14s", "#f0c46a", "normal"], ["min(68vw, 100vh)", "22s", "#e08a6e", "reverse"], ["min(38vw, 58vh)", "9s", "#8fbccd", "normal"]]
    .forEach(([o, t, col, dir]) => {
      const orbit = document.createElement("span");
      orbit.className = "orbit";
      orbit.setAttribute("aria-hidden", "true");
      orbit.style.cssText = `--o:${o};--t:${t};--c:${col};--dir:${dir}`;
      orbit.innerHTML = "<i></i>";
      thanks.append(orbit);
    });

  const colors = ["#f0c46a", "#e08a6e", "#8fbccd", "#9cc08c", "#bba9dd", "#fbf4e8"];
  const closeSlide = thanks.closest(".slide");
  for (let i = 0; i < 70; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.setAttribute("aria-hidden", "true");
    const r = (a, b) => (a + Math.random() * (b - a)).toFixed(2);
    piece.style.cssText = `--x:${r(2, 98)}%;--w:${r(8, 16)}px;--c:${colors[i % colors.length]};--t:${r(4.5, 8)}s;--dl:${r(0.6, 6)}s;--dx:${r(-120, 120)}px;--rot:${r(-720, 720)}deg`;
    closeSlide.append(piece);
  }
}

/* ---------- Telón de entrada ---------- */
if (!reduce) {
  const intro = document.createElement("div");
  intro.className = "intro";
  intro.setAttribute("aria-hidden", "true");
  intro.innerHTML = "<p>Exposición</p>";
  document.body.append(intro);
  window.setTimeout(() => { ready = true; paint(); }, 1350);
  window.setTimeout(() => intro.remove(), 2600);
}

/* =========================================================
   Navegación (igual que antes)
   ========================================================= */
slides.forEach((slide, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", slide.getAttribute("aria-label") || `Sala ${index + 1}`);
  button.addEventListener("click", () => goTo(index));
  ticks.appendChild(button);
});

function currentIndex() {
  return Math.max(0, Math.min(slides.length - 1, Math.round(deck.scrollLeft / deck.clientWidth)));
}

let lastActive = -1;

function paint() {
  const index = currentIndex();
  const active = slides[index];
  document.body.dataset.skin = active.dataset.skin || "dark";
  counter.textContent = `${index + 1} de ${slides.length}`;
  bar.style.transform = `scaleX(${slides.length > 1 ? index / (slides.length - 1) : 1})`;
  [...ticks.children].forEach((button, i) => button.classList.toggle("is-on", i === index));

  if (ready && index !== lastActive) {
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    lastActive = index;
  }

  if (reduce) return;
  slides.forEach((slide) => {
    const progress = slide.getBoundingClientRect().left / deck.clientWidth;
    slide.querySelectorAll("[data-depth]").forEach((el) => {
      el.style.setProperty("--px", `${(progress * Number(el.dataset.depth)).toFixed(1)}px`);
    });
  });
}

function goTo(index) {
  const next = Math.max(0, Math.min(slides.length - 1, index));
  deck.scrollTo({
    left: next * deck.clientWidth,
    behavior: reduce ? "auto" : "smooth"
  });
}

document.querySelector(".next").addEventListener("click", () => goTo(currentIndex() + 1));
document.querySelector(".prev").addEventListener("click", () => goTo(currentIndex() - 1));

let busy = false;
deck.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
  event.preventDefault();
  if (busy || Math.abs(event.deltaY) < 8) return;
  busy = true;
  goTo(currentIndex() + (event.deltaY > 0 ? 1 : -1));
  window.setTimeout(() => {
    busy = false;
  }, reduce ? 80 : 680);
}, { passive: false });

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "PageDown") {
    event.preventDefault();
    goTo(currentIndex() + 1);
  }
  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    goTo(currentIndex() - 1);
  }
});

deck.addEventListener("scroll", () => {
  window.requestAnimationFrame(paint);
}, { passive: true });

window.addEventListener("resize", () => {
  deck.scrollTo({ left: currentIndex() * deck.clientWidth, behavior: "auto" });
  paint();
});

/* =========================================================
   Movimiento con el mouse: foco de luz, paralaje y destellos
   ========================================================= */
if (!reduce && window.matchMedia("(pointer: fine)").matches) {
  const rootStyle = document.documentElement.style;
  let raf = 0;
  let lastTrail = 0;
  let px = 0;
  let py = 0;

  window.addEventListener("pointermove", (event) => {
    px = event.clientX;
    py = event.clientY;
    if (!raf) {
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        rootStyle.setProperty("--mx", ((px / window.innerWidth) * 2 - 1).toFixed(3));
        rootStyle.setProperty("--my", ((py / window.innerHeight) * 2 - 1).toFixed(3));
        rootStyle.setProperty("--sx", `${px}px`);
        rootStyle.setProperty("--sy", `${py}px`);
      });
    }

    const now = performance.now();
    if (document.body.dataset.skin === "dark" && now - lastTrail > 45) {
      lastTrail = now;
      const t = document.createElement("span");
      t.className = "trail";
      t.style.left = `${px}px`;
      t.style.top = `${py}px`;
      document.body.append(t);
      window.setTimeout(() => t.remove(), 900);
    }
  });
}

paint();
