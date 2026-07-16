const data = window.MENU_DATA;
const menuEl = document.querySelector('#menu');
const cardsEl = document.querySelector('#category-cards');
const searchEl = document.querySelector('#search');
const emptyEl = document.querySelector('#empty-state');
const activeTitle = document.querySelector('#active-title');
const activeFilter = document.querySelector('#active-filter');
let activeCategory = 'all';

const normalize = value => String(value || '').normalize('NFKD').replace(/[ًٌٍَُِّْـ]/g, '').toLowerCase().trim();

function setRestaurantInfo(){
  document.title = `${data.restaurant.name} | قائمة الطعام`;
  document.querySelector('#restaurant-name').textContent = data.restaurant.name;
  document.querySelector('#restaurant-subtitle').textContent = data.restaurant.subtitle;
  document.querySelector('#season').textContent = data.restaurant.season;
  document.querySelector('#restaurant-note').textContent = `🚫 ${data.restaurant.note}`;
  document.querySelector('#rules').textContent = data.rules;
  document.querySelector('#footer-name').textContent = data.restaurant.name;
  document.querySelector('#phone-buttons').innerHTML = data.restaurant.phones.map(phone => `<a href="tel:${phone}">☎ ${phone}</a>`).join('');
}

function createCategoryCards(){
  const cards = [{id:'all',name:'كل القائمة',icon:'✦',items:data.categories.flatMap(c=>c.items)},...data.categories];
  cardsEl.innerHTML = cards.map((category,index)=>`
    <button class="category-tile ${category.id==='all'?'all':`tone-${((index-1)%9)+1}`}" data-category="${category.id}">
      <span class="icon-wrap">${category.icon}</span>
      <strong>${category.name}</strong>
      <small>${category.items.length} أصناف</small>
    </button>`).join('');
}

function renderMenu(){
  const query = normalize(searchEl.value);
  const selected = data.categories.find(c=>c.id===activeCategory);
  activeTitle.textContent = selected ? selected.name : 'جميع الأصناف';
  activeFilter.hidden = activeCategory==='all';
  activeFilter.innerHTML = selected ? `القسم المختار: ${selected.icon} ${selected.name} — <button id="clear-filter">عرض كل القائمة</button>` : '';

  const visible = data.categories
    .filter(c=>activeCategory==='all'||c.id===activeCategory)
    .map(c=>({...c,items:c.items.filter(item=>normalize(`${item.name} ${item.note||''}`).includes(query))}))
    .filter(c=>c.items.length);

  menuEl.innerHTML = visible.map(category=>`
    <article class="category-card">
      <header class="category-head"><span class="category-icon">${category.icon}</span><h2>${category.name}</h2></header>
      <ul class="item-list">${category.items.map(item=>`
        <li class="menu-item"><div><span class="item-name">${item.name}</span>${item.note?`<small class="item-note">${item.note}</small>`:''}</div><span class="price">$${Number(item.price).toFixed(item.price%1?2:0)}</span></li>`).join('')}</ul>
    </article>`).join('');
  emptyEl.hidden = visible.length>0;
}

cardsEl.addEventListener('click',e=>{
  const card=e.target.closest('[data-category]'); if(!card)return;
  activeCategory=card.dataset.category; renderMenu();
  document.querySelector('#menu-start').scrollIntoView({behavior:'smooth',block:'start'});
});

document.addEventListener('click',e=>{if(e.target.id==='clear-filter'){activeCategory='all';renderMenu();}});
searchEl.addEventListener('input',renderMenu);

setRestaurantInfo();createCategoryCards();renderMenu();
