# Diseñado por EL STOP · versión 4.2.0

El nombre aparece en el encabezado y pie del programa; no se imprime en etiquetas.
El autor y el copyright del ejecutable se configuran como EL STOP. Se conserva
appId, productName y la clave de inventario para mantener la continuidad.

## Firma digital del EXE

No se ha firmado un ejecutable en esta entrega. Para un editor verificado en Windows
necesitas un certificado de firma de código emitido para tu identidad o empresa por
una entidad de confianza (o un servicio de firma compatible). El titular mostrado
por Windows procede del certificado; escribir EL STOP en package.json no lo cambia.
Un certificado autofirmado no da confianza pública ni elimina avisos de SmartScreen.
La firma legítima tampoco garantiza que desaparezcan todos los avisos de reputación.

## Con un certificado PFX compatible

En Windows, con Node.js y las dependencias instaladas:

```powershell
npm install
powershell -NoProfile -File .\scripts\Compilar-Firmado.ps1 -CertificatePath "C:\Certificados\editor.pfx"
```

La contraseña se solicita de forma oculta. No subas el PFX, la clave privada ni su
contraseña a GitHub ni los envíes por chat. Este flujo requiere un certificado cuya
clave sea accesible mediante PFX; si tu proveedor usa token o firma en la nube,
configura su integración específica con electron-builder en su lugar.

El script exige firma, verifica la confianza de Windows y genera SHA256SUMS.txt.
No publica nada. Revisa los datos del firmante y el sello de tiempo en Propiedades
> Firmas digitales. Un fallo de confianza requiere investigar antes de distribuir.

## Compilar solo la marca visual, sin certificado

```powershell
npm install
npm run build:win
```

Esto añade el nombre EL STOP, pero no garantiza firma digital. No anuncies editor
verificado si no se firmó con un certificado válido.

Publica el resultado como nueva release v4.2.0, con su EXE, blockmap, latest.yml y
SHA256SUMS.txt de la misma compilación. No firmes a posteriori ni reemplaces el EXE
4.1.0 publicado sin regenerar metadatos: la firma cambia los bytes y los hashes.

Referencias: https://www.electron.build/v26/docs/features/code-signing/code-signing-win/
https://www.electron.build/v26/docs/features/code-signing/

Validado: sintaxis JavaScript y JSON. La compilación y el script de firma requieren
Windows y certificado; no se ejecutaron en este entorno.
