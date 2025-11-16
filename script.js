const boxWrappers = document.querySelectorAll('.box-wrapper');
const menuPopup = document.getElementById('menuPopup');
const submenuGain = document.getElementById('submenuGain');
const submenuLose = document.getElementById('submenuLose');
let currentWrapper = null;
let activeSubmenu = null;

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

// Ejecutar inicialización al cargar la página
document.addEventListener('DOMContentLoaded', initializeColors);

boxWrappers.forEach(wrapper => {
    wrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        currentWrapper = wrapper;
        
        const rect = wrapper.getBoundingClientRect();
        menuPopup.style.left = (rect.left + rect.width / 2 - 60) + 'px';
        menuPopup.style.top = (rect.top - 160) + 'px';
        
        closeSubmenu();
        menuPopup.classList.remove('hidden');
        menuPopup.classList.add('active');
    });
});

// Botones del menú principal
const gainMainBtn = document.querySelector('.menu-gain-main');
const loseMainBtn = document.querySelector('.menu-lose-main');

gainMainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openSubmenu(submenuGain, e);
});

loseMainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openSubmenu(submenuLose, e);
});

// Funciones para manejar submenús
function openSubmenu(submenu, triggerEvent) {
    closeSubmenu();
    
    const triggerRect = triggerEvent.target.getBoundingClientRect();
    submenu.style.left = (triggerRect.left + triggerRect.width / 2 - 80) + 'px';
    submenu.style.top = (triggerRect.top + triggerRect.height + 10) + 'px';
    
    submenu.classList.remove('hidden');
    submenu.classList.add('active');
    activeSubmenu = submenu;
}

function closeSubmenu() {
    submenuGain.classList.remove('active');
    submenuLose.classList.remove('active');
    submenuGain.classList.add('hidden');
    submenuLose.classList.add('hidden');
    activeSubmenu = null;
}

// Opciones del submenú
const submenuOptions = document.querySelectorAll('.submenu-option');
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
        
        // Actualizar color del número, nombre y perfil en tiempo real
        if (currentValue < 0) {
            numberElement.classList.add('negative');
            boxElement.classList.add('negative');
            nameElement.classList.add('negative');
        } else {
            numberElement.classList.remove('negative');
            boxElement.classList.remove('negative');
            nameElement.classList.remove('negative');
        }
        
        // El submenú NO se cierra
    });
});

// Cerrar el menú solo cuando se hace clic fuera
document.addEventListener('click', (e) => {
    const isMenuClick = menuPopup.contains(e.target) || e.target.closest('.box-wrapper');
    const isSubmenuClick = (submenuGain.contains(e.target) || submenuLose.contains(e.target));
    
    if (!isMenuClick && !isSubmenuClick && menuPopup.classList.contains('active')) {
        closeMenu();
    }
    
    if (!isSubmenuClick && !isMenuClick && activeSubmenu) {
        closeSubmenu();
    }
});

function closeMenu() {
    menuPopup.classList.add('hidden');
    menuPopup.classList.remove('active');
    closeSubmenu();
    setTimeout(() => {
        menuPopup.classList.remove('hidden');
    }, 300);
}