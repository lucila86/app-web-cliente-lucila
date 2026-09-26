## Descripción

Hice una pagina html de carteras de la marca conocida "miu miu", con maquetado, un carrito funcional y diseño responsive.

- Catálogo (index.html): encabezado con marca, navegación y buscador; sección de presentación; grilla de 8 carteras filtrable (tipo, precio, material y orden) y pie de página.
- Fichas de producto (8 páginas): una por producto con descripción, ficha técnica (código, tipo, medidas alto × largo × fondo, largo de correa, material, forro, fecha de presentación y disponibilidad), cuidados y 3 productos relacionados.
- Carrito (carrito.html): tabla de productos con cantidad editable, resumen del pedido con subtotal, descuento, envío y total, más el botón de finalizar compra.
- Contacto (contacto.html): datos del taller, horarios, formulario de consulta y 4 preguntas frecuentes desplegables.
- Diseño: paleta dorado y marrón sobre crema, tipografía serif para títulos y sans para el texto, esquinas rectas y líneas finas. Responsive con un breakpoint en 768px: los filtros se pliegan dentro de un desplegable, los botones miden 44px de alto y las fotos ocupan siempre el ancho de la tarjeta.

Archivos agregados:
- producto-roma.html, producto-firenze.html, producto-amsterdam.html, producto-verona.html, producto-milan.html, producto-osaka.html, producto-sydney.html, producto-toronto.html.
- img/ con las 8 fotos de producto (jpg, 900×1125 px, proporción 4:5).
- predicciones.md con el avance planned de cada etapa.
## Cómo probarlo

bash
git clone https://github.com/lucila86/app-web-cliente-lucila.git
cd app-web-cliente-lucila
git checkout feature/css-template
python -m http.server 8000
Después abrir http://localhost:8000. También funciona con doble clic en index.html.

- 1. Catálogo — los 8 productos con foto. Al hacer clic en cualquier parte de la tarjeta (foto o nombre) abrís la ficha del producto.
- 2. Filtros —tipo, precio, material y ordenar. Proba el desplegable de filtros.
- 3. Carrito — entra desde el encabezado. Cambia una cantidad y mira que se actualicen las unidades, el subtotal y el total al instante. Saca un producto con "Quitar" y después usar "Vaciar carrito": tiene que quedar el mensaje de carrito vacío y desaparecer el botón de finalizar compra. Recargar la página: el carrito sigue igual
- 4. Descuento y envío — escribí PRIMERA10 en el código de descuento y después elegí "Retiro en el taller": el envío pasa a "Sin cargo" y el total se recalcula.
- 5. Agregar al carrito — entrar a la ficha de cualquier producto, ponr una cantidad y presionar "Agregar al carrito": te manda al carrito con el producto ya cargado.
- 6. Contacto — el formulario tiene los campos obligatorios y el desplegable de preguntas frecuentes.

## Prompt usado y historial con Open Code

Pegá todo el histórico de mensajes con el agente de IA:

```
voy a crear un proyecto de tienda de carteras para una materia de la universidad. la idea es solo construir el esqueleto de puro HTML con etiquetas semánticas para la vista principal de la web, que tendrá un encabezado, una sección principal con distinto tipo de carteras, una seccion de filtros y un footer. solo trabaja en el index por ahora.
que se pueda hacer click en el producto de los  catalogos desde index.html y de momento los productos son fijos en el html.
crear el html puro de la pantalla del carrito (quiero que el carrito tenga productos agregados para finalizar compra). Y otra pagina html para el contacto de clientes. en los dos casos solo usar html sin js, sin estilos y usar etiquetas semanticas y toda la estructura completa de la web con el mismo header y footer que las demas.
maquetar con css en archivo externo (style.css) el index.htmml y elementos repetitivos como header, footer. nav.

no usar reglas css muy complejas pero que sea responsive y sea un diseño minimalista, fancy como lo es la marca miu miu y usando como color principal variantes del dorado y marron.
al darle click a cada producto del catalogo tenga su respectivo detalle (por ejemplo: altura, largo, fondo, el codigo del producto etc, y una descripcion minima de su tela y cuando fue presentado).
que el carrito.html y contacto.html tenga la misma estructura, colores (etc) que index.html.
cuando le das a quitar a un producto se elimine del carrito, y cuando le das a vaciar carrito se eliminen todos los productos en el carrito.
```

## Checklist antes de enviar

- [x] Trabajé en una rama propia (no directo en `main`).
- [x] Probé que mi código/archivo funciona antes de subirlo.
- [x] Este PR es dentro de mi propio repositorio.
- [x] Completé todos los datos de esta plantilla.

## Comentarios adicionales (opcional)

Dudas, aclaraciones o algo que quieras comentarle al profesor.## Descripción

Hice una pagina html de carteras de la marca conocida "miu miu", con maquetado, un carrito funcional y diseño responsive.

- Catálogo (index.html): encabezado con marca, navegación y buscador; sección de presentación; grilla de 8 carteras filtrable (tipo, precio, material y orden) y pie de página.
- Fichas de producto (8 páginas): una por producto con descripción, ficha técnica (código, tipo, medidas alto × largo × fondo, largo de correa, material, forro, fecha de presentación y disponibilidad), cuidados y 3 productos relacionados.
- Carrito (carrito.html): tabla de productos con cantidad editable, resumen del pedido con subtotal, descuento, envío y total, más el botón de finalizar compra.
- Contacto (contacto.html): datos del taller, horarios, formulario de consulta y 4 preguntas frecuentes desplegables.
- Diseño: paleta dorado y marrón sobre crema, tipografía serif para títulos y sans para el texto, esquinas rectas y líneas finas. Responsive con un breakpoint en 768px: los filtros se pliegan dentro de un desplegable, los botones miden 44px de alto y las fotos ocupan siempre el ancho de la tarjeta.

Archivos agregados:
- producto-roma.html, producto-firenze.html, producto-amsterdam.html, producto-verona.html, producto-milan.html, producto-osaka.html, producto-sydney.html, producto-toronto.html.
- img/ con las 8 fotos de producto (jpg, 900×1125 px, proporción 4:5).
- predicciones.md con el avance planned de cada etapa.
## Cómo probarlo

bash
git clone https://github.com/lucila86/app-web-cliente-lucila.git
cd app-web-cliente-lucila
git checkout feature/css-template
python -m http.server 8000
Después abrir http://localhost:8000. También funciona con doble clic en index.html.

- 1. Catálogo — los 8 productos con foto. Al hacer clic en cualquier parte de la tarjeta (foto o nombre) abrís la ficha del producto.
- 2. Filtros —tipo, precio, material y ordenar. Proba el desplegable de filtros.
- 3. Carrito — entra desde el encabezado. Cambia una cantidad y mira que se actualicen las unidades, el subtotal y el total al instante. Saca un producto con "Quitar" y después usar "Vaciar carrito": tiene que quedar el mensaje de carrito vacío y desaparecer el botón de finalizar compra. Recargar la página: el carrito sigue igual
- 4. Descuento y envío — escribí PRIMERA10 en el código de descuento y después elegí "Retiro en el taller": el envío pasa a "Sin cargo" y el total se recalcula.
- 5. Agregar al carrito — entrar a la ficha de cualquier producto, ponr una cantidad y presionar "Agregar al carrito": te manda al carrito con el producto ya cargado.
- 6. Contacto — el formulario tiene los campos obligatorios y el desplegable de preguntas frecuentes.

## Prompt usado y historial con Open Code

Pegá todo el histórico de mensajes con el agente de IA:

```
voy a crear un proyecto de tienda de carteras para una materia de la universidad. la idea es solo construir el esqueleto de puro HTML con etiquetas semánticas para la vista principal de la web, que tendrá un encabezado, una sección principal con distinto tipo de carteras, una seccion de filtros y un footer. solo trabaja en el index por ahora.
que se pueda hacer click en el producto de los  catalogos desde index.html y de momento los productos son fijos en el html.
crear el html puro de la pantalla del carrito (quiero que el carrito tenga productos agregados para finalizar compra). Y otra pagina html para el contacto de clientes. en los dos casos solo usar html sin js, sin estilos y usar etiquetas semanticas y toda la estructura completa de la web con el mismo header y footer que las demas.
maquetar con css en archivo externo (style.css) el index.htmml y elementos repetitivos como header, footer. nav.

no usar reglas css muy complejas pero que sea responsive y sea un diseño minimalista, fancy como lo es la marca miu miu y usando como color principal variantes del dorado y marron.
al darle click a cada producto del catalogo tenga su respectivo detalle (por ejemplo: altura, largo, fondo, el codigo del producto etc, y una descripcion minima de su tela y cuando fue presentado).
que el carrito.html y contacto.html tenga la misma estructura, colores (etc) que index.html.
cuando le das a quitar a un producto se elimine del carrito, y cuando le das a vaciar carrito se eliminen todos los productos en el carrito.
```

## Checklist antes de enviar

- [x] Trabajé en una rama propia (no directo en `main`).
- [x] Probé que mi código/archivo funciona antes de subirlo.
- [x] Este PR es dentro de mi propio repositorio.
- [x] Completé todos los datos de esta plantilla.

## Comentarios adicionales (opcional)

Dudas, aclaraciones o algo que quieras comentarle al profesor.
