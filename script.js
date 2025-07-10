
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

// Mostrar/ocultar formularios según confirmación
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
        document.getElementById('nombre-no').removeAttribute('required');
    } else if (confirmacion === 'no') {
        formularioAsistencia.classList.add('hidden');
        formNoAsistencia.classList.remove('hidden');
        thankYouMessage.classList.add('hidden');
        asistenciaInput.value = 'No';
        document.getElementById('nombre').removeAttribute('required');
        document.getElementById('edad').removeAttribute('required');
        document.getElementById('email').removeAttribute('required');
        document.getElementById('nombre-no').setAttribute('required', '');
    } else {
        formularioAsistencia.classList.add('hidden');
        formNoAsistencia.classList.add('hidden');
        thankYouMessage.classList.add('hidden');
        asistenciaInput.value = '';
    }
});

// Generar dinámicamente los campos de acompañantes
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
// Envío del formulario unificado
document.getElementById('attendance-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const confirmacion = document.getElementById('confirmacion').value;
    
    // Mostrar spinner solo cuando se envía el formulario
    document.getElementById('loading-spinner').classList.remove('hidden');
    
    // Deshabilitar el botón de enviar para evitar múltiples envíos
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    if (confirmacion === 'si') {
        const nombre = document.getElementById('nombre').value;
        const edad = document.getElementById('edad').value;
        const email = document.getElementById('email').value;
        if (!nombre || !edad || !email) {
            Swal.fire('Faltan datos', 'Completa todos los campos obligatorios', 'warning');
            document.getElementById('loading-spinner').classList.add('hidden');
            submitButton.disabled = false;
            return;
        }
        const numAcompanantes = parseInt(document.getElementById('acompanantes').value);
        for (let i = 1; i <= numAcompanantes; i++) {
            const n = document.getElementById(`acompanante_nombre_${i}`)?.value;
            const e = document.getElementById(`acompanante_edad_${i}`)?.value;
            if (!n || !e) {
                Swal.fire('Faltan datos', `Completa los datos del acompañante ${i}`, 'warning');
                document.getElementById('loading-spinner').classList.add('hidden');
                submitButton.disabled = false;
                return;
            }
        }
    } else if (confirmacion === 'no') {
        const nombreNo = document.getElementById('nombre-no').value;
        if (!nombreNo.trim()) {
            Swal.fire('Faltan datos', 'Ingresa tu nombre para registrar tu respuesta', 'warning');
            document.getElementById('loading-spinner').classList.add('hidden');
            submitButton.disabled = false;
            return;
        }
    }

    const formData = new FormData(form);
    fetch("https://script.google.com/macros/s/AKfycbxwuf7eUxHX9k5nySkgzPARVr53FXWC42Bs3kPVKpi-lXGLg8CzyXw2-k9Hp1PamH5Gtw/exec", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Ocultar spinner cuando la respuesta es recibida
        document.getElementById('loading-spinner').classList.add('hidden');
        submitButton.disabled = false;
        
        if (data.result === "success") {
            const nombreFinal = confirmacion === 'no'
                ? document.getElementById('nombre-no').value
                : document.getElementById('nombre').value;

            const mensaje = confirmacion === 'no'
                ? 'Lamentamos que no puedas asistir, pero agradecemos que nos hayas informado. Esperamos verte en otra ocasión.'
                : 'Nos alegra mucho que nos acompañes en nuestro día especial. Te esperamos el 16 de Agosto, 2025.';

            document.getElementById('nombre-invitado').textContent = nombreFinal;
            document.getElementById('confirmacion-mensaje').textContent = mensaje;
            document.getElementById('thank-you-message').classList.remove('hidden');
            document.getElementById('formulario-asistencia').classList.add('hidden');
            document.getElementById('form-no-asistencia').classList.add('hidden');

            Swal.fire({
                icon: 'success',
                title: '¡Confirmación enviada!',
                text: 'Gracias por confirmar tu asistencia 🎉'
            });

            form.reset();
        } else {
            Swal.fire('Error', 'Ocurrió un problema al enviar. Intenta de nuevo.', 'error');
        }
    })
    .catch(error => {
        console.error(error);
        // Ocultar spinner si hay error
        document.getElementById('loading-spinner').classList.add('hidden');
        submitButton.disabled = false;
        Swal.fire('Error de conexión', 'No se pudo conectar con el servidor', 'error');
    });
});



// Menú responsive
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// Cambiar estilo del navbar al hacer scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});