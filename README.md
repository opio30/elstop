# Etiquetas Tienda Pro 4.2.0

Diseñado por **EL STOP**. Inventario y etiquetas para Windows x64.

## Nuevo en 4.2

- Actualizaciones automáticas desde GitHub Releases con configuración interna, sin campo URL para el usuario.
- Prueba de 10 días desde el primer inicio; aviso de compra al vencer.
- Botón de compra en PayPal y activación con licencia permanente firmada para un equipo.
- Conservación del inventario y exportación de respaldo incluso con prueba vencida.

El enlace PayPal abre el navegador. **No confirma por sí mismo el pago**. El propietario verifica la transacción y entrega una licencia. El programa no recibe datos de tarjetas ni contraseñas de PayPal.

## Compilar en Windows

```powershell
npm install
npm test
npm run build:win
powershell -NoProfile -File .\scripts\Preparar-Release.ps1
```

La primera compilación genera las claves de licencia. Guarda una copia segura de `owner-keys/license-private.pem` y `resources/license-public.pem`. **Reutiliza el mismo par de claves en todas las versiones futuras.** La clave privada y los registros de venta están excluidos del repositorio y del instalador. El EXE solo recibe la clave pública.

Lee [LICENCIAS_Y_PAGOS.md](docs/LICENCIAS_Y_PAGOS.md) antes de distribuir.
Para firma digital de Windows consulta [FIRMA_EL_STOP.md](FIRMA_EL_STOP.md).
Las claves de licencias son distintas del certificado Authenticode del EXE.

## Estado de distribución

Este repositorio contiene código fuente 4.2.0. Aún no se ha compilado ni publicado su instalador de Windows. La release 4.1.0 existente no se modifica al subir este código. No uses el instalador anterior para anunciar las nuevas funciones.
