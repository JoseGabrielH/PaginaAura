const boxWrappers = document.querySelectorAll('.box-wrapper');
const menuPopup = document.getElementById('menuPopup');
const submenuGain = document.getElementById('submenuGain');
const submenuLose = document.getElementById('submenuLose');
const gainBtn = document.querySelector('.menu-gain-btn');
const loseBtn = document.querySelector('.menu-lose-btn');
const submenuOptions = document.querySelectorAll('.submenu-option');

let currentWrapper = null;

// Inicializar colores en tiempo de carga
function initializeColors() {
    boxWrappers.forEach(wrapper => {
        const numberElement = wrapper.querySelector('.number');
        const boxElement = wrapper.querySelector('.box');
        const nameElement = wrapper.querySelector('.name');
        const currentValue = parseInt(wrapper.dataset.value);
        
        if (currentValue < 0) {
            numberElement.classList.add('negative');
            boxElement.classList.add('negative');
            nameElement.classList.add('negative');
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeColors);

// Mostrar menú al hacer clic en perfil
boxWrappers.forEach(wrapper => {
    wrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        currentWrapper = wrapper;
        
        const rect = wrapper.getBoundingClientRect();
        menuPopup.style.left = (rect.left + rect.width / 2 - 80) + 'px';
        menuPopup.style.top = (rect.top - 200) + 'px';
        
        closeSubmenu();
        menuPopup.classList.remove('hidden');
        menuPopup.classList.add('active');
    });
});

// Mostrar submenú Ganó aura
gainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeSubmenu();
    
    const btnRect = gainBtn.getBoundingClientRect();
    submenuGain.style.left = (btnRect.left + btnRect.width / 2 - 120) + 'px';
    submenuGain.style.top = (btnRect.top + btnRect.height + 15) + 'px';
    
    submenuGain.classList.remove('hidden');
    submenuGain.classList.add('active');
});

// Mostrar submenú Perdió aura
loseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeSubmenu();
    
    const btnRect = loseBtn.getBoundingClientRect();
    submenuLose.style.left = (btnRect.left + btnRect.width / 2 - 120) + 'px';
    submenuLose.style.top = (btnRect.top + btnRect.height + 15) + 'px';
    
    submenuLose.classList.remove('hidden');
    submenuLose.classList.add('active');
});

// Funcionalidad de opciones del submenú
submenuOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (!currentWrapper) return;
        
        const numberElement = currentWrapper.querySelector('.number');
        const boxElement = currentWrapper.querySelector('.box');
        const nameElement = currentWrapper.querySelector('.name');
        
        let currentValue = parseInt(currentWrapper.dataset.value);
        const points = parseInt(option.dataset.points);
        
        currentValue += points;
        currentWrapper.dataset.value = currentValue;
        numberElement.textContent = currentValue;
        
        // Actualizar colores
        if (currentValue < 0) {
            numberElement.classList.add('negative');
            boxElement.classList.add('negative');
            nameElement.classList.add('negative');
        } else {
            numberElement.classList.remove('negative');
            boxElement.classList.remove('negative');
            nameElement.classList.remove('negative');
        }
    });
});

// Cerrar submenú
function closeSubmenu() {
    submenuGain.classList.remove('active');
    submenuLose.classList.remove('active');
    submenuGain.classList.add('hidden');
    submenuLose.classList.add('hidden');
}

// Cerrar menú principal
function closeMenu() {
    menuPopup.classList.add('hidden');
    menuPopup.classList.remove('active');
    closeSubmenu();
}

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
    const isMenuClick = menuPopup.contains(e.target) || e.target.closest('.box-wrapper');
    const isSubmenuClick = submenuGain.contains(e.target) || submenuLose.contains(e.target);
    
    if (!isMenuClick && !isSubmenuClick && menuPopup.classList.contains('active')) {
        closeMenu();
    }
});