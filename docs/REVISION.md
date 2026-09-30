# Revisión antes de distribuir

- Confirmar la licencia propietaria y condiciones de uso para clientes.
- Ejecutar npm install en Windows y revisar dependencias con npm audit.
- Incluir package-lock.json y comprobar una compilación limpia con npm ci.
- Instalar el EXE en Windows x64 y probar inicio, productos, importación/exportación
  y etiqueta térmica de 80 mm; probar persistencia al cerrar/abrir.
- Exportar un inventario de prueba y verificar que puede recuperarse.
- Revisar búsqueda de actualizaciones sin conexión y antes de existir releases.
- Comprobar actualización real 4.0.0 a una versión superior en una máquina de prueba,
  verificando conservación de datos. Un borrador no permite probar detección pública.
- Confirmar que latest.yml corresponde al EXE y que los hashes son correctos.
- Revisar dependencias y sus avisos de licencia incluidos en la distribución.
- Considerar firma digital antes de distribuir comercialmente.

## Validación de esta entrega

Se revisaron el ZIP original, package.json, los scripts Electron y la configuración
para GitHub. Se conserva la interfaz y el código de ejecución original. No se han
instalado dependencias, generado lockfile, compilado el EXE ni probado en Windows.
No se incluye un ejecutable, certificado digital, instalador probado ni workflow
que publique automáticamente. El script PowerShell requiere validación en Windows.

## Instalador recibido el 30 de septiembre de 2026

Se recibió VERSION4.1.rar con el instalador 4.1.0, su blockmap y latest.yml. Se verificaron el tamaño y el SHA-512 del instalador contra latest.yml. No se ejecutó el instalador en Windows. El código fuente de este repositorio procede del proyecto preparado; no se ha comprobado byte a byte contra el código empaquetado del instalador.
