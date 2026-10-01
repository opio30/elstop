# Primera release: comandos PowerShell

Los comandos se entregan para revisión. No se ejecutó ningún push, tag remoto ni
creación de release. Incluso una release en borrador escribe en GitHub.

## 1. Preparación local, sin publicar

Extrae el ZIP entregado y entra en la carpeta `elstop`.
No inicialices otro repositorio si esta carpeta ya está dentro de uno.

```powershell
git init -b main
git remote add origin https://github.com/opio30/elstop.git
npm install
npm start
npm run build:win
powershell -NoProfile -File .\scripts\Preparar-Release.ps1
git status --short
git add .
git diff --cached --stat
git diff --cached
```

Cierra la ventana de `npm start` para continuar. Revisa LICENSE, la identidad del
autor, la interfaz y los resultados de docs/REVISION.md. `dist/` y `node_modules/`
no deben aparecer en el commit. El lockfile debe estar incluido.
Si Git pide identidad, configura tu nombre y correo antes de continuar.

```powershell
git commit -m "chore: preparar Etiquetas Tienda Pro 4.2.0"
```

Este commit es local. Puedes detenerte aquí para revisar todo sin modificar GitHub.
Si el remoto dejó de estar vacío, revisa sus cambios antes de subir; no uses force.

## 2. Publicar el primer commit — solo después de aprobarlo

```powershell
gh auth login
git push -u origin main
```

Git puede necesitar su propio inicio de sesión o `gh auth setup-git`.
No guardes contraseñas ni tokens en los archivos del proyecto.

## 3. Crear etiqueta y release EN BORRADOR — también modifica GitHub

Confirma que compilaste esta misma versión y este mismo commit.

```powershell
$Version = (Get-Content .\package.json -Raw | ConvertFrom-Json).version
$Tag = "v$Version"
$Exe = ".\dist\Etiquetas-Tienda-Pro-$Version-x64.exe"
git tag -a $Tag -m "Etiquetas Tienda Pro $Version"
git push origin $Tag
gh release create $Tag $Exe "$Exe.blockmap" .\dist\latest.yml .\dist\SHA256SUMS.txt --repo opio30/elstop --verify-tag --draft --title "Etiquetas Tienda Pro $Version" --notes-file ".\release-notes\$Tag.md"
gh release view $Tag --repo opio30/elstop --web
```

Sube exactamente el EXE, su blockmap, `latest.yml` y `SHA256SUMS.txt` generados
en la misma compilación. No edites a mano el hash o el nombre en latest.yml.
No subas `win-unpacked/`, credenciales, `node_modules/` ni toda la carpeta dist.
El script de preparación falla si no existe latest.yml: resuelve la compilación
antes de crear la release, sin activar publicación automática.

## 4. Publicar el borrador — paso final separado

Después de revisar archivos, notas e instalación:

```powershell
gh release edit $Tag --repo opio30/elstop --draft=false --latest
gh release view $Tag --repo opio30/elstop --web
```

Solo después de este paso los usuarios pueden descargar la release pública y
el actualizador puede detectarla. Para 4.2.1: `npm version patch --no-git-tag-version`,
actualiza CHANGELOG y crea `release-notes/v4.2.1.md`, usa `npm ci`, compila y revisa,
haz commit/push y repite desde el paso 3 con la nueva versión. Nunca reemplaces
una versión publicada con binarios distintos; publica otra versión.

## Alternativa con la web

Tras subir main y la etiqueta, abre Releases > Draft a new release, selecciona
la etiqueta v4.2.0, copia las notas y adjunta los cuatro archivos. Guarda el borrador
para revisar; usa Publish release solamente al final.

## Referencias oficiales

- https://cli.github.com/manual/gh_release_create
- https://cli.github.com/manual/gh_release_edit
- https://www.electron.build/publish.html
- https://www.electron.build/auto-update.html
