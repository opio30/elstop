# Licencias y pagos — EL STOP 4.2.0

## Para el cliente

1. Instala el EXE 4.2.0; la prueba empieza al abrirlo por primera vez.
2. Puede utilizar el programa durante 10 días naturales completos, incluso sin Internet.
3. Al vencer aparece: **PARA SEGUIR USANDO EL PROGRAMA DEBES COMPRAR LA LICENCIA**.
4. Pulsa Comprar licencia con PayPal. Se abre este enlace en su navegador:
   https://www.paypal.com/ncp/payment/ADWXLBCSBUVMW
5. Tras completar el pago, proporciona a EL STOP el código del equipo y la referencia de la transacción, por tu canal de atención habitual.
6. EL STOP verifica el pago y entrega el código firmado; el cliente lo pega en Activar licencia.

La licencia es permanente para un equipo y funciona sin conexión. No se bloquea
antes de los 10 días por no pagar; se muestra el botón de compra durante la prueba.
Al vencer, el inventario no se elimina y se mantiene la opción de exportarlo.

## Para EL STOP: emitir la licencia

Desde la misma carpeta usada para compilar, conserva el par de claves original.
Consulta tu cuenta PayPal y comprueba estado completado, receptor, importe,
moneda y que la transacción no se haya utilizado para otra venta. Después:

```powershell
node scripts/emitir-licencia.js --equipo CODIGO_DEL_EQUIPO --transaccion REFERENCIA_PAYPAL --pago-verificado
```

El código se imprime y se guarda con su referencia en `owner-records/`, fuera de Git
 y del instalador. El indicador `--pago-verificado` es una confirmación del propietario;
no consulta la API de PayPal. No entregues tu clave privada al cliente ni la subas.
No cambies la clave en cada actualización: invalidaría las licencias emitidas.

## Límites de esta versión

- No hay validación automática del pago ni emisión automática desde PayPal.
  Para ello se necesita un servidor del propietario con credenciales PayPal,
  verificación de webhooks/capturas y emisión protegida de licencias.
- El precio y la moneda corresponden al enlace de pago del propietario.
  No se comprobó una compra ni se realizaron pagos durante el desarrollo.
- El control offline guarda dos copias del comienzo de prueba y detecta retrocesos
  importantes del reloj. No puede impedir que un usuario avanzado borre ambas
  copias, modifique el código o manipule el sistema. No ofrece protección absoluta.
- El código de equipo es un hash local de MachineGuid en Windows, con alternativa
  de nombre de equipo/usuario si no se puede leer. No se envía automáticamente.
- La fecha y el estado se guardan en las carpetas locales de la aplicación y
  ELSTOP-Licencias. Mantener los datos preserva el estado al reinstalar.
- La URL de actualización no aparece en la interfaz, pero se puede recuperar
  del paquete. No es un secreto ni una credencial.
- No hay revocación remota automática de licencias por reembolsos.

## Actualizaciones

La aplicación instalada busca nuevas releases públicas y estables al abrir.
No requiere introducir direcciones. Descarga e instala con el mecanismo Electron;
las releases en borrador no se detectan. Se conserva appId, nombre e inventario.
Se muestran los estados de búsqueda/descarga; no se muestran direcciones ni detalles
internos de error. El bloqueo por licencia no impide actualizar.

## Publicar 4.2.0

Compila en Windows, prueba instalación/impresoras y licencia, y adjunta EXE,
blockmap, latest.yml y SHA256SUMS.txt de la misma compilación a una release
v4.2.0. Nunca reutilices el EXE 4.1.0 ni reemplaces sus archivos por los de 4.2.0.
Antes de hacer pública una clave nueva y su instalador, respalda la clave privada.
