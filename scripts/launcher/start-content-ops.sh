#!/bin/bash
# Starts the local-only DDNZ Content Ops workspace and opens it in the default browser.
# This script deliberately never installs packages, changes .env.local, or stops a
# process that it did not start.

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
DEFAULT_PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd -P)"
PROJECT_DIR="${DDNZ_CONTENT_OPS_PROJECT_DIR:-$DEFAULT_PROJECT_DIR}"
TARGET_URL="http://127.0.0.1:3000/content-ops"
HEALTH_URL="http://127.0.0.1:3000/api/content-ops/health"
RUNTIME_DIR="${TMPDIR:-/tmp}/ddnz-content-ops-${UID:-unknown}"
PID_FILE="$RUNTIME_DIR/vite.pid"
LOG_FILE="$RUNTIME_DIR/vite.log"

umask 077

notify() {
  local title="$1"
  local message="$2"
  /usr/bin/osascript - "$title" "$message" <<'APPLESCRIPT' >/dev/null 2>&1 || true
on run argv
  display dialog (item 2 of argv) with title (item 1 of argv) buttons {"OK"} default button "OK" with icon caution
end run
APPLESCRIPT
}

fail() {
  local message="$1"
  message="${message//\\n/$'\n'}"
  printf '\nDDNZ Content Ops could not start.\n%s\n\n' "$message" >&2
  notify "DDNZ Content Ops" "$message"
  if [[ -t 0 ]]; then
    printf 'Press Return to close this window. '
    read -r _unused || true
  fi
  exit 1
}

has_env_value() {
  local name="$1"
  # Only checks that a non-empty assignment exists; it never evaluates .env.local.
  /usr/bin/grep -Eq "^[[:space:]]*(export[[:space:]]+)?${name}[[:space:]]*=[[:space:]]*[^[:space:]#]" "$PROJECT_DIR/.env.local"
}

if [[ "$(uname -s)" != "Darwin" ]]; then
  fail "This launcher is for macOS. Start the project with npm run dev:content-ops on this system."
fi

if [[ ! -d "$PROJECT_DIR" || ! -f "$PROJECT_DIR/package.json" ]]; then
  fail "The project folder was not found:\n$PROJECT_DIR\n\nRe-run the installer from the DDNZ project, or set DDNZ_CONTENT_OPS_PROJECT_DIR to the correct folder."
fi

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  fail "Node.js and npm are required. Install the current Node.js LTS release, then run this launcher again."
fi

if [[ ! -d "$PROJECT_DIR/node_modules" ]]; then
  fail "Project dependencies are not installed. In the project folder, run:\n\nnpm install\n\nThen start the launcher again."
fi

if [[ ! -f "$PROJECT_DIR/.env.local" ]]; then
  fail "Missing .env.local. Copy .env.example to .env.local and add the Notion credentials before starting Content Ops."
fi

if ! has_env_value "NOTION_API_KEY" || ! has_env_value "NOTION_DATABASE_ID"; then
  fail ".env.local is missing NOTION_API_KEY or NOTION_DATABASE_ID. Add both values, save the file, then start again."
fi

if ! has_env_value "OPENAI_API_KEY"; then
  printf 'Notice: OPENAI_API_KEY is not configured. Notion governance will work, but the GPT-5.6 six-step workflow will remain disabled.\n'
fi

if ! command -v curl >/dev/null 2>&1 || ! command -v lsof >/dev/null 2>&1; then
  fail "macOS curl or lsof is unavailable, so the launcher cannot safely check the local server."
fi

mkdir -p "$RUNTIME_DIR" || fail "Could not create the local launcher runtime folder."

# Reuse an already-working DDNZ server. The dedicated health endpoint prevents
# the launcher from mistaking another local app on port 3000 for Content Ops.
if curl --fail --silent --show-error --max-time 2 "$HEALTH_URL" >/dev/null 2>&1; then
  /usr/bin/open "$TARGET_URL"
  exit 0
fi

# Never take over port 3000: it may belong to another local project.
port_owner="$(/usr/sbin/lsof -nP -iTCP:3000 -sTCP:LISTEN -t 2>/dev/null | /usr/bin/head -n 1 || true)"
if [[ -n "$port_owner" ]]; then
  fail "Port 3000 is already being used by process $port_owner, but it is not responding as DDNZ Content Ops. Stop that process or use its existing app, then try again."
fi

if [[ -f "$PID_FILE" ]]; then
  previous_pid="$(/bin/cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "$previous_pid" ]] && kill -0 "$previous_pid" 2>/dev/null; then
    fail "A previous DDNZ Content Ops launch (process $previous_pid) is still starting but has not become available. Check this log:\n$LOG_FILE"
  fi
  /bin/rm -f "$PID_FILE"
fi

printf 'Starting DDNZ Content Ops…\n'
(
  cd "$PROJECT_DIR" || exit 1
  exec /usr/bin/nohup /usr/bin/env npm run dev:content-ops
) >"$LOG_FILE" 2>&1 &
server_pid="$!"
printf '%s\n' "$server_pid" >"$PID_FILE"

for _attempt in $(/usr/bin/seq 1 40); do
  if curl --fail --silent --show-error --max-time 2 "$HEALTH_URL" >/dev/null 2>&1; then
    /usr/bin/open "$TARGET_URL"
    printf 'DDNZ Content Ops is ready in your browser.\n'
    exit 0
  fi
  if ! kill -0 "$server_pid" 2>/dev/null; then
    fail "The local server stopped before it was ready. Check this log:\n$LOG_FILE"
  fi
  /bin/sleep 1
done

fail "The local server did not respond within 40 seconds. Check this log:\n$LOG_FILE"
