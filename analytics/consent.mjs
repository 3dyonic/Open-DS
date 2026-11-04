// Google Tag Manager for the docs and Storybook on open-ds.dev, only with consent: the same rules as the
// website's banner (site/src/lib/analytics.ts). One choice covers all three, because they share the
// domain and the "open-ds-consent" key. The container ID comes from NEXT_PUBLIC_GTM_ID at build time
// and is never committed. Without it this returns nothing: no banner, nothing loads from Google.
// "Cookie settings" opens the banner again: any link to #cookie-settings.

export const CONSENT_KEY = "open-ds-consent";

/** The inline script for a page's head, or "" when there is no container ID. */
export function consentScript(gtmId = process.env.NEXT_PUBLIC_GTM_ID ?? "") {
  if (!/^GTM-[A-Z0-9]{4,12}$/.test(gtmId)) return "";
  const id = JSON.stringify(gtmId);
  const key = JSON.stringify(CONSENT_KEY);
  return `(function(){
var ID=${id},KEY=${key};
function read(){try{var v=localStorage.getItem(KEY);return v==="granted"||v==="denied"?v:null}catch(e){return null}}
function save(v){try{localStorage.setItem(KEY,v)}catch(e){}}
function load(){if(window.gtag)return;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};
window.gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"granted"});
window.dataLayer.push({"gtm.start":Date.now(),event:"gtm.js"});var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtm.js?id="+encodeURIComponent(ID);document.head.appendChild(s)}
function stop(){if(window.gtag)window.gtag("consent","update",{analytics_storage:"denied"});var h=location.hostname,ds=["",h,"."+h,"."+h.split(".").slice(-2).join(".")];
document.cookie.split(";").forEach(function(c){var n=c.split("=")[0].trim();if(n==="_ga"||n.indexOf("_ga_")===0)ds.forEach(function(d){document.cookie=n+"=; Max-Age=0; path=/"+(d?"; domain="+d:"")})})}
function banner(){if(document.getElementById("ods-consent"))return;var b=document.createElement("section");b.id="ods-consent";b.setAttribute("role","region");b.setAttribute("aria-label","Cookie choice");
b.style.cssText="position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;max-width:720px;margin:0 auto;display:flex;flex-wrap:wrap;gap:12px 20px;align-items:center;padding:16px 20px;border:1px solid #d9d4cc;border-radius:8px;background:#fff;color:#2a2420;box-shadow:0 8px 24px rgba(0,0,0,.15);font:15px/1.5 system-ui,sans-serif";
b.innerHTML='<p style="margin:0;flex:1 1 320px">May we count visits with Google Analytics? It sets cookies to tell us which pages people read. No ads, nothing sold. <a href="https://open-ds.dev/privacy/#cookies" style="color:inherit;font-weight:600;text-decoration:underline">Privacy</a></p><div style="display:flex;gap:8px"><button type="button" data-v="denied">Reject</button><button type="button" data-v="granted">Accept</button></div>';
var bs=b.querySelectorAll("button");for(var i=0;i<bs.length;i++){var on=bs[i].getAttribute("data-v")==="granted";bs[i].style.cssText="font:600 15px system-ui,sans-serif;padding:10px 16px;border-radius:4px;border:1px solid #2a2420;cursor:pointer;background:"+(on?"#2a2420":"#fff")+";color:"+(on?"#fff":"#2a2420");
bs[i].onclick=function(){var v=this.getAttribute("data-v");save(v);if(v==="granted")load();else stop();b.remove()}}
document.body.appendChild(b)}
document.addEventListener("click",function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href$="#cookie-settings"]');if(a){e.preventDefault();banner()}});
var c=read();if(c==="granted")load();
if(c===null){if(document.body)banner();else document.addEventListener("DOMContentLoaded",banner)}
})();`;
}
