# GeeTech SPEC TJEK – valgfri lokal Windows-komponentrapport
# Ingen administratorrettigheder, netvaerksforbindelse eller installation kraeves.
# Indeholder IKKE navn, brugerkonto, serienumre, MAC/IP, stier eller personlige filer.
# Rapporten bliver kun gemt lokalt. Du vaelger selv, om den skal aabnes paa hjemmesiden.
$ErrorActionPreference = 'Stop'
try {
    $cpu = @(Get-CimInstance Win32_Processor | ForEach-Object { [string]$_.Name } | Where-Object { $_ })
    $gpu = @(Get-CimInstance Win32_VideoController | ForEach-Object { [string]$_.Name } | Where-Object { $_ })
    $board = Get-CimInstance Win32_BaseBoard | Select-Object -First 1
    $mem = @(Get-CimInstance Win32_PhysicalMemory)
    $disk = @()
    try {
        $disk = @(Get-PhysicalDisk | ForEach-Object {
            [ordered]@{
                model = [string]$_.FriendlyName
                mediaType = [string]$_.MediaType
                sizeGB = [math]::Round([double]$_.Size / 1GB)
            }
        })
    } catch {
        # Aeldre Windows-versioner har muligvis ikke Get-PhysicalDisk.
    }
    $ramGB = [math]::Round((($mem | Measure-Object -Property Capacity -Sum).Sum) / 1GB, 1)
    $memCodes = @($mem | ForEach-Object { [int]$_.SMBIOSMemoryType } | Where-Object { $_ -gt 0 } | Select-Object -Unique)
    $ramType = 'unknown'
    if ($memCodes.Count -eq 1) {
        switch ($memCodes[0]) {
            24 { $ramType = 'DDR3' }
            26 { $ramType = 'DDR4' }
            34 { $ramType = 'DDR5' }
        }
    }
    $report = [ordered]@{
        format = 'geetech-spec-tjek'
        version = 1
        platform = 'windows'
        cpu = $cpu
        gpu = $gpu
        motherboard = [ordered]@{
            manufacturer = [string]$board.Manufacturer
            model = [string]$board.Product
        }
        memory = [ordered]@{
            totalGB = $ramGB
            type = $ramType
            modules = $mem.Count
        }
        disks = $disk
    }
    $desktop = [Environment]::GetFolderPath('Desktop')
    if (-not $desktop -or -not (Test-Path $desktop)) {
        $desktop = [Environment]::GetFolderPath('MyDocuments')
    }
    $path = Join-Path $desktop ('GeeTech-SPEC-TJEK-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.json')
    $report | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $path -Encoding UTF8
    Write-Host ''
    Write-Host 'GeeTech SPEC TJEK - rapporten er klar.' -ForegroundColor Green
    Write-Host ('Fil: ' + $path)
    Write-Host 'Ingen data er sendt til internettet.'
    Write-Host 'Aabn SPEC TJEK paa hjemmesiden og vaelg JSON-filen i importfeltet.'
} catch {
    Write-Host ('Kunne ikke hente alle systemoplysninger: ' + $_.Exception.Message) -ForegroundColor Red
}
Write-Host ''
Read-Host 'Tryk Enter for at lukke vinduet'
