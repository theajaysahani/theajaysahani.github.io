// Spatial theme interactions: gaze-style hover glow, gentle 3D tilt, environment parallax, reveal on scroll
(function () {
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;

  // Highlight the current page in the ornament
  const page = (location.pathname.split("/").pop() || "index.html").replace(".html", "");
  document.querySelectorAll(".orn[data-page]").forEach((a) => a.classList.toggle("on", a.dataset.page === page));

  // Hover highlight + tilt
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    const max = +(el.dataset.tiltMax || 6);
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", x * 100 + "%");
      el.style.setProperty("--my", y * 100 + "%");
      if (!still && fine) {
        el.style.setProperty("--ry", ((x - 0.5) * max).toFixed(2) + "deg");
        el.style.setProperty("--rx", ((0.5 - y) * max).toFixed(2) + "deg");
      }
    });
    el.addEventListener("pointerleave", () => { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); });
  });

  // Environment parallax
  const env = document.querySelector(".env");
  if (env && !still && fine) {
    window.addEventListener("pointermove", (e) => {
      env.style.setProperty("--px", (e.clientX / innerWidth - 0.5) * -24 + "px");
      env.style.setProperty("--py", (e.clientY / innerHeight - 0.5) * -24 + "px");
    });
  }

  // Reveal windows as they come into view; grow any chart bars inside them
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      en.target.querySelectorAll(".bar.b").forEach((b) => b.classList.add("go"));
      io.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
