const data = window.MENU_DATA;
const menuEl = document.querySelector('#menu');
const cardsEl = document.querySelector('#category-cards');
const searchEl = document.querySelector('#search');
const emptyEl = document.querySelector('#empty-state');
const activeTitle = document.querySelector('#active-title');
const activeFilter = document.querySelector('#active-filter');
let activeCategory = 'all';

const icons = {
  all:'<svg viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>',
  grill:'<svg viewBox="0 0 24 24"><path d="M5 8h14M7 8c0 5 2 7 5 7s5-2 5-7M9 15l-2 5M15 15l2 5M8 20h8M9 4c0 1 1 1.5 1 2M14 3c0 1 1 1.5 1 2"/></svg>',
  salad:'<svg viewBox="0 0 24 24"><path d="M4 11h16c0 5-3 9-8 9s-8-4-8-9zM8 8c1-3 4-4 4-4s1 3-1 5M14 9c1-2 3-3 5-3-1 3-2 4-5 4"/></svg>',
  drinks:'<svg viewBox="0 0 24 24"><path d="M7 3h10l-1 16H8L7 3zM9 8h6M15 3l3-2"/></svg>',
  hot:'<svg viewBox="0 0 24 24"><path d="M5 9h12v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V9zM17 11h2a2 2 0 1 1 0 4h-2M8 5c0-1 1-1 1-2M12 5c0-1 1-1 1-2"/></svg>',
  sandwich:'<svg viewBox="0 0 24 24"><path d="M5 9c0-3 3-5 7-5s7 2 7 5H5zM5 9h14v3H5zM6 12l2 2 3-2 3 2 3-2 2 2v3H5v-3zM5 17h14v2H5z"/></svg>',
  shisha:'<svg viewBox="0 0 24 24"><path d="M10 3h4M11 3v4h2V3M9 7h6l-1 6h-4L9 7zM12 13v6M9 21h6M16 10c4 0 5 2 5 5v3"/></svg>',
  food:'<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 16 0H4zM3 12h18M12 4V2M6 19h12"/></svg>',
  service:'<svg viewBox="0 0 24 24"><path d="M12 3a5 5 0 0 0-5 5v2H5v9h14v-9h-2V8a5 5 0 0 0-5-5zM9 10V8a3 3 0 0 1 6 0v2"/></svg>'
};

const normalize = value => String(value || '').normalize('NFKD').replace(/[ًٌٍَُِّْـ]/g, '').toLowerCase().trim();
const iconFor = category => {
  const id = normalize(category.id + ' ' + category.name);
  if(id.includes('مشا') || id.includes('grill')) return icons.grill;
  if(id.includes('سلط')) return icons.salad;
  if(id.includes('ساخن') || id.includes('قهو') || id.includes('hot')) return icons.hot;
  if(id.includes('مشروب') || id.includes('drink')) return icons.drinks;
  if(id.includes('ساند')) return icons.sandwich;
  if(id.includes('ارجيل') || id.includes('شيش') || id.includes('shisha')) return icons.shisha;
  if(id.includes('خدم')) return icons.service;
  return icons.food;
};

function setRestaurantInfo(){
  document.title = `${data.restaurant.name} | قائمة الطعام`;
  document.querySelector('#restaurant-name').textContent = data.restaurant.name;
  document.querySelector('#restaurant-subtitle').textContent = data.restaurant.subtitle;
  document.querySelector('#season').textContent = data.restaurant.season;
  document.querySelector('#restaurant-note').textContent = data.restaurant.note;
  document.querySelector('#rules').textContent = data.rules;
  document.querySelector('#footer-name').textContent = data.restaurant.name;
  document.querySelector('#phone-buttons').innerHTML = data.restaurant.phones.map(phone => `<a href="tel:${phone}">☎ ${phone}</a>`).join('');
}

function createCategoryCards(){
  const cards = [{id:'all',name:'الكل',items:data.categories.flatMap(c=>c.items)},...data.categories];
  cardsEl.innerHTML = cards.map(category=>`
    <button class="category-chip ${category.id==='all'?'active':''}" data-category="${category.id}">
      <span class="category-icon">${category.id==='all'?icons.all:iconFor(category)}</span>
      <span>${category.name}</span>
    </button>`).join('');
}

function renderMenu(){
  const query = normalize(searchEl.value);
  const selected = data.categories.find(c=>c.id===activeCategory);
  activeTitle.textContent = selected ? selected.name : 'جميع الأصناف';
  activeFilter.hidden = activeCategory==='all';
  activeFilter.innerHTML = selected ? `القسم المختار: ${selected.name} — <button id="clear-filter">عرض كل القائمة</button>` : '';
  document.querySelectorAll('.category-chip').forEach(btn=>btn.classList.toggle('active',btn.dataset.category===activeCategory));

  const visible = data.categories
    .filter(c=>activeCategory==='all'||c.id===activeCategory)
    .map(c=>({...c,items:c.items.filter(item=>normalize(`${item.name} ${item.note||''}`).includes(query))}))
    .filter(c=>c.items.length);

  menuEl.innerHTML = visible.map(category=>`
    <article class="category-card">
      <header class="category-head"><span class="category-icon">${iconFor(category)}</span><h2>${category.name}</h2></header>
      <ul class="item-list">${category.items.map(item=>`
        <li class="menu-item"><div><span class="item-name">${item.name}</span>${item.note?`<small class="item-note">${item.note}</small>`:''}</div><span class="price">$${Number(item.price).toFixed(item.price%1?2:0)}</span></li>`).join('')}</ul>
    </article>`).join('');
  emptyEl.hidden = visible.length>0;
}

cardsEl.addEventListener('click',e=>{
  const card=e.target.closest('[data-category]'); if(!card)return;
  activeCategory=card.dataset.category; renderMenu();
  document.querySelector('#active-title').scrollIntoView({behavior:'smooth',block:'start'});
});
document.addEventListener('click',e=>{if(e.target.id==='clear-filter'){activeCategory='all';renderMenu();}});
searchEl.addEventListener('input',renderMenu);
setRestaurantInfo();createCategoryCards();renderMenu();
