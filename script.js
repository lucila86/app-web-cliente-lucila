/* ==========================================================================
   miu miu - carrito de compra
   El carrito se guarda en localStorage, así que sigue ahí aunque cambies de
   página o cierres la pestaña. La primera vez que se entra arranca con los
   productos de ejemplo (CARRITO_INICIAL).
   ========================================================================== */

// Catálogo: código, nombre, tipo, precio y la página de detalle de cada uno.
// Es la única fuente de verdad de los precios, el HTML no los repite.
var PRODUCTOS = {
    'MM-1042': { nombre: 'Bandolera Roma', tipo: 'Bandolera / crossbody', precio: 45000, ficha: 'producto-roma.html' },
    'MM-1043': { nombre: 'Bandolera Firenze', tipo: 'Bandolera / crossbody', precio: 52000, ficha: 'producto-firenze.html' },
    'MM-1044': { nombre: 'Cartera de mano Amsterdam', tipo: 'De mano', precio: 38000, ficha: 'producto-amsterdam.html' },
    'MM-1045': { nombre: 'Clutch Verona', tipo: 'De mano', precio: 33500, ficha: 'producto-verona.html' },
    'MM-1046': { nombre: 'Monedero Milan', tipo: 'Monederos', precio: 18000, ficha: 'producto-milan.html' },
    'MM-1047': { nombre: 'Monedero Osaka', tipo: 'Monederos', precio: 21500, ficha: 'producto-osaka.html' },
    'MM-1048': { nombre: 'Cartera de viaje Sydney', tipo: 'De viaje / weekend', precio: 89000, ficha: 'producto-sydney.html' },
    'MM-1049': { nombre: 'Weekend bag Toronto', tipo: 'De viaje / weekend', precio: 95000, ficha: 'producto-toronto.html' }
};

// Productos con los que arranca el carrito en la primera visita.
var CARRITO_INICIAL = [
    { codigo: 'MM-1042', cantidad: 2 },
    { codigo: 'MM-1045', cantidad: 1 },
    { codigo: 'MM-1046', cantidad: 3 },
    { codigo: 'MM-1049', cantidad: 1 }
];

var CLAVE = 'miumiu-carrito';
var ENVIO = 8500;
var CUPON_VALIDO = 'PRIMERA10';
var DESCUENTO = 0.10;

var $ = function (selector) { return document.querySelector(selector); };

// ---------------------------------------------------------- guardar/leer ---

function leerCarrito() {
    var guardado = localStorage.getItem(CLAVE);
    if (guardado === null) {
        return CARRITO_INICIAL.slice();
    }
    try {
        return JSON.parse(guardado);
    } catch (error) {
        return CARRITO_INICIAL.slice();
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE, JSON.stringify(carrito));
}

function pesos(numero) {
    return '$' + numero.toLocaleString('es-AR');
}

// -------------------------------------------------------------- totales ----

function calcular() {
    var carrito = leerCarrito();
    var unidades = 0;
    var subtotal = 0;

    for (var i = 0; i < carrito.length; i++) {
        var producto = PRODUCTOS[carrito[i].codigo];
        unidades += carrito[i].cantidad;
        subtotal += producto.precio * carrito[i].cantidad;
    }

    // El código de descuento se aplica solo al escribirlo bien.
    var cupon = $('#cupon') ? $('#cupon').value.trim().toUpperCase() : '';
    var descuento = cupon === CUPON_VALIDO ? Math.round(subtotal * DESCUENTO) : 0;

    // El retiro en el taller no tiene costo de envío.
    var entrega = $('input[name="entrega"]:checked');
    var envio = (carrito.length > 0 && (!entrega || entrega.value !== 'taller')) ? ENVIO : 0;

    return {
        productos: carrito.length,
        unidades: unidades,
        subtotal: subtotal,
        descuento: descuento,
        envio: envio,
        total: subtotal - descuento + envio
    };
}

// --------------------------------------------------------------- pintado ---

function opcionesCantidad(cantidad) {
    var html = '';
    for (var n = 1; n <= 5; n++) {
        html += '<option value="' + n + '"' + (n === cantidad ? ' selected' : '') + '>' + n + '</option>';
    }
    return html;
}

function filaProducto(item) {
    var producto = PRODUCTOS[item.codigo];
    return '<tr>' +
        '<th scope="row">' +
            '<a href="' + producto.ficha + '">' + producto.nombre + '</a><br>' +
            '<span>' + producto.tipo + '</span>' +
        '</th>' +
        '<td>' + pesos(producto.precio) + '</td>' +
        '<td>' +
            '<select data-cantidad="' + item.codigo + '" aria-label="Cantidad de ' + producto.nombre + '">' +
                opcionesCantidad(item.cantidad) +
            '</select>' +
        '</td>' +
        '<td>' + pesos(producto.precio * item.cantidad) + '</td>' +
        '<td>' +
            '<button type="button" class="enlace-boton" data-quitar="' + item.codigo + '"' +
                ' aria-label="Quitar ' + producto.nombre + ' del carrito">Quitar</button>' +
        '</td>' +
    '</tr>';
}

function pintarTabla() {
    var cuerpo = $('#carrito-items');
    var carrito = leerCarrito();

    if (carrito.length === 0) {
        cuerpo.innerHTML =
            '<tr><td colspan="5" class="carrito__vacio">' +
            'Tu carrito está vacío. ' +
            '<a href="index.html#catalogo">Mirá el catálogo</a> para agregar productos.' +
            '</td></tr>';
    } else {
        cuerpo.innerHTML = carrito.map(filaProducto).join('');
    }
}

function pintarTotales() {
    var t = calcular();

    $('#total-unidades').textContent = t.unidades;
    $('#total-subtotal').textContent = pesos(t.subtotal);
    $('#total-descuento').textContent = t.descuento > 0 ? '−' + pesos(t.descuento) : '—';
    $('#total-envio').textContent = t.envio > 0 ? pesos(t.envio) : 'Sin cargo';
    $('#total-total').textContent = pesos(t.total);
    $('#carrito-conteo').textContent = t.productos + ' producto' + (t.productos === 1 ? '' : 's') +
        ' en tu carrito, ' + t.unidades + ' unidad' + (t.unidades === 1 ? '' : 'es');

    // Sin productos no tiene sentido finalizar la compra.
    $('#carrito__checkout').hidden = t.productos === 0;
}

function pintar() {
    pintarTabla();
    pintarTotales();
}

// ------------------------------------------------------ búsqueda y filtros ---

// Pasa el texto a minúsculas y le saca los acentos, así "Roma" encuentra
// "Roma" y "búsqueda" encuentra "busqueda".
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// Convierte "$45.000" en el número 45000.
function precioDe(tarjeta) {
    var precio = tarjeta.querySelector('.producto__precio');
    return precio ? Number(precio.textContent.replace(/[^0-9]/g, '')) : 0;
}

function nombreDe(tarjeta) {
    var nombre = tarjeta.querySelector('.producto__nombre');
    return nombre ? nombre.textContent.trim() : '';
}

// Reordena las tarjetas según la opción elegida en "Ordenar por".
function ordenarProductos() {
    var catalogo = $('#catalogo');
    if (!catalogo) { return; }

    var lista = catalogo.querySelector('.productos');
    var selector = $('#orden');
    if (!lista || !selector) { return; }

    var orden = selector.value;
    var tarjetas = Array.prototype.slice.call(lista.children);

    tarjetas.sort(function (a, b) {
        if (orden === 'precio-asc' || orden === 'precio-desc') {
            var diferencia = precioDe(a) - precioDe(b);
            return orden === 'precio-asc' ? diferencia : -diferencia;
        }

        if (orden === 'nombre') {
            return nombreDe(a).localeCompare(nombreDe(b), 'es', { sensitivity: 'base' });
        }

        // Relevancia: el orden original del catálogo.
        return Number(a.dataset.ordenOriginal) - Number(b.dataset.ordenOriginal);
    });

    // Si ya está en ese orden no se toca el DOM.
    var igual = true;
    for (var i = 0; i < tarjetas.length; i++) {
        if (tarjetas[i] !== lista.children[i]) {
            igual = false;
            break;
        }
    }

    if (igual) { return; }

    for (var j = 0; j < tarjetas.length; j++) {
        lista.appendChild(tarjetas[j]);
    }
}

// Lee los tipos de cartera marcados y el material elegido.
function leerCaracteristicas() {
    var tipos = document.querySelectorAll('input[name="tipo"]:checked');
    var material = document.querySelector('input[name="material"]:checked');
    var seleccionados = [];

    for (var i = 0; i < tipos.length; i++) {
        seleccionados.push(tipos[i].value);
    }

    return {
        tipos: seleccionados,
        material: material ? material.value : 'todos'
    };
}

// Lee el rango de precio. null significa "sin límite".
function leerRangoPrecio() {
    var minimo = $('#precio-min');
    var maximo = $('#precio-max');
    var precioMin = minimo && minimo.value !== '' ? Number(minimo.value) : null;
    var precioMax = maximo && maximo.value !== '' ? Number(maximo.value) : null;

    if (precioMin !== null && (isNaN(precioMin) || precioMin < 0)) {
        precioMin = null;
    }
    if (precioMax !== null && (isNaN(precioMax) || precioMax < 0)) {
        precioMax = null;
    }

    return { min: precioMin, max: precioMax };
}

var temporizadorFiltros = null;

function irAlCatalogo() {
    var catalogo = $('#catalogo');
    if (!catalogo) { return; }

    var sinMovimiento = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    catalogo.scrollIntoView({
        behavior: sinMovimiento ? 'auto' : 'smooth',
        block: 'start'
    });
}

// Vuelve a lanzar la animación de entrada en las tarjetas visibles, con el
// mismo escalonado de la carga inicial.
function reiniciarAnimacion() {
    var catalogo = $('#catalogo');
    if (!catalogo) { return; }

    var tarjetas = catalogo.querySelectorAll('.productos > li:not([hidden]) .producto');
    var i;

    for (i = 0; i < tarjetas.length; i++) {
        tarjetas[i].style.animation = 'none';
    }

    // Fuerza al navegador a registrar el cambio antes de volver a animar.
    if (tarjetas.length > 0) {
        void tarjetas[0].offsetWidth;
    }

    for (i = 0; i < tarjetas.length; i++) {
        tarjetas[i].style.animation = '';
        tarjetas[i].style.animationDelay = (i * 0.08) + 's';
    }
}

// Muestra solo las tarjetas que coinciden con la búsqueda y con el rango
// de precio. Los dos filtros se aplican juntos. Si "animar" es true, la
// animación de entrada se repite sobre los resultados.
function aplicarFiltros(animar) {
    var catalogo = $('#catalogo');
    if (!catalogo) { return; }

    ordenarProductos();

    var buscador = $('#buscar');
    var terminos = normalizarTexto(buscador ? buscador.value : '').trim().split(/\s+/);
    var caracteristicas = leerCaracteristicas();
    var rango = leerRangoPrecio();
    var tarjetas = catalogo.querySelectorAll('.productos > li');
    var encontradas = 0;

    // Si la búsqueda está vacía, split devuelve [""]; lo descartamos.
    if (terminos.length === 1 && terminos[0] === '') {
        terminos = [];
    }

    for (var i = 0; i < tarjetas.length; i++) {
        var producto = tarjetas[i].querySelector('.producto');
        var tipo = producto ? producto.dataset.tipo : '';
        var material = producto ? producto.dataset.material : '';
        var contenido = normalizarTexto(tarjetas[i].textContent);
        var precio = precioDe(tarjetas[i]);
        var coincide = true;

        for (var j = 0; j < terminos.length; j++) {
            if (contenido.indexOf(terminos[j]) === -1) {
                coincide = false;
                break;
            }
        }

        if (caracteristicas.tipos.indexOf(tipo) === -1) { coincide = false; }
        if (caracteristicas.material !== 'todos' && material !== caracteristicas.material) {
            coincide = false;
        }
        if (rango.min !== null && precio < rango.min) { coincide = false; }
        if (rango.max !== null && precio > rango.max) { coincide = false; }

        tarjetas[i].hidden = !coincide;
        if (coincide) { encontradas++; }
    }

    var conteo = catalogo.querySelector('.catalogo__conteo');
    if (conteo) {
        conteo.textContent = encontradas + ' cartera' +
            (encontradas === 1 ? '' : 's') + ' para mostrar';
    }

    var vacio = $('#catalogo-vacio');
    if (vacio) {
        vacio.hidden = encontradas !== 0;
    }

    if (animar) {
        window.clearTimeout(temporizadorFiltros);
        reiniciarAnimacion();
    }
}

function initFiltros() {
    var catalogo = $('#catalogo');

    // En las páginas sin catálogo el buscador navega a index.html?q=...
    if (!catalogo) { return; }

    var buscador = $('#buscar');
    var formularioBusqueda = $('.site-header__buscador');
    var formularioFiltros = $('.filtros__form');
    var lista = catalogo.querySelector('.productos');

    // Guardamos el orden original para poder volver a "Relevancia".
    if (lista) {
        for (var i = 0; i < lista.children.length; i++) {
            lista.children[i].dataset.ordenOriginal = i;
        }
    }

    if (buscador) {
        var consulta = new URLSearchParams(window.location.search).get('q') || '';
        buscador.value = consulta;

        // Se espera a que la persona deje de escribir para animar una sola vez.
        buscador.addEventListener('input', function () {
            window.clearTimeout(temporizadorFiltros);
            temporizadorFiltros = window.setTimeout(function () {
                aplicarFiltros(true);
            }, 250);
        });
    }

    if (formularioBusqueda) {
        formularioBusqueda.addEventListener('submit', function (evento) {
            evento.preventDefault();
            aplicarFiltros(true);
            irAlCatalogo();
        });
    }

    if (formularioFiltros) {
        formularioFiltros.addEventListener('submit', function (evento) {
            evento.preventDefault();
            aplicarFiltros(true);
            irAlCatalogo();
        });

        // Al cambiar tipo, material, precio u orden, se aplica solo.
        formularioFiltros.addEventListener('change', function (evento) {
            if (evento.target.name === 'tipo' ||
                evento.target.name === 'material' ||
                evento.target.id === 'precio-min' ||
                evento.target.id === 'precio-max' ||
                evento.target.id === 'orden') {
                aplicarFiltros(true);
            }
        });

        // "Limpiar filtros" vacía los campos después del evento reset.
        formularioFiltros.addEventListener('reset', function () {
            window.clearTimeout(temporizadorFiltros);
            window.setTimeout(function () {
                aplicarFiltros(true);
            }, 0);
        });
    }

    // La primera aplicación no anima: la entrada ya la hace el CSS al cargar.
    aplicarFiltros();
}

// --------------------------------------------------------------- eventos ---

function init() {
    initFiltros();

    if (localStorage.getItem(CLAVE) === null) {
        guardarCarrito(CARRITO_INICIAL);
    }

    // Quitar un producto o vaciar el carrito.
    document.addEventListener('click', function (evento) {
        var quitar = evento.target.closest('[data-quitar]');
        if (quitar) {
            guardarCarrito(leerCarrito().filter(function (item) {
                return item.codigo !== quitar.dataset.quitar;
            }));
            pintar();
            return;
        }

        if (evento.target.closest('#vaciar-carrito')) {
            guardarCarrito([]);
            pintar();
        }
    });

    // Cambiar la cantidad, el código de descuento o la forma de entrega.
    document.addEventListener('change', function (evento) {
        if (evento.target.matches('[data-cantidad]')) {
            var carrito = leerCarrito();
            for (var i = 0; i < carrito.length; i++) {
                if (carrito[i].codigo === evento.target.dataset.cantidad) {
                    carrito[i].cantidad = Number(evento.target.value);
                }
            }
            guardarCarrito(carrito);
            // Solo se recalculan los totales: si se pintara la tabla entera,
            // el <select> perdería el foco mientras lo estás usando.
            pintarTotales();
            return;
        }

        if (evento.target.id === 'cupon' || evento.target.name === 'entrega') {
            pintarTotales();
        }
    });

    // Agregar al carrito desde la ficha de un producto.
    var formAgregar = $('#form-agregar');
    if (formAgregar) {
        formAgregar.addEventListener('submit', function (evento) {
            evento.preventDefault();

            var codigo = formAgregar.querySelector('[name="producto"]').value;
            var cantidad = Number(formAgregar.querySelector('[name="cantidad"]').value) || 1;
            var carrito = leerCarrito();
            var existe = null;

            for (var i = 0; i < carrito.length; i++) {
                if (carrito[i].codigo === codigo) { existe = carrito[i]; }
            }

            if (existe) {
                existe.cantidad += cantidad;
            } else {
                carrito.push({ codigo: codigo, cantidad: cantidad });
            }

            guardarCarrito(carrito);
            window.location.href = 'carrito.html';
        });
    }

    // En el celular los filtros arrancan cerrados para no tapar los productos.
    // Si no hay JS, el <details> se queda abierto y se ven igual.
    if (window.matchMedia) {
        var pantallaChica = window.matchMedia('(max-width: 768px)');

        function ajustarFiltros() {
            var grupos = document.querySelectorAll('.filtros__grupo');
            for (var i = 0; i < grupos.length; i++) {
                if (pantallaChica.matches) {
                    grupos[i].removeAttribute('open');
                } else {
                    grupos[i].setAttribute('open', '');
                }
            }
        }

        ajustarFiltros();
        pantallaChica.addEventListener('change', ajustarFiltros);
    }

    // Esta parte solo corre en la pantalla del carrito.
    if ($('#carrito-items')) {
        pintar();
    }
}

document.addEventListener('DOMContentLoaded', init);
