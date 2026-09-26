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

// --------------------------------------------------------------- eventos ---

function init() {
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
