# Makis — Arquitectura técnica y diseño del backend orquestador

> Documento-resumen para el proyecto **Makis**: primero la **arquitectura visual** (servicios, conexiones y flujos de datos) y después el **diseño del backend orquestador** que crea/borra instancias y genera APKs.

---

## 1. Resumen ejecutivo

Makis gestiona instancias efímeras de una app de usuario. Cada instancia tiene su propia base de datos (Supabase), APK personalizada y canal de notificación por Telegram. La app maestra orquesta creación y borrado seguros de esas instancias.

Objetivos clave:
- Levantar y destruir instancias de forma fiable y verificable.
- Entregar APKs a usuarias sin pasar por tiendas oficiales (Android).
- Garantizar seguridad en tránsito y en reposo, y borrado verificable de datos.

---

## 2. Diagrama de alto nivel (Mermaid)

```mermaid
graph TD
  A[App Maestra (Admin UI)] -->|API: /instances| B[Backend Orquestador]
  B --> C[Supabase Central (orquestación + logs)]
  B --> D[Supabase Instancia N]
  B --> E[Storage (S3 / Supabase Storage)]
  B --> F[CI Builder / Containerized APK builder]
  B --> G[Telegram Bot]
  H[App Usuarias (APK)] -->|HTTPS + JWT| D
  H -->|Descarga APK| E
  G -->|Envío enlace| I[Telegram Group / Users]
  E -->|APK firmado| I
```

> Nota: cada "Supabase Instancia N" puede ser: un proyecto Supabase independiente **o** un schema con RLS en un proyecto compartido. Ambas opciones tienen pros/contras (ver sección 5).

---

## 3. Componentes y responsabilidades

### App Maestra
- Interfaz para crear/borrar instancias.
- Autenticación con MFA (admin).
- Llama al Backend Orquestador.

### Backend Orquestador
- API REST/GraphQL para orquestación.
- Crea proyecto o schema en Supabase.
- Gestiona claves/credenciales y cifrado de secretos.
- Dispara compilación o personalización de APK.
- Sube APK firmado a Storage y crea URL pre-firmada.
- Envía enlace con Telegram Bot.
- Ejecuta procesos de borrado atómico y verificable.
- Log y auditoría (central).

### Supabase (instancias)
- Base de datos Postgres (+ Realtime/WebSockets si se usa).
- Auth (opcional) para usuarios finales.
- Storage para archivos de instancia (adjuntos).
- Reglas RLS estrictas por rol.

### Storage (S3 / Supabase Storage)
- Host de APKs y artefactos.
- URLs pre-firmadas con expiración breve.
- Políticas de ciclo de vida para eliminar artefactos obsoletos.

### CI Builder / APK Generator
- Estrategias: template + sustitución de config, o compilación completa en contenedor.
- Firma APKs con clave controlada por el backend (HSM o KMS recomendado).

### Telegram Bot
- Envía links firmados al grupo/usuarios.
- Notifica eventos (instancia levantada, borrada).

---

## 4. Flujos de datos y secuencias

### 4.1 Crear instancia — pasos principales
1. Admin -> App Maestra -> POST /instances (nombre, opciones)
2. Backend orquestador valida y reserva ID (instancia123) en la DB central.
3. Backend crea proyecto/schema en Supabase (o provisiona schema en proyecto compartido).
4. Genera credenciales: DB URL, API keys limitadas, clave de cifrado simétrica (CEK) para datos en reposo.
5. Persiste secretos en KMS / secret manager (no en DB en plano).
6. Backend lanza builder:
   - Si template: clona APK template, inyecta config (env file, assets), re-sign.
   - Si build full: dispara pipeline containerizado (gradle) que compila + firma.
7. APK firmado subido a Storage con nombre `instancia123-v1.apk` y URL pre-firmada.
8. Telegram Bot envía enlace a administradoras o al grupo.
9. Marca instancia como `active` en DB central.

### 4.2 Uso normal
- Usuarios instalan APK y se autentican (si procede).
- App conecta a Supabase Instancia (via HTTPS + WebSockets).
- Mensajes pueden cifrarse en cliente antes de enviarse (E2EE) o cifrarse en tránsito con TLS y en reposo con CEK.

### 4.3 Borrar instancia — pasos seguros
1. Admin -> App Maestra -> DELETE /instances/instancia123 (acción confirmada con MFA).
2. Backend marca estado `deleting` y crea snapshot de auditoría (metadata) en storage cifrado.
3. Invalida credenciales (rotación/expiración inmediata).
4. Termina procesos/colas relacionados con la instancia.
5. Ejecuta borrado total del proyecto/schema en Supabase.
6. Borra objetos en Storage y fuerza eliminación (sigue políticas de retención legal si aplica).
7. Registra evidencia de borrado (hashes, timestamps) en logs cifrados.
8. Marca instancia `deleted` y envía notificación por Telegram.

> Punto crítico: cada paso debe ser **idempotente** y comprobable (webhooks o callbacks que confirmen el borrado real desde el proveedor).

---

## 5. Decisión crítica: multi-proyecto vs multi-schema

### Opción A — Multi-proyecto (un proyecto Supabase por instancia)
**Pros**: aislamiento fuerte, credenciales separadas, borrado más sencillo (eliminar proyecto).
**Contras**: overhead de gestión y coste (Supabase tiende a facturar por proyecto), limitaciones de API para crear proyectos a escala.

### Opción B — Multi-schema dentro de un proyecto
**Pros**: más económico, control centralizado, rápido de provisionar.
**Contras**: mayor riesgo si el proyecto principal se ve comprometido; borrado requiere ejecutar `DROP SCHEMA` y limpiar storage referenciado.

**Recomendación**: para producción y si buscas aislamiento legal/seguridad, **preferir multi-proyecto**. Para PoC y pruebas rápidas, multi-schema es aceptable.

---

## 6. Seguridad (en detalle)

### Autenticación y autorización
- Admin: MFA obligatoria, roles y logs de acceso.
- Backend: credenciales de servicio guardadas en KMS (AWS KMS / GCP KMS / Supabase secrets).
- Usuarios: JWT con expiración corta y refresh tokens revocables.

### Comunicación
- TLS 1.2/1.3 en todas las conexiones.
- Evitar exponer RDS/Postgres sin pasar por capas de API.

### Cifrado
- CEK (clave por instancia) para cifrar en reposo; CEK cifrado con KMS master key.
- Firma de APKs con clave privada almacenada en HSM/KMS.

### Borrado verificable
- Borrado atómico: orquestar pasos y solicitar confirmación del proveedor (por ejemplo, API de Supabase o de PostgreSQL que confirme `DROP` completo).
- Mantener hashes y evidencia del borrado (registro inmutable) — pero cuidado con almacenar metadatos sensibles.

### Logs y auditoría
- Logs cifrados, inmutables y con control de acceso.
- Almacenamiento temporal de backups cifrados con TTL corto; políticas de retención legal si aplica.

---

## 7. Generación y firma de APKs — estrategias

### Estrategia 1 — Template lightweight (recomendado si es viable)
- Mantener una APK base ya compilada.
- Inyectar un archivo de configuración (runtime config) o asset con URL y clave de la instancia.
- Re-sign la APK con la clave de firma.
- Ventajas: rápido, menos recursos.
- Contras: si la configuración requiere cambios binarios profundos, hay límites.

### Estrategia 2 — Build completo en contenedor
- Disparar un contenedor con Android SDK + gradle para compilar la app con build variants específicas.
- Sign con la clave almacenada en KMS/HSM.
- Ventajas: total personalización.
- Contras: coste y tiempo de build.

### Firma y verificación
- Clave de firma guardada en HSM o KMS (no en disco).
- Opcional: cada instancia puede usar la misma clave de firma (más simple) o usar claves rotadas por instancia para máxima separación.

---

## 8. API pública del Backend Orquestador (boceto)

- `POST /instances` — crear (body: nombre, config)
- `GET /instances/:id` — estado y metadata
- `GET /instances` — listar
- `DELETE /instances/:id` — iniciar borrado (MFA requerido en la UI)
- `POST /instances/:id/build` — forzar recompilación
- `POST /instances/:id/rotate-keys` — rotar credenciales
- Webhooks: `POST /webhooks/build-complete`, `POST /webhooks/delete-confirmation`

---

## 9. Consideraciones operativas y de escalado

- Monitorización (Prometheus/Grafana) y alertas para fallos de creación/borrado.
- Cola de trabajos (RabbitMQ / BullMQ) para builds y tareas largas.
- Circuit breakers y retries con backoff.
- Tests automáticos: unit + integración + E2E (simular ciclo completo).

---

## 10. Checklist mínimo para PoC

- [ ] API Orquestador básico (crear, listar, borrar) con DB central.
- [ ] Strategy de provisionado en Supabase (schema o proyecto).
- [ ] APK template + script de inyección de config.
- [ ] Firma manual y hosting en Storage + envío por Telegram.
- [ ] Proceso de borrado que elimina datos y demuestra evidencia.
- [ ] Logs y panel básico de auditoría.

---

## 11. Siguientes pasos recomendados

1. Elegir multi-proyecto vs multi-schema para PoC.
2. Hacer un PoC que cree una instancia, inyecte config en APK template y entregue el APK por Telegram.
3. Implementar proceso de borrado y verificar con pruebas.
4. Añadir cifrado de datos en reposo y gestión de claves con KMS.
5. Escalar a builds completos si el template no cubre necesidades.

---

## 12. Anexos: riesgos legales y de distribución

- Distribuir APKs fuera de tiendas puede violar políticas de plataformas y deberías informar a las usuarias cómo instalar de forma segura.
- Si manejas datos personales, cumplir RGPD: informar sobre retención, derecho a borrado y medidas de seguridad.

---

*Documento preparado para servir como base técnica. Puedo desglosar ahora el diseño de endpoints, scripts de orquestación y ejemplos de código para cada paso del PoC.*

