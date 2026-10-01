# Instalación en Windows

1. Usa Windows 10 o 11 de 64 bits; esta distribución está configurada para x64.
2. Abre https://github.com/opio30/elstop/releases y selecciona una release estable.
3. Descarga `Etiquetas-Tienda-Pro-4.2.0-x64.exe` (cambia la versión según la release).
4. Opcionalmente, compara su SHA-256 con `SHA256SUMS.txt`:

```powershell
Get-FileHash .\Etiquetas-Tienda-Pro-4.2.0-x64.exe -Algorithm SHA256
```

5. Ejecuta el instalador y sigue sus instrucciones. No necesitas Node.js ni Git.
6. Configura tu impresora térmica de 80 mm mediante su controlador en Windows.
7. Prueba una etiqueta antes de imprimir varias copias.

Si Windows bloquea el archivo, comprueba su origen y firma digital. Esta preparación
no incluye un certificado de firma: no desactives el antivirus para instalarlo.

El programa necesita Internet para buscar y descargar actualizaciones.
Antes de la primera release publicada, la comprobación puede indicar un error.
El error de actualización no debe impedir usar las funciones locales; comprobarlo
forma parte de la revisión del instalador.

Exporta el inventario antes de actualizar. El programa descarga una nueva versión
cuando existe y ofrece instalar/reiniciar; el código original también permite
instalar la actualización descargada al cerrar. No borres los datos de la app.
Para desinstalar usa Configuración > Aplicaciones en Windows.
