// ---- Site settings: edit these ----
const SITE = {
  whatsapp: "918850117504",                 // country code + number, no "+"
  email: "ajaysahani2509@gmail.com",
  linkedin: "https://www.linkedin.com/in/ajay-sahani",
  instagram: "",                            // e.g. "https://www.instagram.com/yourhandle"
  waText: "Hi Ajay, I found your website. I'd like to talk about: ",
};
// -----------------------------------

(function () {
  // WhatsApp links
  const waUrl = SITE.whatsapp
    ? "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(SITE.waText)
    : "mailto:" + SITE.email;
  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = waUrl;
    if (SITE.whatsapp) { a.target = "_blank"; a.rel = "noopener"; }
  });
  document.querySelectorAll("[data-wa-num]").forEach((el) => {
    el.textContent = SITE.whatsapp ? "+" + SITE.whatsapp.replace(/^91(\d{5})(\d{5})$/, "91 $1 $2") : SITE.email;
  });
  document.querySelectorAll("[data-mail]").forEach((a) => { a.href = "mailto:" + SITE.email; });
  document.querySelectorAll("[data-mail-text]").forEach((el) => { el.textContent = SITE.email; });
  document.querySelectorAll("[data-linkedin]").forEach((a) => { a.href = SITE.linkedin; a.target = "_blank"; a.rel = "noopener"; });
  document.querySelectorAll("[data-insta]").forEach((a) => {
    if (SITE.instagram) { a.href = SITE.instagram; a.target = "_blank"; a.rel = "noopener"; }
    else { a.style.display = "none"; }
  });
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Active nav link + mobile menu
  const page = (location.pathname.split("/").pop() || "index.html").replace(".html", "") || "index";
  document.querySelectorAll(".nav-links a[data-page]").forEach((a) => {
    if (a.dataset.page === page) a.classList.add("on");
  });
  const btn = document.querySelector(".menu-btn");
  const links = document.querySelector(".nav-links");
  if (btn && links) {
    btn.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", (e) => { if (e.target.closest("a")) links.classList.remove("open"); });
  }

  // Constellation network in the hero (like the resume header)
  const canvas = document.querySelector("canvas.net");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, dpr, nodes;
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(26, Math.max(12, w / 55)));
    nodes = Array.from({ length: count }, (_, i) => ({
      x: w * (0.35 + 0.65 * Math.random()),
      y: h * Math.random() * 0.75,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      hot: i % 9 === 0,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 190) {
          ctx.strokeStyle = "rgba(142,162,255," + (0.28 * (1 - d / 190)).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.fillStyle = n.hot ? "rgba(245,166,35,0.95)" : "rgba(142,162,255,0.85)";
      ctx.arc(n.x, n.y, n.hot ? 4 : 2.2, 0, Math.PI * 2);
      ctx.fill();
      if (n.hot) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(245,166,35,0.35)";
        ctx.arc(n.x, n.y, 9, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }
  function tick() {
    nodes.forEach((n) => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < w * 0.3 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h * 0.8) n.vy *= -1;
    });
    draw();
    requestAnimationFrame(tick);
  }
  size();
  window.addEventListener("resize", () => { size(); draw(); });
  if (still) draw(); else tick();
})();
