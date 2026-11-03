# ==============================================================================
# Android Signing Keystore Generator for In-Place Updates
# ==============================================================================
# Android requires all updates to be signed with the exact same certificate.
# If keys differ, Android blocks updating with: INSTALL_FAILED_UPDATE_INCOMPATIBLE.
# Running this script produces a permanent keystore and outputs the Base64 secret.
# ==============================================================================

param(
    [string]$KeystoreFile = "release.keystore",
    [string]$Alias = "omniresearch",
    [string]$Password = "OmniResearch2026!"
)

Write-Host "--- Generating 25-Year RSA Keystore for Android In-Place Updates ---" -ForegroundColor Cyan

# Check if keytool is available
$keytool = Get-Command keytool -ErrorAction SilentlyContinue
if (-not $keytool) {
    Write-Warning "keytool not found in PATH. Please install Java JDK or run this from a terminal where Java is installed."
    Exit 1
}

if (Test-Path $KeystoreFile) {
    Write-Host "Keystore already exists at: $KeystoreFile" -ForegroundColor Yellow
} else {
    & keytool -genkey -v `
        -keystore $KeystoreFile `
        -alias $Alias `
        -keyalg RSA `
        -keysize 2048 `
        -validity 10000 `
        -storepass $Password `
        -keypass $Password `
        -dname "CN=OmniResearch, OU=Production, O=OmniResearch, L=Global, ST=Tech, C=US"

    Write-Host "Keystore created successfully: $KeystoreFile" -ForegroundColor Green
}

# Convert to Base64 string for GitHub Actions Secret
$keystoreBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $KeystoreFile))
$base64 = [System.Convert]::ToBase64String($keystoreBytes)

# Save Base64 string to a file for easy copying
$b64File = "release.keystore.base64.txt"
[System.IO.File]::WriteAllText($b64File, $base64)

Write-Host ""
Write-Host "================ GITHUB SECRETS CONFIGURATION ================" -ForegroundColor Cyan
Write-Host "Go to your GitHub Repository -> Settings -> Secrets and variables -> Actions"
Write-Host "Add the following 4 Repository Secrets:" -ForegroundColor White
Write-Host ""
Write-Host "1. ANDROID_KEYSTORE_BASE64 : (Contents of $b64File)" -ForegroundColor Yellow
Write-Host "2. KEYSTORE_PASSWORD       : $Password" -ForegroundColor Yellow
Write-Host "3. KEY_ALIAS               : $Alias" -ForegroundColor Yellow
Write-Host "4. KEY_PASSWORD            : $Password" -ForegroundColor Yellow
Write-Host "==============================================================" -ForegroundColor Cyan

