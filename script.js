// Countdown
function updateCountdown() {
    const weddingDate = new Date('August 16, 2025 16:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerHTML = days;
    document.getElementById('hours').innerHTML = hours;
    document.getElementById('minutes').innerHTML = minutes;
    document.getElementById('seconds').innerHTML = seconds;

    if (distance < 0) {
        clearInterval(countdownTimer);
        document.getElementById('countdown').innerHTML = "¡Hoy es el gran día!";
    }
}

const countdownTimer = setInterval(updateCountdown, 1000);
updateCountdown();

// Configurar fecha actual
document.getElementById('fecha').value = new Date().toLocaleDateString();

// Lógica del formulario de asistencia
document.getElementById('confirmacion').addEventListener('change', function() {
    const confirmacion = this.value;
    const formularioAsistencia = document.getElementById('formulario-asistencia');
    const formNoAsistencia = document.getElementById('form-no-asistencia');
    const thankYouMessage = document.getElementById('thank-you-message');
    const asistenciaInput = document.getElementById('asistencia');
    
    if (confirmacion === 'si') {
        formularioAsistencia.classList.remove('hidden');
        formNoAsistencia.classList.add('hidden');
        thankYouMessage.classList.add('hidden');
        asistenciaInput.value = 'Sí';
        
        // Remover atributo required del campo nombre-no cuando no es visible
        document.getElementById('nombre-no').removeAttribute('required');
    } else if (confirmacion === 'no') {
        formularioAsistencia.classList.add('hidden');
        formNoAsistencia.classList.remove('hidden');
        thankYouMessage.classList.add('hidden');
        asistenciaInput.value = 'No';
        
        // Remover atributo required de los campos del formulario de asistencia
        document.getElementById('nombre').removeAttribute('required');
        document.getElementById('edad').removeAttribute('required');
        document.getElementById('email').removeAttribute('required');
        
        // Agregar required al campo nombre-no cuando es visible
        document.getElementById('nombre-no').setAttribute('required', '');
    } else {
        formularioAsistencia.classList.add('hidden');
        formNoAsistencia.classList.add('hidden');
        thankYouMessage.classList.add('hidden');
        asistenciaInput.value = '';
    }
});

// Manejar el envío del formulario cuando la respuesta es "No"
document.getElementById('form-no-asistencia').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre-no').value;
    if (nombre.trim() === '') {
        alert('Por favor ingresa tu nombre para registrar tu respuesta');
        return;
    }
    
    // Mostrar mensaje de agradecimiento
    document.getElementById('nombre-invitado').textContent = nombre;
    document.getElementById('confirmacion-mensaje').textContent = 
        'Lamentamos que no puedas asistir, pero agradecemos que nos hayas informado. Esperamos verte en otra ocasión.';
    document.getElementById('thank-you-message').classList.remove('hidden');
    document.getElementById('form-no-asistencia').classList.add('hidden');
    
    // Enviar el formulario después de 2 segundos
    setTimeout(() => {
        document.getElementById('attendance-form').submit();
    }, 2000);
});

// Manejar el número de acompañantes
document.getElementById('acompanantes').addEventListener('change', function() {
    const numAcompanantes = parseInt(this.value);
    const container = document.getElementById('acompanantes-container');
    
    container.innerHTML = '';
    
    for (let i = 1; i <= numAcompanantes; i++) {
        const acompananteGroup = document.createElement('div');
        acompananteGroup.className = 'acompanante-group';
        acompananteGroup.innerHTML = `
            <h4>Acompañante ${i}</h4>
            <div class="form-group">
                <label for="acompanante_nombre_${i}">Nombre completo</label>
                <input type="text" id="acompanante_nombre_${i}" name="Acompanante_Nombre_${i}" required>
            </div>
            <div class="form-group">
                <label for="acompanante_edad_${i}">Edad</label>
                <input type="number" id="acompanante_edad_${i}" name="Acompanante_Edad_${i}" min="1" max="120" required>
            </div>
        `;
        container.appendChild(acompananteGroup);
    }
});

// Manejar el envío del formulario cuando la respuesta es "Sí"
document.getElementById('formulario-asistencia').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validación de campos principales
    const nombre = document.getElementById('nombre').value;
    const edad = document.getElementById('edad').value;
    const email = document.getElementById('email').value;
    
    if (!nombre || !edad || !email) {
        alert('Por favor completa todos los campos requeridos.');
        return false;
    }
    
    // Validación de acompañantes
    const numAcompanantes = parseInt(document.getElementById('acompanantes').value);
    for (let i = 1; i <= numAcompanantes; i++) {
        const nombreAcomp = document.getElementById(`acompanante_nombre_${i}`)?.value;
        const edadAcomp = document.getElementById(`acompanante_edad_${i}`)?.value;
        
        if (!nombreAcomp || !edadAcomp) {
            alert(`Por favor completa todos los datos del acompañante ${i}.`);
            return false;
        }
    }
    
    // Mostrar mensaje de confirmación
    document.getElementById('nombre-invitado').textContent = nombre;
    document.getElementById('confirmacion-mensaje').textContent = 
        'Nos alegra mucho que nos acompañes en nuestro día especial. Te esperamos el 16 de Agosto, 2025.';
    document.getElementById('thank-you-message').classList.remove('hidden');
    document.getElementById('formulario-asistencia').classList.add('hidden');
    
    // Enviar el formulario después de 2 segundos
    setTimeout(() => {
        document.getElementById('attendance-form').submit();
    }, 2000);
});

// Menú responsivo
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Cambiar estilo del menú al hacer scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Cerrar menú al hacer click en un enlace (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// Suavizar scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});