const data = window.MENU_DATA;
const menuEl = document.querySelector('#menu');
const tabsEl = document.querySelector('#category-tabs');
const searchEl = document.querySelector('#search');
const emptyEl = document.querySelector('#empty-state');
let activeCategory = 'all';

const normalize = value => String(value || '')
  .normalize('NFKD')
  .replace(/[ًٌٍَُِّْـ]/g, '')
  .toLowerCase()
  .trim();

function setRestaurantInfo() {
  document.title = `${data.restaurant.name} | قائمة الطعام`;
  document.querySelector('#restaurant-name').textContent = data.restaurant.name;
  document.querySelector('#restaurant-subtitle').textContent = data.restaurant.subtitle;
  document.querySelector('#season').textContent = data.restaurant.season;
  document.querySelector('#restaurant-note').textContent = `🚫 ${data.restaurant.note}`;
  document.querySelector('#rules').textContent = data.rules;
  document.querySelector('#footer-name').textContent = data.restaurant.name;
  const phoneWrap = document.querySelector('#phone-buttons');
  phoneWrap.innerHTML = data.restaurant.phones.map(phone =>
    `<a href="tel:${phone}" aria-label="اتصال على ${phone}">☎ ${phone}</a>`
  ).join('');
}

function createTabs() {
  const tabs = [{ id: 'all', name: 'الكل', icon: '☰' }, ...data.categories];
  tabsEl.innerHTML = tabs.map(tab => `
    <button class="category-tab ${tab.id === activeCategory ? 'active' : ''}" data-category="${tab.id}">
      ${tab.icon || ''} ${tab.name}
    </button>`).join('');
}

function renderMenu() {
  const query = normalize(searchEl.value);
  const visibleCategories = data.categories
    .filter(category => activeCategory === 'all' || category.id === activeCategory)
    .map(category => ({
      ...category,
      items: category.items.filter(item => normalize(`${item.name} ${item.note || ''}`).includes(query))
    }))
    .filter(category => category.items.length > 0);

  menuEl.innerHTML = visibleCategories.map(category => `
    <article class="category-card" id="category-${category.id}">
      <header class="category-head">
        <span class="category-icon">${category.icon}</span>
        <h2>${category.name}</h2>
      </header>
      <ul class="item-list">
        ${category.items.map(item => `
          <li class="menu-item">
            <div>
              <span class="item-name">${item.name}</span>
              ${item.note ? `<small class="item-note">${item.note}</small>` : ''}
            </div>
            <span class="price">$${Number(item.price).toFixed(item.price % 1 ? 2 : 0)}</span>
          </li>`).join('')}
      </ul>
    </article>`).join('');

  emptyEl.hidden = visibleCategories.length > 0;
}

tabsEl.addEventListener('click', event => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  activeCategory = button.dataset.category;
  createTabs();
  renderMenu();
});
searchEl.addEventListener('input', renderMenu);

setRestaurantInfo();
createTabs();
renderMenu();
