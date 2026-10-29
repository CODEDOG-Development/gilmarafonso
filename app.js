const products = [
 {id:1,name:"Polo Clássica Bordô",subtitle:"Algodão premium",price:119.90,category:"Polos",image:"assets/polo-bordo.jpeg",colors:["black","white","gray"]},
 {id:2,name:"Camisa Social Branca",subtitle:"Corte elegante",price:159.90,category:"Camisas Sociais",image:"assets/camisa-social-branca.jpeg",colors:["white","black"]},
 {id:3,name:"Polo Clássica Preta",subtitle:"Essencial masculino",price:119.90,category:"Polos",image:"assets/polo-preta.jpeg",colors:["black","white","gray"]},
 {id:4,name:"Camisa Social Preta",subtitle:"Visual sofisticado",price:159.90,category:"Camisas Sociais",image:"assets/camisa-social-preta.jpeg",colors:["black","white"]},
 {id:5,name:"Polo Branca",subtitle:"Clássica e versátil",price:119.90,category:"Polos",image:"assets/polo-branca.jpeg",colors:["white","black","gray"]},
 {id:6,name:"Camiseta Cinza",subtitle:"Básica premium",price:89.90,category:"Camisetas",image:"assets/camiseta-cinza.jpeg",colors:["gray","black","white"]},
 {id:7,name:"Camiseta Preta",subtitle:"Essencial minimalista",price:89.90,category:"Camisetas",image:"assets/camiseta-preta.jpeg",colors:["black","white","gray"]},
 {id:8,name:"Camiseta Verde Militar",subtitle:"Casual contemporânea",price:89.90,category:"Camisetas",image:"assets/camiseta-verde-militar.jpeg",colors:["gray","black","white"]}
];
const money = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let cart = JSON.parse(localStorage.getItem("ga_cart") || "[]");
let authMode = "login";
let currentFilter = "Todos";
let toastTimer;

function renderProducts(list=products){
  $("#productGrid").innerHTML = list.length ? list.map(p=>`
    <article class="product-card">
      <div class="product-image-wrap"><img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy"></div>
      <div class="product-info"><p class="product-name">${p.name}</p><p class="product-subtitle">${p.subtitle}</p>
      <p class="product-price">${money(p.price)}</p><div class="product-actions">
      <div class="swatches" aria-label="Cores disponíveis">${p.colors.map(c=>`<span class="swatch ${c}" title="${c}"></span>`).join("")}</div>
      <button class="add-cart" data-add="${p.id}" aria-label="Adicionar ${p.name} ao carrinho">🛒</button></div></div>
    </article>`).join("") : '<p class="empty-cart">Nenhum produto encontrado.</p>';
}
function saveCart(){localStorage.setItem("ga_cart",JSON.stringify(cart));renderCart();updateCount();}
function updateCount(){$("#cartCount").textContent=cart.reduce((sum,item)=>sum+item.qty,0);}
function addToCart(id){
 const product=products.find(p=>p.id===Number(id));if(!product)return;
 const item=cart.find(i=>i.id===product.id);
 if(item)item.qty++;else cart.push({...product,qty:1});
 saveCart();showToast(`${product.name} adicionado ao carrinho.`);
}
function renderCart(){
 const target=$("#cartItems");
 if(!cart.length){target.innerHTML='<p class="empty-cart">Seu carrinho está vazio.<br>Escolha seus produtos favoritos.</p>';}
 else target.innerHTML=cart.map(item=>`<div class="cart-line"><img src="${item.image}" alt=""><div><h4>${item.name}</h4><span class="line-price">${money(item.price)}</span><div class="quantity"><button data-qty="${item.id}" data-delta="-1" aria-label="Diminuir quantidade">−</button><span>${item.qty}</span><button data-qty="${item.id}" data-delta="1" aria-label="Aumentar quantidade">+</button></div></div><button class="remove-item" data-remove="${item.id}" aria-label="Remover item">×</button></div>`).join("");
 $("#cartSubtotal").textContent=money(cart.reduce((sum,item)=>sum+item.price*item.qty,0));
 $("#checkoutBtn").disabled=!cart.length;$("#checkoutBtn").style.opacity=cart.length?"1":".5";
}
function openOverlay(){ $("#overlay").classList.add("active"); }
function closeAll(){
 $("#overlay").classList.remove("active");
 $$(".cart-drawer,.modal").forEach(el=>{el.classList.remove("open","active");el.setAttribute("aria-hidden","true");});
}
function openCart(){closeAll();openOverlay();$("#cartDrawer").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");}
function openModal(id){closeAll();openOverlay();const modal=$("#"+id);modal.classList.add("active");modal.setAttribute("aria-hidden","false");}
function showToast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2600);}
function setAuthMode(mode){
 authMode=mode;$("#authTitle").textContent=mode==="login"?"Bem-vindo de volta":"Crie sua conta";
 $("#authSubtitle").textContent=mode==="login"?"Entre para acompanhar seus pedidos.":"Cadastre-se para agilizar suas compras.";
 $("#nameField").classList.toggle("hidden",mode==="login");$("#authName").required=mode==="register";
 $("#authPassword").autocomplete=mode==="login"?"current-password":"new-password";
 $("#authSubmit").textContent=mode==="login"?"ENTRAR":"CRIAR CONTA";
 $$(".auth-tabs button").forEach(b=>b.classList.toggle("active",b.dataset.authTab===mode));$("#authMessage").textContent="";
}
function renderCheckout(){
 const subtotal=cart.reduce((sum,item)=>sum+item.price*item.qty,0);
 $("#checkoutItems").innerHTML=cart.map(i=>`<div class="summary-product"><span>${i.qty}× ${i.name}</span><strong>${money(i.price*i.qty)}</strong></div>`).join("");
 $("#checkoutSubtotal").textContent=money(subtotal);updateCheckoutTotal();
}
function updateCheckoutTotal(){
 const subtotal=cart.reduce((sum,item)=>sum+item.price*item.qty,0);
 const pix=$('input[name="payment"]:checked')?.value==="pix";
 const discount=pix?subtotal*.05:0;const shipping=subtotal===0?0:(subtotal>=299?0:19.90);
 $("#shippingValue").textContent=shipping===0?"Grátis":money(shipping);
 $("#discountValue").textContent="− "+money(discount);$("#discountLine").style.display=pix?"flex":"none";
 $("#checkoutTotal").textContent=money(subtotal+shipping-discount);
 $("#checkoutItems").innerHTML=cart.map(i=>`<div class="summary-product"><span>${i.qty}× ${i.name}</span><strong>${money(i.price*i.qty)}</strong></div>`).join("");
}
function openCheckout(){
 if(!cart.length){showToast("Adicione um produto antes de finalizar.");return;}
 closeAll();renderCheckout();openModal("checkoutModal");
 const user=JSON.parse(localStorage.getItem("ga_user")||"null");
 if(user){const f=$("#checkoutForm");f.elements.name.value=user.name||"";f.elements.email.value=user.email||"";}
}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add)addToCart(add.dataset.add);
 const qty=e.target.closest("[data-qty]");if(qty){const item=cart.find(i=>i.id===Number(qty.dataset.qty));if(item){item.qty+=Number(qty.dataset.delta);if(item.qty<=0)cart=cart.filter(i=>i.id!==item.id);saveCart();}}
 const remove=e.target.closest("[data-remove]");if(remove){cart=cart.filter(i=>i.id!==Number(remove.dataset.remove));saveCart();}
 const category=e.target.closest("[data-category]");if(category){currentFilter=category.dataset.category;renderProducts(currentFilter==="Todos"?products:products.filter(p=>p.category===currentFilter));$("#destaques").scrollIntoView({behavior:"smooth"});showToast(currentFilter==="Todos"?"Coleção completa":`Categoria: ${currentFilter}`);}
 if(e.target.closest("[data-close]"))closeAll();
 const tab=e.target.closest("[data-auth-tab]");if(tab)setAuthMode(tab.dataset.authTab);
});
$("#overlay").addEventListener("click",closeAll);
$("#openCart").addEventListener("click",openCart);
$("#openAuth").addEventListener("click",()=>{setAuthMode("login");openModal("authModal");});
$("#checkoutBtn").addEventListener("click",openCheckout);
$("#searchToggle").addEventListener("click",()=>{$("#searchBar").classList.toggle("hidden");if(!$("#searchBar").classList.contains("hidden"))$("#searchInput").focus();});
$("#searchClose").addEventListener("click",()=>{$("#searchBar").classList.add("hidden");$("#searchInput").value="";renderProducts();});
$("#searchInput").addEventListener("input",e=>{const q=e.target.value.trim().toLocaleLowerCase("pt-BR");renderProducts(products.filter(p=>(currentFilter==="Todos"||p.category===currentFilter)&&`${p.name} ${p.subtitle} ${p.category}`.toLocaleLowerCase("pt-BR").includes(q)));});
$("#mobileMenu").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
$("#mainNav").addEventListener("click",e=>{if(e.target.closest("a"))$("#mainNav").classList.remove("open");});
$("#authForm").addEventListener("submit",e=>{
 e.preventDefault();const email=$("#authEmail").value.trim().toLowerCase();const password=$("#authPassword").value;
 let users=JSON.parse(localStorage.getItem("ga_users")||"[]");
 if(authMode==="register"){
  if(users.some(u=>u.email===email)){$("#authMessage").textContent="Já existe uma conta com este e-mail.";return;}
  const user={name:$("#authName").value.trim(),email,password};users.push(user);localStorage.setItem("ga_users",JSON.stringify(users));localStorage.setItem("ga_user",JSON.stringify({name:user.name,email:user.email}));
  $("#openAuth").textContent=user.name.split(" ")[0]||"Minha conta";$("#authMessage").textContent="Conta criada nesta demonstração.";
  setTimeout(()=>{closeAll();showToast("Cadastro realizado.");},900);
 }else{
  const user=users.find(u=>u.email===email&&u.password===password);
  if(!user){$("#authMessage").textContent="E-mail ou senha incorretos. Para testar, crie uma conta.";return;}
  localStorage.setItem("ga_user",JSON.stringify({name:user.name,email:user.email}));$("#openAuth").textContent=user.name.split(" ")[0]||"Minha conta";$("#authMessage").textContent="Login realizado.";
  setTimeout(()=>{closeAll();showToast("Login realizado com sucesso.");},700);
 }
});
$$('input[name="payment"]').forEach(input=>input.addEventListener("change",()=>{
 const isCard=input.value==="card"&&input.checked;$("#cardFields").classList.toggle("hidden",!isCard);
 ["cardName","cardNumber","expiry","cvv"].forEach(name=>$("#checkoutForm").elements[name].required=isCard);
 updateCheckoutTotal();
}));
$("#cep").addEventListener("input",e=>{let v=e.target.value.replace(/\D/g,"").slice(0,8);if(v.length>5)v=v.slice(0,5)+"-"+v.slice(5);e.target.value=v;});
$("#checkoutForm").addEventListener("submit",e=>{
 e.preventDefault();if(!cart.length){$("#checkoutMessage").textContent="O carrinho está vazio.";return;}
 const form=e.currentTarget;const data=Object.fromEntries(new FormData(form).entries());
 // Este protótipo não envia dados para servidor e não realiza cobrança.
 const orderId="GA"+Date.now().toString().slice(-8);
 $("#successText").textContent=`Pedido ${orderId} registrado para ${data.name}. Total demonstrativo: ${$("#checkoutTotal").textContent}.`;
 closeAll();openModal("successModal");cart=[];saveCart();form.reset();$("#cardFields").classList.add("hidden");
});
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();$("#newsletterMessage").textContent="Cadastro demonstrativo realizado.";e.currentTarget.reset();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAll();});
$("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();updateCount();
const savedUser=JSON.parse(localStorage.getItem("ga_user")||"null");if(savedUser)$("#openAuth").textContent=(savedUser.name||"Minha conta").split(" ")[0];
