# PowerShell script to restart Space Agent Docker container
# Run this script from D:\Space-Agent directory

Write-Host "=== Step 1: docker-compose down ==="
try {
    $result1 = docker-compose down 2>&1
    Write-Host $result1
} catch {
    Write-Host "STDOUT:" $_.Exception.Message
    Write-Host "STDERR:" $_.Exception.Message
}

Write-Host "=== Step 2: docker-compose up -d ==="
try {
    $result2 = docker-compose up -d 2>&1
    Write-Host $result2
} catch {
    Write-Host "STDOUT:" $_.Exception.Message
    Write-Host "STDERR:" $_.Exception.Message
}

Write-Host "=== Step 3: Waiting 10 seconds ==="
Start-Sleep -Seconds 10

Write-Host "=== Step 4: curl health check ==="
try {
    $result4 = curl -s http://localhost:3010/health -o NUL -w "%{http_code}" 2>&1
    Write-Host $result4
} catch {
    Write-Host "STDOUT:" $_.Exception.Message
    Write-Host "STDERR:" $_.Exception.Message
}