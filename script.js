const boxWrappers = document.querySelectorAll('.box-wrapper');
const menuPopup = document.getElementById('menuPopup');
let currentWrapper = null;

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
        let currentValue = parseInt(currentWrapper.dataset.value);
        
        if (option.dataset.action === 'gain') {
            currentValue += 500;
        } else if (option.dataset.action === 'lose') {
            currentValue -= 500;
        }
        
        currentWrapper.dataset.value = currentValue;
        numberElement.textContent = currentValue;
        
        // Actualizar color del número y del perfil en tiempo real
        if (currentValue < 0) {
            numberElement.classList.add('negative');
            boxElement.classList.add('negative');
        } else {
            numberElement.classList.remove('negative');
            boxElement.classList.remove('negative');
        }
        
        closeMenu();
    });
});

function closeMenu() {
    menuPopup.classList.add('hidden');
    menuPopup.classList.remove('active');
    setTimeout(() => {
        menuPopup.classList.remove('hidden');
    }, 300);
}

document.addEventListener('click', () => {
    if (menuPopup.classList.contains('active')) {
        closeMenu();
    }
});