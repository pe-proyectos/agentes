#!/usr/bin/env bash
###############################################################################
# deploy-agent.sh — Deploy a new OpenClaw AI agent on Coolify
#
# Creates a new OpenClaw service (identical stack to Maira) for a client,
# configures WhatsApp, generates SOUL.md, and starts the deploy.
#
# AUTOMATIC STEPS:
#   1. Create Coolify service (openclaw type) via API
#   2. Set environment variables (API keys, WhatsApp, model, etc.)
#   3. Configure FQDN/domain
#   4. Deploy the service
#
# MANUAL STEPS REQUIRED:
#   - After deploy: run `openclaw channels login` inside the container
#     to scan WhatsApp QR code and link the phone number
#   - Create a Discord bot if Discord channel is needed
#   - Upload SOUL.md and openclaw.json config to the container's /data volume
#
# Usage:
#   ./deploy-agent.sh \
#     --name "Sofia" \
#     --client "Dr. Cristian" \
#     --domain "sofia-cristian" \
#     --whatsapp-number "+51987654321" \
#     --personality "Amable, profesional, empática" \
#     --role "citas"
#
# Env vars required in /data/workspace/.env:
#   COOLIFY_API_KEY   — Coolify API bearer token
#   ANTHROPIC_API_KEY — Anthropic API key for the new agent
#
# Optional env vars (will be set if present):
#   OPENAI_API_KEY, OPENROUTER_API_KEY, BRAVE_API_KEY
###############################################################################
set -euo pipefail

# ─── Config ──────────────────────────────────────────────────────────────────
COOLIFY_URL="https://coolify.sotf-mods.com/api/v1"
DOMAIN_SUFFIX="luminari.agency"
SERVER_UUID="vs4ksck"
# Agentes project
PROJECT_UUID="losswgwk0k0gwgk4koc84sk0"
ENVIRONMENT_UUID="nw840gg4cg8884o8g0kowwwo"
OPENCLAW_IMAGE_VERSION="2026.2.6"
DEFAULT_MODEL="anthropic/claude-sonnet-4-5"

# ─── Load .env ───────────────────────────────────────────────────────────────
ENV_FILE="/data/workspace/.env"
if [[ -f "$ENV_FILE" ]]; then
  while IFS='=' read -r key value; do
    [[ -z "$key" || "$key" =~ ^# ]] && continue
    export "$key=$value"
  done < "$ENV_FILE"
fi

COOLIFY_TOKEN="${COOLIFY_API_KEY:?ERROR: COOLIFY_API_KEY not set in $ENV_FILE}"
ANTHROPIC_KEY="${ANTHROPIC_API_KEY:?ERROR: ANTHROPIC_API_KEY not set}"

# ─── Parse arguments ────────────────────────────────────────────────────────
AGENT_NAME=""
CLIENT_NAME=""
SUBDOMAIN=""
WHATSAPP_NUMBER=""
PERSONALITY=""
ROLE=""
DRY_RUN=false
MODEL="$DEFAULT_MODEL"

usage() {
  cat <<EOF
Usage: $0 --name NAME --client CLIENT --domain SUBDOMAIN --whatsapp-number NUMBER --personality DESC --role ROLE [--model MODEL] [--dry-run]

Required:
  --name              Agent name (e.g. "Sofia")
  --client            Client name (e.g. "Dr. Cristian")
  --domain            Subdomain prefix (e.g. "sofia-cristian" → sofia-cristian.luminari.agency)
  --whatsapp-number   Client WhatsApp number in E.164 (e.g. "+51987654321")
  --personality       Agent personality description
  --role              Agent role (ventas, soporte, citas, etc.)

Optional:
  --model             AI model (default: $DEFAULT_MODEL)
  --dry-run           Show what would be done without executing
EOF
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --name) AGENT_NAME="$2"; shift 2 ;;
    --client) CLIENT_NAME="$2"; shift 2 ;;
    --domain) SUBDOMAIN="$2"; shift 2 ;;
    --whatsapp-number) WHATSAPP_NUMBER="$2"; shift 2 ;;
    --personality) PERSONALITY="$2"; shift 2 ;;
    --role) ROLE="$2"; shift 2 ;;
    --model) MODEL="$2"; shift 2 ;;
    --dry-run) DRY_RUN=true; shift ;;
    *) echo "Unknown option: $1"; usage ;;
  esac
done

# ─── Validate ────────────────────────────────────────────────────────────────
[[ -z "$AGENT_NAME" ]] && echo "ERROR: --name required" && usage
[[ -z "$CLIENT_NAME" ]] && echo "ERROR: --client required" && usage
[[ -z "$SUBDOMAIN" ]] && echo "ERROR: --domain required" && usage
[[ -z "$WHATSAPP_NUMBER" ]] && echo "ERROR: --whatsapp-number required" && usage
[[ -z "$PERSONALITY" ]] && echo "ERROR: --personality required" && usage
[[ -z "$ROLE" ]] && echo "ERROR: --role required" && usage

# Sanitize subdomain
SUBDOMAIN=$(echo "$SUBDOMAIN" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g')
FQDN="${SUBDOMAIN}.${DOMAIN_SUFFIX}"
SERVICE_NAME="openclaw-${SUBDOMAIN}"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  DEPLOY AGENT: $AGENT_NAME"
echo "║  Client: $CLIENT_NAME"
echo "║  Domain: https://$FQDN"
echo "║  WhatsApp: $WHATSAPP_NUMBER"
echo "║  Role: $ROLE"
echo "║  Model: $MODEL"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

if $DRY_RUN; then
  echo "[DRY RUN] Would create service '$SERVICE_NAME' at https://$FQDN"
  echo "[DRY RUN] Skipping actual API calls."
fi

# ─── Helper: Coolify API call ────────────────────────────────────────────────
coolify() {
  local method="$1" path="$2"
  shift 2
  if $DRY_RUN; then
    echo "[DRY RUN] $method $COOLIFY_URL$path" >&2
    return 0
  fi
  curl -sf -X "$method" "${COOLIFY_URL}${path}" \
    -H "Authorization: Bearer $COOLIFY_TOKEN" \
    -H "Content-Type: application/json" \
    "$@"
}

# ─── Step 1: Check if service already exists (idempotency) ──────────────────
echo "→ Step 1: Checking if service '$SERVICE_NAME' already exists..."
EXISTING_UUID=""
if ! $DRY_RUN; then
  EXISTING_UUID=$(coolify GET /services | python3 -c "
import sys,json
for s in json.load(sys.stdin):
    if s.get('name','') == '$SERVICE_NAME':
        print(s['uuid'])
        break
" 2>/dev/null || true)
fi

if [[ -n "$EXISTING_UUID" ]]; then
  echo "   ⚠️  Service already exists: $EXISTING_UUID"
  echo "   Skipping creation, will update config..."
  SERVICE_UUID="$EXISTING_UUID"
else
  # ─── Step 2: Create the service ────────────────────────────────────────────
  echo "→ Step 2: Creating OpenClaw service in Coolify..."
  if $DRY_RUN; then
    SERVICE_UUID="dry-run-uuid"
  else
    RESPONSE=$(coolify POST /services -d "{
      \"type\": \"openclaw\",
      \"name\": \"$SERVICE_NAME\",
      \"server_uuid\": \"$SERVER_UUID\",
      \"project_uuid\": \"$PROJECT_UUID\",
      \"environment_uuid\": \"$ENVIRONMENT_UUID\",
      \"description\": \"AI Agent: $AGENT_NAME for $CLIENT_NAME\"
    }")
    SERVICE_UUID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['uuid'])")
    echo "   ✅ Service created: $SERVICE_UUID"
  fi
fi

# ─── Step 3: Configure environment variables ─────────────────────────────────
echo "→ Step 3: Setting environment variables..."

set_env() {
  local key="$1" value="$2" preview="${3:-false}"
  if $DRY_RUN; then
    local display="$value"
    [[ ${#display} -gt 20 ]] && display="${display:0:10}..."
    echo "   [DRY RUN] SET $key=$display"
    return
  fi
  coolify POST "/services/${SERVICE_UUID}/envs" \
    -d "{\"key\":\"$key\",\"value\":\"$value\",\"is_preview\":$preview}" > /dev/null 2>&1 || true
}

# Core API keys
set_env "ANTHROPIC_API_KEY" "$ANTHROPIC_KEY"
set_env "OPENCLAW_PRIMARY_MODEL" "$MODEL"
set_env "WHATSAPP_ENABLED" "true"

# Optional keys (pass through if set)
[[ -n "${OPENAI_API_KEY:-}" ]] && set_env "OPENAI_API_KEY" "$OPENAI_API_KEY"
[[ -n "${OPENROUTER_API_KEY:-}" ]] && set_env "OPENROUTER_API_KEY" "$OPENROUTER_API_KEY"
[[ -n "${BRAVE_API_KEY:-}" ]] && set_env "BRAVE_API_KEY" "$BRAVE_API_KEY"

echo "   ✅ Environment variables configured"

# ─── Step 4: Configure FQDN ─────────────────────────────────────────────────
echo "→ Step 4: Configuring domain: https://$FQDN ..."

if ! $DRY_RUN; then
  # Get the openclaw application sub-service UUID
  APP_SUB_UUID=$(coolify GET "/services/${SERVICE_UUID}" | python3 -c "
import sys,json
svc=json.load(sys.stdin)
for app in svc.get('applications',[]):
    if app.get('name') == 'openclaw':
        print(app['uuid'])
        break
" 2>/dev/null || true)

  if [[ -n "$APP_SUB_UUID" ]]; then
    # Update FQDN via the service env
    set_env "SERVICE_FQDN_OPENCLAW" "$FQDN"
    set_env "SERVICE_FQDN_OPENCLAW_8080" "https://${FQDN}:8080"
    set_env "SERVICE_URL_OPENCLAW" "https://${FQDN}"
    echo "   ✅ Domain configured: https://$FQDN"
  else
    echo "   ⚠️  Could not find openclaw sub-application, FQDN may need manual config"
  fi
fi

# ─── Step 5: Generate SOUL.md ────────────────────────────────────────────────
echo "→ Step 5: Generating SOUL.md and openclaw.json..."

AGENT_DIR="/data/workspace/agentes/agents/${SUBDOMAIN}"
mkdir -p "$AGENT_DIR"

cat > "${AGENT_DIR}/SOUL.md" << SOUL_EOF
# ${AGENT_NAME} — Agente AI de ${CLIENT_NAME}

## Identidad
- **Nombre:** ${AGENT_NAME}
- **Rol:** ${ROLE}
- **Cliente:** ${CLIENT_NAME}

## Personalidad
${PERSONALITY}

## Canal Principal
- WhatsApp: ${WHATSAPP_NUMBER}

## Instrucciones de Comportamiento
- Responde siempre en español (a menos que el usuario escriba en otro idioma)
- Sé profesional pero cercana
- Respeta los horarios del cliente
- No compartas información confidencial del cliente
- Si no sabes algo, dilo honestamente
- Mantén las respuestas concisas para WhatsApp (mensajes cortos)

## Rol: ${ROLE}
$(case "$ROLE" in
  ventas|sales)
    echo "- Atender consultas de productos/servicios
- Capturar datos de leads (nombre, teléfono, email, interés)
- Agendar citas o demos cuando sea apropiado
- No presionar, sino informar y guiar"
    ;;
  soporte|support)
    echo "- Resolver dudas y problemas de los clientes
- Escalar problemas complejos al equipo humano
- Mantener un tono empático y solucionador
- Documentar los problemas recurrentes"
    ;;
  citas|appointments)
    echo "- Gestionar agenda de citas del profesional
- Confirmar, reagendar y cancelar citas
- Enviar recordatorios
- Manejar disponibilidad horaria"
    ;;
  *)
    echo "- Asistente general para ${CLIENT_NAME}
- Adaptar comportamiento según las necesidades del cliente"
    ;;
esac)
SOUL_EOF

# Generate openclaw.json config
cat > "${AGENT_DIR}/openclaw.json" << CONFIG_EOF
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "${MODEL}"
      },
      "workspace": "/data/workspace",
      "maxConcurrent": 2
    },
    "list": [
      {
        "id": "main",
        "default": true,
        "workspace": "/data/workspace"
      }
    ]
  },
  "channels": {
    "whatsapp": {
      "dmPolicy": "open",
      "allowFrom": ["${WHATSAPP_NUMBER}", "*"],
      "groupPolicy": "disabled",
      "mediaMaxMb": 25,
      "debounceMs": 2000
    }
  },
  "commands": {
    "native": "auto",
    "restart": true
  },
  "cron": {
    "enabled": false
  },
  "web": {
    "enabled": false
  },
  "browser": {
    "evaluateEnabled": false
  },
  "messages": {
    "ackReactionScope": "none"
  }
}
CONFIG_EOF

echo "   ✅ Config files generated at: $AGENT_DIR/"

# ─── Step 6: Deploy ─────────────────────────────────────────────────────────
echo "→ Step 6: Starting deployment..."

if $DRY_RUN; then
  echo "   [DRY RUN] Would start deploy for $SERVICE_UUID"
else
  DEPLOY_RESPONSE=$(coolify POST "/services/${SERVICE_UUID}/start" -d '{}' 2>&1 || true)
  echo "   🚀 Deploy started!"
  echo "   Response: $DEPLOY_RESPONSE"
fi

# ─── Summary ─────────────────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  ✅ DEPLOYMENT INITIATED"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  Service UUID: $SERVICE_UUID"
echo "║  URL: https://$FQDN"
echo "║  Agent: $AGENT_NAME ($ROLE)"
echo "║  Client: $CLIENT_NAME"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  📋 MANUAL STEPS REQUIRED:"
echo "║"
echo "║  1. Wait ~2-3 min for containers to start"
echo "║"
echo "║  2. Copy config files to the container:"
echo "║     docker cp ${AGENT_DIR}/SOUL.md \\"
echo "║       openclaw-${SERVICE_UUID}:/data/workspace/SOUL.md"
echo "║     docker cp ${AGENT_DIR}/openclaw.json \\"
echo "║       openclaw-${SERVICE_UUID}:/data/.openclaw/openclaw.json"
echo "║"
echo "║  3. Link WhatsApp (scan QR code):"
echo "║     docker exec -it openclaw-${SERVICE_UUID} \\"
echo "║       openclaw channels login"
echo "║     → Scan the QR with WhatsApp on phone $WHATSAPP_NUMBER"
echo "║"
echo "║  4. Restart to apply config:"
echo "║     curl -X POST '${COOLIFY_URL}/services/${SERVICE_UUID}/restart' \\"
echo "║       -H 'Authorization: Bearer \$COOLIFY_TOKEN' \\"
echo "║       -H 'Content-Type: application/json'"
echo "║"
echo "║  5. Verify: https://$FQDN/healthz"
echo "╚══════════════════════════════════════════════════════════════╝"
