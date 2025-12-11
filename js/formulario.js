export default function inicializarFormulario () {
    document.addEventListener('DOMContentLoaded', function() {
    const contactoForm = document.getElementById('contacto-form');
    
    if (contactoForm) {
        contactoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();
            
            if (!nombre || !email || !mensaje) {
                alert('Por favor, completa todos los campos obligatorios (*)');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Por favor, introduce un email válido');
                return;
            }
            
            // Simulación de envío
            mostrarNotificacionExito('¡Mensaje enviado correctamente! Te contactaremos pronto.');
            
            // Limpiar formulario
            contactoForm.reset();
        });
    }
    
    // Función para validar email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Función para mostrar notificación de éxito
    function mostrarNotificacionExito(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notificacion.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                <span>${mensaje}</span>
            </div>
        `;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notificacion.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    document.body.removeChild(notificacion);
                }
            }, 300);
        }, 3000);
    }
});
}