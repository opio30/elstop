$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$Config = Get-Content (Join-Path $Root "package.json") -Raw | ConvertFrom-Json
$Version = $Config.version
$Dist = Join-Path $Root "dist"
$Exe = Join-Path $Dist "Etiquetas-Tienda-Pro-$Version-x64.exe"
$Metadata = Join-Path $Dist "latest.yml"
$Files = @($Exe, "$Exe.blockmap", $Metadata)
foreach ($File in $Files) {
    if (-not (Test-Path -LiteralPath $File -PathType Leaf)) {
        throw "Falta $File. Ejecuta npm run build:win y revisa su salida."
    }
}
$Yaml = Get-Content -LiteralPath $Metadata -Raw
if ($Yaml -notmatch ('(?m)^version:\s*['"]?' + [regex]::Escape($Version) + '['"]?\s*$')) {
    throw "latest.yml no corresponde a la version $Version."
}
$Name = [IO.Path]::GetFileName($Exe)
if (-not $Yaml.Contains($Name)) { throw "latest.yml no referencia el EXE esperado." }
$Lines = foreach ($File in $Files) {
    $Hash = (Get-FileHash -LiteralPath $File -Algorithm SHA256).Hash.ToLowerInvariant()
    "$Hash  $([IO.Path]::GetFileName($File))"
}
$Output = Join-Path $Dist "SHA256SUMS.txt"
[IO.File]::WriteAllLines($Output, [string[]]$Lines, [Text.UTF8Encoding]::new($false))
Write-Host "Archivos preparados para revision. No se publico nada."
Write-Host $Output
