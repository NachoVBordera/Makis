# Imagen base oficial del proyecto
FROM bbernhard/signal-cli-rest-api:latest

# Variables de entorno por defecto
ENV MODE=json-rpc \
    AUTO_RECEIVE_SCHEDULE="0 * * * *" \
    TZ=Europe/Madrid

# Crea directorio persistente para los datos de Signal
RUN mkdir -p /home/.local/share/signal-cli

# Expone el puerto del API
EXPOSE 8080

# Copia el script de arranque
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Comando de inicio por defecto
CMD ["/entrypoint.sh"]
