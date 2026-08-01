#!/bin/bash
# Double-click this file from the repository, or use the installer to place a
# portable copy on the desktop.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
exec "$SCRIPT_DIR/start-content-ops.sh" "$@"
