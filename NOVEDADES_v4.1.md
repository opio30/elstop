# Etiquetas Tienda Pro 4.1.0

- Perfiles para térmicas de 58 y 80 mm, etiquetas 100×50, A4, Carta y medidas personalizadas.
- Márgenes, separación, escala del contenido y columnas automáticas en hojas.
- Impresión en color o monocromática; PDF desde el diálogo de impresión.
- Emojis y texto personalizado; carga de stickers PNG/JPG/WebP hasta 2 MB.
- Nuevos diseños originales: sello inclinado, cartel rojo/amarillo, explosión y descuento.
- Conserva la misma clave del inventario v4 y los ajustes de impresión se guardan localmente.
- Las imágenes personalizadas se cargan para la sesión; vuelve a seleccionarlas al abrir.

## Uso

Abre index.html en Chrome/Edge o compila el proyecto Electron en Windows.
Añade productos a la cola, elige el perfil de impresora y el sticker, y pulsa Imprimir.
Selecciona la impresora real en el diálogo. Usa escala 100%, sin encabezados/pies y
activa gráficos de fondo en impresión de color. Los perfiles no instalan controladores
ni se conectan directamente a USB/Bluetooth. Prueba una etiqueta para calibrar.
En A4/Carta, las filas se distribuyen por página; no se incluyen plantillas de marcas
comerciales preperforadas. Ajusta las medidas a tu papel.

Los diseños son originales inspirados en los estilos de la imagen adjunta. No se
incorporaron capturas con marcas de agua ni imágenes señaladas como bajo licencia.
Excel y códigos de barras siguen usando bibliotecas CDN: requieren Internet.

## Compilación sin publicación

```powershell
npm install
npm run build:win
powershell -NoProfile -File .\scripts\Preparar-Release.ps1
```

No se ha compilado el EXE ni probado con impresoras físicas. No se publicó GitHub.
Usa las notas release-notes/v4.1.0.md para esta nueva entrega.
La sintaxis JavaScript y los perfiles, emojis y copias se verificaron con un DOM
simulado. No se pudo ejecutar la revisión visual en navegador en este entorno.
