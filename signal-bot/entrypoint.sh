#!/bin/sh
set -e

# Carpeta de configuración de Signal CLI
CONFIG_DIR="/home/.local/share/signal-cli"
mkdir -p "$CONFIG_DIR"
chown 1000:1000 -R "$CONFIG_DIR"

# Host público de Railway
HOST="makis.railway.app"

# Imprime URL de registro
echo "----------------------------------------"
echo "💡 URL para registrar tu móvil Signal:"
echo "https://$HOST/v1/register"
echo "----------------------------------------"

# Ejecuta Signal CLI REST API en modo json-rpc en background
signal-cli-rest-api -signal-cli-config="$CONFIG_DIR" -mode json-rpc &

# Mantener el contenedor vivo para Railway
tail -f /dev/null
