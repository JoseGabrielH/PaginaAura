const boxWrappers = document.querySelectorAll('.box-wrapper');
const menuPopup = document.getElementById('menuPopup');
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

// Ejecutar inicialización al cargar la página
document.addEventListener('DOMContentLoaded', initializeColors);

boxWrappers.forEach(wrapper => {
    wrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        currentWrapper = wrapper;
        
        const rect = wrapper.getBoundingClientRect();
        menuPopup.style.left = (rect.left + rect.width / 2 - 60) + 'px';
        menuPopup.style.top = (rect.top - 120) + 'px';
        
        menuPopup.classList.remove('hidden');
        menuPopup.classList.add('active');
    });
});

const menuOptions = document.querySelectorAll('.menu-option');
menuOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (!currentWrapper) return;
        
        const numberElement = currentWrapper.querySelector('.number');
        const boxElement = currentWrapper.querySelector('.box');
        const nameElement = currentWrapper.querySelector('.name');
        let currentValue = parseInt(currentWrapper.dataset.value);
        
        if (option.dataset.action === 'gain') {
            currentValue += 500;
        } else if (option.dataset.action === 'lose') {
            currentValue -= 500;
        }
        
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
        
        // El menú NO se cierra
    });
});

// Cerrar el menú solo cuando se hace clic fuera
document.addEventListener('click', (e) => {
    if (menuPopup.classList.contains('active') && !menuPopup.contains(e.target) && !e.target.closest('.box-wrapper')) {
        closeMenu();
    }
});

function closeMenu() {
    menuPopup.classList.add('hidden');
    menuPopup.classList.remove('active');
    setTimeout(() => {
        menuPopup.classList.remove('hidden');
    }, 300);
}