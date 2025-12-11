import initDarkMode from './js/darkmode.js';
import inicializarFormulario from './js/formulario.js';
    
    // Inicializar modo oscuro
    initDarkMode();

    // inicializar formulario
    inicializarFormulario();
    
    // Toggle para menú móvil
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Cambiar icono del botón
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Cerrar menú móvil al hacer clic en un enlace
        const mobileLinks = document.querySelectorAll('#mobile-menu a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Función para cargar y mostrar las pizzas desde JSON
async function cargarMenu() {
    const container = document.getElementById('pizzas-container');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    
    try {
        const response = await fetch('./data/pizzas.json');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const menuData = await response.json();
        
        if (loader) loader.classList.add('hidden');
        renderizarPizzas(menuData.pizzas);
        configurarFiltros(menuData.pizzas);
        
    } catch (error) {
        console.error('Error al cargar el menú:', error);
        
        if (loader) loader.classList.add('hidden');
        
        if (errorMessage && errorText) {
            errorText.textContent = `Error al cargar el menú: ${error.message}`;
            errorMessage.classList.remove('hidden');
        }
        
        mostrarDatosEjemplo();
    }
}
    
    // Función para renderizar las pizzas
    function renderizarPizzas(pizzas) {
        const container = document.getElementById('pizzas-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (pizzas.length === 0) {
            container.innerHTML = `
                <div class="col-span-3 text-center py-12">
                    <p class="text-gray-600 dark:text-gray-300">No hay pizzas disponibles en este momento.</p>
                </div>
            `;
            return;
        }
        
        pizzas.forEach(pizza => {
            const pizzaCard = document.createElement('div');
            pizzaCard.className = 'pizza-card bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden';
            pizzaCard.setAttribute('data-category', pizza.categoria);
            
            pizzaCard.innerHTML = `
                <div class="relative overflow-hidden h-48">
                    <img src="${pizza.imagen}" alt="${pizza.nombre}" class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500">
                    ${pizza.popular ? `
                    <div class="absolute top-4 right-4 bg-pizza-red text-white px-3 py-1 rounded-full text-sm font-bold">
                        <i class="fas fa-fire mr-1"></i> Popular
                    </div>` : ''}
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white">${pizza.nombre}</h3>
                        <span class="text-lg font-bold text-pizza-red">$${pizza.precio.toFixed(2)}</span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">${pizza.descripcion}</p>
                    <div class="mb-4">
                        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Ingredientes principales:</p>
                        <p class="text-gray-700 dark:text-gray-300">${pizza.ingredientes.join(', ')}</p>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <i class="fas fa-clock text-gray-500 dark:text-gray-400 mr-1"></i>
                            <span class="text-sm text-gray-600 dark:text-gray-300">${pizza.tiempoPreparacion} min</span>
                        </div>
                        <button class="añadir-carrito-btn bg-pizza-red hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors" data-id="${pizza.id}">
                            <i class="fas fa-cart-plus mr-2"></i> Añadir
                        </button>
                    </div>
                </div>
            `;
            
            container.appendChild(pizzaCard);
        });
        
        // Añadir eventos a los botones de añadir al carrito
        document.querySelectorAll('.añadir-carrito-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const pizzaId = this.getAttribute('data-id');
                añadirAlCarrito(pizzaId);
            });
        });
    }
    
    // Función para configurar los filtros
    function configurarFiltros(pizzas) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover clase activa de todos los botones
                filterButtons.forEach(b => {
                    b.classList.remove('bg-pizza-red', 'text-white');
                    b.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-300');
                });
                
                // Añadir clase activa al botón clickeado
                this.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-300');
                this.classList.add('bg-pizza-red', 'text-white');
                
                const categoria = this.getAttribute('data-category');
                
                // Filtrar pizzas
                let pizzasFiltradas;
                if (categoria === 'todas') {
                    pizzasFiltradas = pizzas;
                } else {
                    pizzasFiltradas = pizzas.filter(pizza => pizza.categoria === categoria);
                }
                
                // Renderizar pizzas filtradas
                renderizarPizzas(pizzasFiltradas);
            });
        });
    }
    
   
   
    // Función para mostrar notificaciones
    function mostrarNotificacion(mensaje) {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notificacion.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                <span>${mensaje}</span>
            </div>
        `;
        
        document.body.appendChild(notificacion);
        
        // Animación de entrada
        setTimeout(() => {
            notificacion.style.transform = 'translateX(0)';
        }, 10);
        
        // Animación de salida después de 3 segundos
        setTimeout(() => {
            notificacion.style.transform = 'translateX(100%)';
            
            // Eliminar del DOM después de la animación
            setTimeout(() => {
                if (notificacion.parentNode) {
                    document.body.removeChild(notificacion);
                }
            }, 300);
        }, 3000);
    }
    
    // Función para mostrar datos de ejemplo como fallback

function mostrarDatosEjemplo() {
    const datosEmergencia = crearDatosEmergencia();
    const container = document.getElementById('pizzas-container');
    const loader = document.getElementById('loader');
    
    if (loader) loader.classList.add('hidden');
    
    if (container) {
        renderizarPizzas(datosEmergencia.pizzas);
        configurarFiltros(datosEmergencia.pizzas);
        
        const advertencia = document.createElement('div');
        advertencia.className = 'col-span-3 text-center p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg mb-4';
        advertencia.innerHTML = `
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <span>Mostrando datos de ejemplo. No se pudo cargar el archivo pizzas.json.</span>
        `;
        
        container.prepend(advertencia);
    }
}
    // Cargar el menú cuando la página esté lista
    document.addEventListener('DOMContentLoaded', cargarMenu);