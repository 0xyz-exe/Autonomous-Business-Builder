# Start Autonomous Business Builder (backend + frontend) on Windows
$Root = Split-Path -Parent $PSScriptRoot
$Backend = Join-Path $Root "backend"
$Frontend = Join-Path $Root "frontend"

Write-Host "Starting backend on http://localhost:8000 ..."
$backendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    if (-not (Test-Path "venv\Scripts\python.exe")) {
        python -m venv venv
        .\venv\Scripts\pip install -r requirements.txt -q
    }
    .\venv\Scripts\uvicorn app.main:app --reload --port 8000
} -ArgumentList $Backend

Start-Sleep -Seconds 3

Write-Host "Starting frontend on http://localhost:3000 ..."
Set-Location $Frontend
if (-not (Test-Path "node_modules")) { npm install }
Start-Process npm -ArgumentList "run", "dev" -NoNewWindow

Write-Host ""
Write-Host "Ready:"
Write-Host "  App:    http://localhost:3000"
Write-Host "  API:    http://localhost:8000"
Write-Host "  Docs:   http://localhost:8000/docs"
Write-Host ""
Write-Host "Backend job ID: $($backendJob.Id) — Stop-Job $($backendJob.Id) to stop API"
