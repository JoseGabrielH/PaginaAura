const boxWrappers = document.querySelectorAll('.box-wrapper');
const menuPopup = document.getElementById('menuPopup');
const submenuGain = document.getElementById('submenuGain');
const submenuLose = document.getElementById('submenuLose');
const gainBtn = document.querySelector('.menu-gain-btn');
const loseBtn = document.querySelector('.menu-lose-btn');
const submenuOptions = document.querySelectorAll('.submenu-option');

// Elementos de audio
const clickSound = document.getElementById('clickSound');
const successSound = document.getElementById('successSound');

// Elementos de sugerencias
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const submitButtons = document.querySelectorAll('.submit-btn');
const gainTextarea = document.getElementById('gainSuggestion');
const loseTextarea = document.getElementById('loseSuggestion');
const gainCount = document.getElementById('gainCount');
const loseCount = document.getElementById('loseCount');

let currentWrapper = null;

// Constante para el prefijo de localStorage
const STORAGE_PREFIX = 'aura_';

// Función para obtener valor de localStorage
function getStoredValue(name) {
    const stored = localStorage.getItem(STORAGE_PREFIX + name);
    return stored !== null ? parseInt(stored) : 1000;
}

// Función para guardar valor en localStorage
function saveValue(name, value) {
    localStorage.setItem(STORAGE_PREFIX + name, value);
}

// Función para reproducir sonido
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(err => console.log('Error al reproducir sonido:', err));
}

function playSuccessSound() {
    successSound.currentTime = 0;
    successSound.play().catch(err => console.log('Error al reproducir sonido:', err));
}

// Función para agregar animación al botón
function animateButton(button, type) {
    button.classList.remove('animate-gain', 'animate-lose');
    void button.offsetWidth; // Trigger reflow para resetear la animación
    
    if (type === 'gain') {
        button.classList.add('animate-gain');
    } else if (type === 'lose') {
        button.classList.add('animate-lose');
    }
}

// Función para actualizar colores según valor
function updateProfileColors(wrapper, value) {
    const numberElement = wrapper.querySelector('.number');
    const boxElement = wrapper.querySelector('.box');
    const nameElement = wrapper.querySelector('.name');
    
    if (value < 0) {
        numberElement.classList.add('negative');
        boxElement.classList.add('negative');
        nameElement.classList.add('negative');
    } else {
        numberElement.classList.remove('negative');
        boxElement.classList.remove('negative');
        nameElement.classList.remove('negative');
    }
}

// Inicializar valores desde localStorage
function initializeFromStorage() {
    boxWrappers.forEach(wrapper => {
        const nameElement = wrapper.querySelector('.name');
        const numberElement = wrapper.querySelector('.number');
        const profileName = nameElement.textContent;
        
        // Obtener valor del localStorage o usar default
        const storedValue = getStoredValue(profileName);
        
        // Actualizar el atributo data-value
        wrapper.dataset.value = storedValue;
        
        // Actualizar el número mostrado
        numberElement.textContent = storedValue;
        
        // Actualizar colores
        updateProfileColors(wrapper, storedValue);
    });
}

document.addEventListener('DOMContentLoaded', initializeFromStorage);

// ========== FUNCIONALIDAD DE SUGERENCIAS ==========

// Contador de caracteres
gainTextarea.addEventListener('input', () => {
    gainCount.textContent = gainTextarea.value.length;
});

loseTextarea.addEventListener('input', () => {
    loseCount.textContent = loseTextarea.value.length;
});

// Sistema de tabs
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remover clase active de todos los botones y contenidos
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Agregar clase active al botón y contenido seleccionado
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
        
        playClickSound();
    });
});

// Enviar sugerencias
submitButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const type = button.getAttribute('data-type');
        const textarea = type === 'gain' ? gainTextarea : loseTextarea;
        const feedbackDiv = type === 'gain' ? document.getElementById('gainFeedback') : document.getElementById('loseFeedback');
        const suggestion = textarea.value.trim();
        
        if (!suggestion) {
            showFeedback(feedbackDiv, 'Por favor escribe una sugerencia', 'error');
            return;
        }
        
        playClickSound();
        button.classList.add('sending');
        button.disabled = true;
        
        try {
            // Enviar al servidor
            const response = await fetch('save_suggestion.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: type,
                    suggestion: suggestion,
                    timestamp: new Date().toLocaleString('es-ES')
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                playSuccessSound();
                showFeedback(feedbackDiv, '✨ ¡Sugerencia guardada exitosamente!', 'success');
                textarea.value = '';
                
                if (type === 'gain') {
                    gainCount.textContent = '0';
                } else {
                    loseCount.textContent = '0';
                }
                
                // Limpiar feedback después de 3 segundos
                setTimeout(() => {
                    feedbackDiv.textContent = '';
                    feedbackDiv.className = 'feedback-message';
                }, 3000);
            } else {
                showFeedback(feedbackDiv, '❌ Error al guardar la sugerencia', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showFeedback(feedbackDiv, '❌ Error de conexión', 'error');
        } finally {
            button.classList.remove('sending');
            button.disabled = false;
        }
    });
});

// Función para mostrar feedback
function showFeedback(element, message, type) {
    element.textContent = message;
    element.className = `feedback-message ${type}`;
}

// ========== FUNCIONALIDAD ORIGINAL DE AURA ==========

// Mostrar menú al hacer clic en perfil
boxWrappers.forEach(wrapper => {
    wrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        playClickSound();
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
    playClickSound();
    animateButton(gainBtn, 'gain');
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
    playClickSound();
    animateButton(loseBtn, 'lose');
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
        playSuccessSound();
        
        if (!currentWrapper) return;
        
        const numberElement = currentWrapper.querySelector('.number');
        const boxElement = currentWrapper.querySelector('.box');
        const nameElement = currentWrapper.querySelector('.name');
        const profileName = nameElement.textContent;
        
        let currentValue = parseInt(currentWrapper.dataset.value);
        const points = parseInt(option.dataset.points);
        
        currentValue += points;
        currentWrapper.dataset.value = currentValue;
        numberElement.textContent = currentValue;
        
        // Guardar en localStorage
        saveValue(profileName, currentValue);
        
        // Determinar tipo de animación
        const animationType = points > 0 ? 'gain' : 'lose';
        
        // Agregar animación al número
        numberElement.classList.remove('number-gain', 'number-lose');
        void numberElement.offsetWidth; // Trigger reflow
        numberElement.classList.add(animationType === 'gain' ? 'number-gain' : 'number-lose');
        
        // Agregar animación al perfil
        boxElement.classList.remove('box-gain', 'box-lose');
        void boxElement.offsetWidth; // Trigger reflow
        boxElement.classList.add(animationType === 'gain' ? 'box-gain' : 'box-lose');
        
        // Actualizar colores
        updateProfileColors(currentWrapper, currentValue);
        
        // Cerrar menú después de actualizar
        closeMenu();
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