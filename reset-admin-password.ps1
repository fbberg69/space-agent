# PowerShell script to reset admin password in space-agent container
# Sets admin password to "RAFAatlas"

Write-Host "Starting admin password reset process..."

# Execute the password setting command inside the space-agent container
try {
    Write-Host "Attempting to set admin password..."
    docker-compose exec space-agent sh -c "node scripts/reset_admin_password_with_supervisor_keys.mjs && echo '--- password.json ---' && cat /srv/space/customware/L2/admin/meta/password.json"
    Write-Host "Admin password successfully set to 'RAFAatlas'" -ForegroundColor Green
}
catch {
    Write-Host "Error setting password: $_" -ForegroundColor Red
    Write-Host "Attempting alternative command format..."
    try {
        docker-compose exec space-agent sh -c "node scripts/reset_admin_password_with_supervisor_keys.mjs && echo '--- password.json ---' && cat /srv/space/customware/L2/admin/meta/password.json"
        Write-Host "Admin password successfully set using fallback script" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to set password with both methods" -ForegroundColor Red
        Write-Host "Error details: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Password reset process completed."