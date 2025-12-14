/* CO₂ KUALTA — interactions (static) */
(function () {
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));

  // ===== CONFIG =====
  // Cambia este número por el WhatsApp oficial (formato internacional sin +, sin espacios).
  // Colombia ejemplo: 573116608217
  const WHATSAPP_NUMBER = "573116608217";

  // Cambia estos links por los tuyos reales si quieres (opcional).
  const WOMPI_LINK = "https://checkout.wompi.co/";
  const PAYPAL_LINK = "https://www.paypal.com/paypalme/";

  // ===== NAV (mobile) =====
  const toggle = qs("#navToggle");
  const mobile = qs("#navMobile");
  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      const open = !mobile.hasAttribute("hidden");
      if (open) {
        mobile.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
      } else {
        mobile.removeAttribute("hidden");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
    qsa("a", mobile).forEach(a => a.addEventListener("click", () => {
      mobile.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  // ===== Year =====
  const year = qs("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // ===== Scroll progress =====
  const bar = qs("#scrollProgress");
  const onScroll = () => {
    if (!bar) return;
    const h = document.documentElement;
    const scrollTop = h.scrollTop || document.body.scrollTop;
    const scrollHeight = h.scrollHeight - h.clientHeight;
    const p = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;
    bar.style.width = (p * 100).toFixed(2) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ===== Reveal animations =====
  const reveals = qsa(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("is-in"));
  }

  // ===== WhatsApp helper =====
  function openWhatsApp(message) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  }

  // Floating button
  const waFloat = qs("#waFloat");
  if (waFloat) {
    waFloat.addEventListener("click", (e) => {
      e.preventDefault();
      openWhatsApp("Hola CO₂ KUALTA, quiero información. ¿Me apoyan con una cotización?");
    });
    waFloat.setAttribute("href", `https://wa.me/${WHATSAPP_NUMBER}`);
  }

  // Lead form -> WhatsApp
  const form = qs("#leadForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const nombre = String(fd.get("nombre") || "").trim();
      const servicio = String(fd.get("servicio") || "").trim();
      const ciudad = String(fd.get("ciudad") || "").trim();
      const telefono = String(fd.get("telefono") || "").trim();
      const msg = String(fd.get("mensaje") || "").trim();

      const message =
`Hola CO₂ KUALTA, soy ${nombre}.
Servicio: ${servicio}
Ciudad/Municipio: ${ciudad}
Mi WhatsApp: ${telefono}
${msg ? `Mensaje: ${msg}` : ""}

Quedo atento(a).`;
      openWhatsApp(message);
    });
  }

  // ===== Lead magnet (download) =====
  const dl1 = qs("#downloadLeadMagnet");
  const dl2 = qs("#modalDownload");
  const openPopup = qs("#openPopup");
  function downloadLead() {
    // Descarga local (incluida en /assets). Si la cambias, conserva el nombre o actualiza aquí.
    const a = document.createElement("a");
    a.href = "./assets/guia-predio-checklist.pdf";
    a.download = "CO2-KUALTA-checklist-predio.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  if (dl1) dl1.addEventListener("click", downloadLead);
  if (dl2) dl2.addEventListener("click", downloadLead);

  // ===== Exit intent popup =====
  const modal = qs("#exitModal");
  const openModal = () => {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  };

  if (openPopup) {
    openPopup.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.dataset && t.dataset.close === "true") closeModal();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  // Show once per session (exit intent)
  let exitShown = sessionStorage.getItem("kualta_exit_shown") === "1";
  function onMouseOut(e) {
    if (exitShown) return;
    // Top boundary exit
    if (e.clientY <= 0) {
      exitShown = true;
      sessionStorage.setItem("kualta_exit_shown", "1");
      openModal();
      window.removeEventListener("mouseout", onMouseOut);
    }
  }
  // Only on desktop-ish
  if (window.matchMedia("(hover:hover)").matches) {
    window.addEventListener("mouseout", onMouseOut);
  }

  // ===== Patch payment links if present =====
  qsa("a[href='https://checkout.wompi.co/']").forEach(a => a.href = WOMPI_LINK);
  qsa("a[href='https://www.paypal.com/paypalme/']").forEach(a => a.href = PAYPAL_LINK);
})();
