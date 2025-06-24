# Script para limpiar secretos del historial de git
Write-Host "Limpiando secretos del historial de git..."

# Eliminar el archivo .env del historial
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all

# Limpiar referencias
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host "Limpieza completada. Ahora puedes hacer push." 