const root = document.documentElement;
let lang = localStorage.getItem("lang") || "uz";
let theme = localStorage.getItem("theme") ||
  (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

/* Theme */
function setTheme(t){ theme=t; root.dataset.theme=t; localStorage.setItem("theme",t); }
document.getElementById("theme").onclick = () => setTheme(theme==="dark"?"light":"dark");
setTheme(theme);

/* Language */
function setLang(l){
  lang=l; root.lang=l; localStorage.setItem("lang",l);
  document.querySelectorAll("[data-i18n]").forEach(el=>{ el.textContent = I18N[l][el.dataset.i18n]; });
  document.getElementById("lang").textContent = l==="uz" ? "EN" : "UZ";
  startTyping();
}
document.getElementById("lang").onclick = () => setLang(lang==="uz"?"en":"uz");

/* Typing effect */
let typeTimer;
function startTyping(){
  clearTimeout(typeTimer);
  const el = document.getElementById("typed"), roles = I18N[lang].roles;
  let r=0, c=0, del=false;
  (function tick(){
    const w = roles[r];
    el.textContent = w.slice(0,c);
    if(!del && c===w.length){ del=true; typeTimer=setTimeout(tick,1400); return; }
    if(del && c===0){ del=false; r=(r+1)%roles.length; }
    c += del ? -1 : 1;
    typeTimer = setTimeout(tick, del?40:90);
  })();
}
setLang(lang);

/* Cursor glow */
const glow = document.getElementById("glow");
addEventListener("pointermove", e => {
  glow.style.transform = `translate(${e.clientX-200}px,${e.clientY-200}px)`;
});

/* Skill bars on scroll */
const io = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting){ e.target.classList.add("on"); io.unobserve(e.target); }
}), {threshold:.4});
document.querySelectorAll(".bar").forEach(b => io.observe(b));

/* Card tilt */
document.querySelectorAll(".tilt").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
    card.style.transform = `perspective(700px) rotateY(${x*10}deg) rotateX(${-y*10}deg)`;
  });
  card.addEventListener("pointerleave", () => card.style.transform = "");
});
