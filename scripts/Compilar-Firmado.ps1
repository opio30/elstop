param([Parameter(Mandatory=$true)][string]$CertificatePath)
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)
& node.exe "$PSScriptRoot/preparar-claves.js"
if ($LASTEXITCODE -ne 0) { throw "No se pudo preparar la clave de licencias." }
$Resolved = (Resolve-Path -LiteralPath $CertificatePath).Path
if ([IO.Path]::GetExtension($Resolved) -ne '.pfx') { throw 'Selecciona un certificado de firma de codigo PFX.' }
$Secure = Read-Host 'Contraseña del certificado PFX' -AsSecureString
$Ptr = [IntPtr]::Zero
$OldLink = $env:WIN_CSC_LINK
$OldPassword = $env:WIN_CSC_KEY_PASSWORD
try {
    $Ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Secure)
    $env:WIN_CSC_LINK = $Resolved
    $env:WIN_CSC_KEY_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($Ptr)
    & npx.cmd --no-install electron-builder --win nsis --x64 --publish never -c.forceCodeSigning=true
    if ($LASTEXITCODE -ne 0) { throw 'Fallo la compilacion firmada.' }
    $Version = (Get-Content package.json -Raw | ConvertFrom-Json).version
    $Exe = Join-Path $PWD "dist/Etiquetas-Tienda-Pro-$Version-x64.exe"
    $Signature = Get-AuthenticodeSignature -LiteralPath $Exe
    if ($Signature.Status -ne 'Valid') { throw "Firma no valida o no confiable: $($Signature.Status). No distribuir como editor verificado." }
    Write-Host "Firma verificada. Titular: $($Signature.SignerCertificate.Subject)"
    & "$PSScriptRoot/Preparar-Release.ps1"
} finally {
    $env:WIN_CSC_LINK = $OldLink
    $env:WIN_CSC_KEY_PASSWORD = $OldPassword
    if ($Ptr -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($Ptr) }
    $Secure.Dispose()
}
