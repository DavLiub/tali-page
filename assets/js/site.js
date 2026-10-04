(()=>{"use strict";
const cfg=window.SITE_CONFIG,data=window.SITE_CONTENT,root=document.documentElement;
let lang=cfg.languages.includes(localStorage.getItem("tali-language"))?localStorage.getItem("tali-language"):cfg.defaultLanguage;
const t=k=>data[lang][k]??data.ru[k]??k;
const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function render(){
 document.querySelector("[data-services]").innerHTML=t("services").map(x=>`<article class="service-card"><div class="service-icon">${esc(x[0])}</div><h3>${esc(x[1])}</h3><p>${esc(x[2])}</p></article>`).join("");
 document.querySelector("[data-steps]").innerHTML=t("steps").map(x=>`<li class="step"><div><h3>${esc(x[0])}</h3><p>${esc(x[1])}</p></div></li>`).join("");
 document.querySelector("[data-features]").innerHTML=t("features").map(x=>`<div class="feature">${esc(x)}</div>`).join("");
 document.querySelector("[data-formats]").innerHTML=t("formats").map(x=>`<article class="format-card"><b>${esc(x[0])}</b><h3>${esc(x[1])}</h3><p>${esc(x[2])}</p></article>`).join("");
 document.querySelector("[data-faq]").innerHTML=t("faqs").map((x,i)=>`<section class="faq-item"><button class="faq-question" aria-expanded="false" aria-controls="faq-${i}"><span>${esc(x[0])}</span><b>+</b></button><div class="faq-answer" id="faq-${i}" hidden>${esc(x[1])}</div></section>`).join("");
 document.querySelectorAll(".faq-question").forEach(b=>b.onclick=()=>{const open=b.getAttribute("aria-expanded")==="true";b.setAttribute("aria-expanded",String(!open));document.getElementById(b.getAttribute("aria-controls")).hidden=open});
}
function setLanguage(next){lang=next;localStorage.setItem("tali-language",lang);root.lang=lang;root.dir=lang==="he"?"rtl":"ltr";document.title=t("pageTitle");document.querySelectorAll("[data-i18n]").forEach(n=>n.textContent=t(n.dataset.i18n));document.querySelectorAll("[data-i18n-html]").forEach(n=>n.innerHTML=t(n.dataset.i18nHtml));document.querySelectorAll("[data-site-name]").forEach(n=>n.textContent=cfg.siteName);document.querySelectorAll("[data-language]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.language===lang)));render()}
document.querySelectorAll("[data-language]").forEach(b=>b.onclick=()=>setLanguage(b.dataset.language));
const menu=document.querySelector(".menu-button"),mobile=document.querySelector(".mobile-nav");menu.onclick=()=>{const open=menu.getAttribute("aria-expanded")==="true";menu.setAttribute("aria-expanded",String(!open));mobile.hidden=open;document.body.classList.toggle("menu-open",!open)};mobile.querySelectorAll("a").forEach(a=>a.onclick=()=>{menu.setAttribute("aria-expanded","false");mobile.hidden=true;document.body.classList.remove("menu-open")});
if(cfg.profilePhoto){const p=document.querySelector("[data-photo]");p.innerHTML=`<img src="${esc(cfg.profilePhoto)}" alt="${esc(cfg.siteName)}">`;p.classList.add("has-photo")}
document.querySelector("[data-year]").textContent=new Date().getFullYear();
const form=document.querySelector("[data-form]"),status=document.querySelector("[data-status]");
function valid(){let ok=true;form.querySelectorAll("[required]").forEach(f=>{const yes=f.type==="checkbox"?f.checked:Boolean(f.value.trim());f.setAttribute("aria-invalid",String(!yes));ok=ok&&yes});return ok}
form.oninput=valid;form.onsubmit=async e=>{e.preventDefault();status.className="form-status";if(!valid()){status.classList.add("error");status.textContent=t("required");return}if(cfg.contact.mode==="preview"||!cfg.contact.endpoint){status.textContent=t("previewStatus");return}const button=form.querySelector("button");button.disabled=true;try{const response=await fetch(cfg.contact.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(new FormData(form)))});if(!response.ok)throw Error();form.reset();status.classList.add("success");status.textContent=t("sentStatus")}catch{status.classList.add("error");status.textContent=t("sendError")}finally{button.disabled=false}};
setLanguage(lang);
})();
