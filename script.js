const contenedor = document.getElementById('contenedor');
const cuadroCruz = document.getElementById('cuadroCruz');
let contador = 0;

cuadroCruz.addEventListener('click', function() {
    const nuevoCuadro = document.createElement('div');
    nuevoCuadro.className = 'cuadro';
    contenedor.insertBefore(nuevoCuadro, contenedor.firstChild);
    
    contador++;
    
    if (contador === 1) {
        cuadroCruz.classList.remove('cruz');
    }
    
    nuevoCuadro.addEventListener('click', function() {
        agregarCuadro.call(nuevoCuadro);
    });
});

function agregarCuadro() {
    const nuevoCuadro = document.createElement('div');
    nuevoCuadro.className = 'cuadro';
    contenedor.insertBefore(nuevoCuadro, this);
    
    nuevoCuadro.addEventListener('click', function() {
        agregarCuadro.call(nuevoCuadro);
    });
}