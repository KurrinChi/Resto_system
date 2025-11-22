$rootPath = "c:\xampp\htdocs\PROJECTS\Selfiegram\Resto_system\src"

# Find all .tsx files
$tsxFiles = Get-ChildItem -Path $rootPath -Filter *.tsx -Recurse

$removed = 0
foreach ($tsxFile in $tsxFiles) {
    $jsFile = $tsxFile.FullName -replace '\.tsx$', '.js'
    if (Test-Path $jsFile) {
        Write-Host "Removing duplicate: $jsFile"
        Remove-Item $jsFile -Force
        $removed++
    }
}

Write-Host ""
Write-Host "Removed $removed duplicate .js files"
