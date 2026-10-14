document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("open-cart-btn");
    const closeBtn = document.getElementById("close-cart-btn");
    const backBtn = document.getElementById("back-to-menu-btn");
    const cartSlide = document.getElementById("cart-slide");
    const cartOverlay = document.getElementById("cart-overlay");
    const commentsInput = document.getElementById("comments");
    const charCount = document.getElementById("char-count");
    
    const itemsContainer = document.getElementById("cart-items-container");
    const itemsCountSpan = document.getElementById("items-count");
    const cartTotalPrice = document.getElementById("cart-total-price");
    const orderForm = document.getElementById("order-form");

    // Datos de ejemplo mapeados (simulando lo que luego vendrá del componente padre/estado global)
    const carritoEjemplo = [
        { nombre: "Empanada carne", cantidad: 3, precioUnitario: 1500 },
        { nombre: "Empanada J y Q", cantidad: 3, precioUnitario: 1500 }
    ];

    // Función para renderizar los ítems y calcular el total dinámicamente
    function renderCart(items) {
        itemsContainer.innerHTML = "";
        let total = 0;
        let totalItems = 0;

        items.forEach(item => {
            const subtotal = item.cantidad * item.precioUnitario;
            total += subtotal;
            totalItems += item.cantidad;

            const itemHTML = `
                <div class="cart-item">
                    <div class="item-info">
                        <p>${item.nombre}</p>
                        <span>cant ${item.cantidad} x $${item.precioUnitario}</span>
                    </div>
                    <div class="item-price">$${subtotal}</div>
                </div>
            `;
            itemsContainer.innerHTML += itemHTML;
        });

        itemsCountSpan.textContent = totalItems;
        cartTotalPrice.textContent = `$ ${total.toLocaleString("es-AR")},00`;
    }

    // Inicializar con los datos de ejemplo
    renderCart(carritoEjemplo);

    // Funciones para abrir/cerrar el slide
    function openCart() {
        cartSlide.classList.add("active");
        cartOverlay.classList.add("active");
    }

    function closeCart() {
        cartSlide.classList.remove("active");
        cartOverlay.classList.remove("active");
    }

    openBtn.addEventListener("click", openCart);
    closeBtn.addEventListener("click", closeCart);
    backBtn.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    // Contador de caracteres para el textarea de comentarios
    commentsInput.addEventListener("input", (e) => {
        const currentLength = e.target.value.length;
        charCount.textContent = currentLength;
    });

    // Manejar el envío del formulario (Simulación de armado de mensaje para WhatsApp)
    orderForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = document.getElementById("fullname").value;
        const tipoEntrega = document.querySelector('input[name="delivery_type"]:checked').value;
        const pago = document.getElementById("payment_method").value;
        const comentarios = commentsInput.value;

        // Aquí puedes estructurar el mensaje que se enviaría por WhatsApp
        console.log({
            nombre,
            tipoEntrega,
            pago,
            comentarios,
            items: carritoEjemplo
        });

        alert("¡Pedido listo para enviar por WhatsApp! (Revisa la consola para ver los datos)");
    });
});