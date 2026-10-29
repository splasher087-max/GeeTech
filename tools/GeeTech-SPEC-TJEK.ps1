# GeeTech SPEC TJEK - Windows hardwareoversigt (version 2)
# Laeser kun oplysninger fra Windows; intet sendes til hjemmesiden eller internettet.
# Ingen administratorrettigheder er normalt noedvendige. Ingen sikkerhedspolitikker aendres.
$ErrorActionPreference = 'Continue'

function Get-GeeTechCim {
    param([string]$ClassName)
    try {
        return @(Get-CimInstance -ClassName $ClassName -ErrorAction Stop)
    } catch {
        Write-Host ("Kunne ikke laese " + $ClassName + ": " + $_.Exception.Message) -ForegroundColor Yellow
        return @()
    }
}

Write-Host 'GeeTech SPEC TJEK - registrerer dine PC-komponenter...' -ForegroundColor Cyan
$processors = @(Get-GeeTechCim 'Win32_Processor')
$graphics = @(Get-GeeTechCim 'Win32_VideoController')
$boards = @(Get-GeeTechCim 'Win32_BaseBoard')
$memory = @(Get-GeeTechCim 'Win32_PhysicalMemory')
$diskDevices = @(Get-GeeTechCim 'Win32_DiskDrive')

$cpuNames = @($processors | ForEach-Object { [string]$_.Name } | Where-Object { $_ -and $_.Trim() })
$gpuNames = @($graphics | ForEach-Object { [string]$_.Name } | Where-Object { $_ -and $_.Trim() })
$mainboard = if ($boards.Count -gt 0) { $boards[0] } else { $null }

$ramBytes = 0.0
foreach ($module in $memory) {
    try { $ramBytes += [double]$module.Capacity } catch {}
}
$ramGB = [math]::Round($ramBytes / 1GB, 1)

$types = @($memory | ForEach-Object {
    try { [int]$_.SMBIOSMemoryType } catch { 0 }
} | Where-Object { $_ -gt 0 } | Select-Object -Unique)

$ramType = 'unknown'
if ($types.Count -eq 1) {
    switch ($types[0]) {
        24 { $ramType = 'DDR3' }
        26 { $ramType = 'DDR4' }
        34 { $ramType = 'DDR5' }
    }
}
$disks = @($diskDevices | ForEach-Object {
    [ordered]@{
        model = [string]$_.Model
        mediaType = [string]$_.MediaType
        sizeGB = [math]::Round([double]$_.Size / 1GB)
    }
})

$report = [ordered]@{
    format = 'geetech-spec-tjek'
    version = 1
    platform = 'windows'
    cpu = $cpuNames
    gpu = $gpuNames
    motherboard = [ordered]@{
        manufacturer = if ($mainboard) { [string]$mainboard.Manufacturer } else { '' }
        model = if ($mainboard) { [string]$mainboard.Product } else { '' }
    }
    memory = [ordered]@{
        totalGB = $ramGB
        type = $ramType
        modules = $memory.Count
    }
    disks = $disks
}
$path = [Environment]::GetFolderPath('Desktop')
if (-not $path -or -not (Test-Path -LiteralPath $path)) {
    $path = [Environment]::GetFolderPath('MyDocuments')
}
if (-not $path -or -not (Test-Path -LiteralPath $path)) { $path = $PWD.Path }
$filename = Join-Path $path ('GeeTech-SPEC-TJEK-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.json')
try {
    $report | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $filename -Encoding UTF8 -ErrorAction Stop
    Write-Host ''
    Write-Host ('CPU: ' + ($cpuNames -join ', '))
    Write-Host ('Grafikkort: ' + ($gpuNames -join ', '))
    Write-Host ('Bundkort: ' + $report.motherboard.manufacturer + ' ' + $report.motherboard.model)
    Write-Host ('RAM: ' + $ramGB + ' GB / ' + $ramType)
    Write-Host ('Disk(e): ' + ($disks.Count))
    Write-Host ('Rapport gemt: ' + $filename) -ForegroundColor Green
    Write-Host 'Ingen oplysninger er sendt over netvaerket.'
} catch {
    Write-Host ('Kunne ikke gemme rapporten: ' + $_.Exception.Message) -ForegroundColor Red
}
Read-Host 'Tryk Enter for at lukke'
