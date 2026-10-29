document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("open-cart-btn");
    const cartSlide = document.getElementById("cart-slide");
    const cartOverlay = document.getElementById("cart-overlay");
    let pendingOrderData = null;

    // Inyectar la estructura fija dentro del contenedor #cart-slide si existe
    if (cartSlide) {
        cartSlide.innerHTML = `
            <div class="cart-header">
                <h2>Detalle de tu pedido</h2>
                <button id="close-cart-btn" aria-label="Cerrar">&times;</button>
            </div>

            <div id="cart-items-container"></div>

            <div class="cart-summary">
                <div class="cart-total">
                    <span>TOTAL <small>(items:<span id="items-count">0</span>)</small></span>
                    <span id="cart-total-price">$ 0,00</span>
                </div>
            </div>

            <button type="button" id="back-to-menu-btn">⏱ Volver al listado</button>

            <form id="order-form">
                <div class="form-section-title">👤 Completa tus datos</div>

                <div class="form-group">
                    <label for="fullname">¿Cuál es tu nombre y apellido?</label>
                    <input type="text" id="fullname" placeholder="" required>
                </div>

                <div class="form-group">
                    <label>¿Te lo enviamos o lo retirás?</label>
                    <div class="radio-group">
                        <label class="radio-pill">
                            <input type="radio" name="delivery_type" value="envio" checked>
                            Quiero que me lo envien
                        </label>
                        <label class="radio-pill">
                            <input type="radio" name="delivery_type" value="retiro">
                            Lo retiro yo mismo
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label for="payment_method">Forma de Pago</label>
                    <select id="payment_method" required>
                        <option value="" disabled selected>Seleccione</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Mercado Pago">Mercado Pago</option>
                        <option value="Tarjeta de Débito/Crédito">Tarjeta de Débito/Crédito</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="comments">¿Comentarios / Aclaración?</label>
                    <textarea id="comments" maxlength="200" rows="3"></textarea>
                    <div class="char-counter"><span id="char-count">0</span>/200</div>
                </div>

                <button type="submit" class="submit-btn">💬 Enviar pedido</button>
            </form>
        `;
    }

    // Elementos inyectados
    const closeBtn = document.getElementById("close-cart-btn");
    const backBtn = document.getElementById("back-to-menu-btn");
    const commentsInput = document.getElementById("comments");
    const charCount = document.getElementById("char-count");
    const itemsContainer = document.getElementById("cart-items-container");
    const itemsCountSpan = document.getElementById("items-count");
    const cartTotalPrice = document.getElementById("cart-total-price");
    const orderForm = document.getElementById("order-form");

    // Crear modal de confirmación dinámicamente si no existe
    let orderModal = document.getElementById("order-modal");
    if (!orderModal) {
        orderModal = document.createElement("dialog");
        orderModal.id = "order-modal";
        orderModal.innerHTML = `
            <h3>¿Confirmar pedido?</h3>
            <p>Se abrirá WhatsApp para enviar el detalle a la sucursal.</p>
            <div class="modal-actions">
                <button type="button" id="modal-back-btn">Volver</button>
                <button type="button" id="modal-whatsapp-btn">Enviar a WhatsApp</button>
            </div>
        `;
        document.body.appendChild(orderModal);
    }

    const modalBackBtn = document.getElementById("modal-back-btn");
    const modalWhatsappBtn = document.getElementById("modal-whatsapp-btn");

    function obtenerCarritoActual() {
        const carritoGuardado = localStorage.getItem('carrito_olivia');
        if (!carritoGuardado) return [];
        const datos = JSON.parse(carritoGuardado);
        return Object.values(datos).map(item => ({
            nombre: item.nombre,
            cantidad: item.cantidad,
            precioUnitario: item.precio || item.precioUnitario || 0
        }));
    }

    function renderCart(items) {
        if (!itemsContainer) return;
        itemsContainer.innerHTML = "";
        let total = 0;
        let totalItems = 0;

        if (items.length === 0) {
            itemsContainer.innerHTML = `<p style="text-align: center; color: #888; margin: 15px 0;">El carrito está vacío</p>`;
            itemsCountSpan.textContent = 0;
            cartTotalPrice.textContent = "$ 0,00";
            return;
        }

        items.forEach(item => {
            const subtotal = item.cantidad * item.precioUnitario;
            total += subtotal;
            totalItems += item.cantidad;

            const itemHTML = `
                <div class="cart-item">
                    <div class="item-info">
                        <p>${item.nombre}</p>
                        <span>Cant.: ${item.cantidad} x $${item.precioUnitario}</span>
                    </div>
                    <div class="item-price">$ ${subtotal.toLocaleString("es-AR")}</div>
                </div>
            `;
            itemsContainer.innerHTML += itemHTML;
        });

        itemsCountSpan.textContent = totalItems;
        cartTotalPrice.textContent = `$ ${total.toLocaleString("es-AR")},00`;
    }

    function openCart() {
        renderCart(obtenerCarritoActual());
        if (cartSlide) cartSlide.classList.add("active");
        if (cartOverlay) cartOverlay.classList.add("active");
    }

    function closeCart() {
        if (cartSlide) cartSlide.classList.remove("active");
        if (cartOverlay) cartOverlay.classList.remove("active");
    }

    if (openBtn) openBtn.addEventListener("click", openCart);
    if (closeBtn) closeBtn.addEventListener("click", closeCart);
    if (backBtn) backBtn.addEventListener("click", closeCart);
    if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

    window.addEventListener('carritoActualizado', () => {
        if (cartSlide && cartSlide.classList.contains("active")) {
            renderCart(obtenerCarritoActual());
        }
    });

    if (commentsInput && charCount) {
        commentsInput.addEventListener("input", (e) => {
            charCount.textContent = e.target.value.length;
        });
    }

    if (orderForm) {
        orderForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const itemsActuales = obtenerCarritoActual();

            if (itemsActuales.length === 0) {
                alert("Tu carrito está vacío.");
                return;
            }

            const nombre = document.getElementById("fullname").value;
            const tipoEntrega = document.querySelector('input[name="delivery_type"]:checked').value;
            const pago = document.getElementById("payment_method").value;
            const comentarios = commentsInput ? commentsInput.value.trim() : "";

            pendingOrderData = {
                nombre,
                tipoEntrega: tipoEntrega === "envio" ? "📦 Envío a domicilio" : "🏃 Retiro en local",
                pago,
                comentarios: comentarios !== "" ? comentarios : null,
                items: itemsActuales
            };

            closeCart();
            orderModal.showModal();
        });
    }

    if (modalBackBtn) {
        modalBackBtn.addEventListener("click", () => {
            orderModal.close();
            openCart();
        });
    }

    if (modalWhatsappBtn) {
        modalWhatsappBtn.addEventListener("click", () => {
            if (!pendingOrderData) return;

            const telefonoLocal = "5491133876028";
            let mensaje = "*¡Hola! Nuevo Pedido 🛒*\n\n";
            mensaje += `👤 *Cliente:* ${pendingOrderData.nombre}\n`;
            mensaje += `📍 *Método:* ${pendingOrderData.tipoEntrega}\n`;
            mensaje += `💵 *Pago:* ${pendingOrderData.pago}\n\n`;
            mensaje += "📋 *Detalle del pedido:*\n";

            let totalGeneral = 0;
            pendingOrderData.items.forEach((item) => {
                const subtotal = item.cantidad * item.precioUnitario;
                totalGeneral += subtotal;
                mensaje += `• ${item.cantidad}x ${item.nombre} ($${subtotal.toLocaleString("es-AR")})\n`;
            });

            mensaje += `\n💰 *TOTAL:* $${totalGeneral.toLocaleString("es-AR")},00\n`;
            if (pendingOrderData.comentarios) {
                mensaje += `📝 *Aclaraciones:* ${pendingOrderData.comentarios}`;
            }

            const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefonoLocal}&text=${encodeURIComponent(mensaje)}`;
            window.open(urlWhatsApp, "_blank", "noopener,noreferrer");
            orderModal.close();
        });
    }
});