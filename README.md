# Etiquetas Tienda Pro

Programa de escritorio para Windows para gestionar productos e imprimir etiquetas
de precios. Repositorio: https://github.com/opio30/elstop

**Estado:** estructura inicial preparada para revisión. Versión del proyecto: 4.1.0.
El usuario ha proporcionado el instalador 4.1.0 compilado. Su tamaño y hash SHA-512 coinciden con latest.yml. Pendiente de prueba de instalación en Windows y publicación de la release.

## Funciones

- Inventario local, búsqueda, creación, edición y eliminación de productos.
- Importación y exportación del inventario.
- Etiquetas para impresora térmica de 80 mm y varias copias.
- Precios grandes, nombre del negocio y promociones.
- Actualizador de escritorio configurado para GitHub Releases.

## Descargar e instalar

Cuando exista una versión publicada, descarga el instalador `.exe` desde
[Releases](https://github.com/opio30/elstop/releases).
Consulta [instalación](docs/INSTALACION.md). Los ZIP “Source code” no son instaladores.

## Estructura

| Ruta | Propósito |
| --- | --- |
| index.html | Interfaz y funciones del programa original |
| main.js | Ventana Electron y actualizador |
| preload.js | Puente entre interfaz y escritorio |
| package.json | Dependencias, versión y configuración NSIS/GitHub |
| package-lock.json | Se genera con npm install; incluir antes del primer commit |
| COMPILAR_EN_WINDOWS.bat | Compilación local sin publicar |
| scripts/Preparar-Release.ps1 | Validación de los archivos y SHA-256 |
| docs/INSTALACION.md | Guía para usuarios |
| docs/PRIMERA_RELEASE.md | Comandos de preparación y publicación separados |
| docs/REVISION.md | Comprobaciones previas y límites de esta entrega |
| release-notes/v4.1.0.md | Texto para la primera release |
| CHANGELOG.md | Historial del proyecto |
| LICENSE | Derechos reservados; mantiene UNLICENSED |
| dist/ | Archivos compilados; excluidos de Git |

## Preparar en Windows

Instala Git, Node.js LTS compatible con las dependencias y GitHub CLI.
Desde esta carpeta:

```powershell
npm install
npm start
npm run build:win
powershell -NoProfile -File .\scripts\Preparar-Release.ps1
```

`npm install` crea el archivo de bloqueo. Inclúyelo en el primer commit; las
compilaciones posteriores deben usar `npm ci`. Los comandos de compilación
usan `--publish never`. No se requieren tokens para compilar.

## Primera release y siguientes versiones

Sigue [PRIMERA_RELEASE.md](docs/PRIMERA_RELEASE.md). La primera etiqueta será
`v4.1.0`, consistente con el proyecto existente. Para otra versión, aumenta
`package.json`, actualiza el lockfile y prepara nuevas notas antes de compilar.

## Datos y actualizaciones

El inventario se guarda localmente. Exporta una copia antes de actualizar o
reinstalar. Mantén `appId` y `productName` para conservar la ubicación de datos.
El actualizador consulta releases públicas; las releases en borrador no son
visibles para los usuarios. No incorpora acceso remoto de soporte.

## Licencia

Propietaria; todos los derechos reservados. Este borrador no otorga una licencia
de uso al comprador: antes de distribuir comercialmente, define esas condiciones.
Las licencias de Electron y demás dependencias se deben conservar.

Consulta [Novedades v4.1](NOVEDADES_v4.1.md) para los nuevos formatos y stickers.
