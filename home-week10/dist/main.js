(()=>{function e(){const t=JSON.parse(localStorage.getItem("savedDogs"))||[],n=document.getElementById("dogList");n.innerHTML="",t.forEach(((t,o)=>{const d=document.createElement("li"),a=document.createElement("strong");a.textContent=t.name;const c=document.createElement("img");c.src=t.url,c.width=200,c.alt="Saved puppy images";const r=document.createElement("button");r.textContent="Save photo",r.addEventListener("click",(()=>{return e=t.name,n=t.url,void fetch(n).then((e=>e.blob())).then((t=>{const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=`${e}.jpg`,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(n.href)})).catch((e=>console.error("Image download error:",e)));var e,n}));const l=document.createElement("button");l.textContent="Delete photo",l.addEventListener("click",(()=>function(t){const n=JSON.parse(localStorage.getItem("savedDogs"))||[];n.splice(t,1),localStorage.setItem("savedDogs",JSON.stringify(n)),e()}(o))),d.appendChild(a),d.appendChild(document.createElement("br")),d.appendChild(c),d.appendChild(document.createElement("br")),d.appendChild(r),d.appendChild(l),n.appendChild(d)}))}document.getElementById("getDog").addEventListener("click",(async function e(){try{const t=await fetch("https://random.dog/woof.json"),n=await t.json(),o=document.getElementById("mediaContainer");if(o.innerHTML="",n.url.match(/\.(jpg|jpeg|png)$/i)){const e=document.createElement("img");e.src=n.url,e.alt="random puppy images",e.width=400,o.appendChild(e)}else e()}catch(e){console.error("Error fetching dog media:",e)}})),document.getElementById("saveDog").addEventListener("click",(function(){const t=document.getElementById("dogName").value.trim(),n=document.getElementById("mediaContainer").firstChild;if(!t||!n||!n.src)return void alert("Check out the puppy names and images!");const o=JSON.parse(localStorage.getItem("savedDogs"))||[];o.push({name:t,url:n.src}),localStorage.setItem("savedDogs",JSON.stringify(o)),document.getElementById("dogName").value="",alert("The puppy has been saved!"),e()})),document.addEventListener("DOMContentLoaded",e)})();