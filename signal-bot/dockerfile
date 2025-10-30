# Imagen base oficial del proyecto
FROM bbernhard/signal-cli-rest-api:latest

# Establece variables de entorno por defecto
ENV MODE=native \
    AUTO_RECEIVE_SCHEDULE=0 * * * * \
    TZ=Europe/Madrid

# Crea directorio persistente para los datos de Signal
RUN mkdir -p /home/.local/share/signal-cli

# Punto de montaje del volumen
VOLUME ["/home/.local/share/signal-cli"]

# Expone el puerto del API
EXPOSE 8080

# Comando de inicio por defecto
CMD ["signal-cli-rest-api"]
