#!/bin/sh
set -eu

PORT_FREE_WAIT_SECONDS=3

print_usage_and_exit() {
  echo "Usage: free-listen-port.sh <port>. Got $# argument(s): $*." >&2
  exit 1
}

require_single_port_argument() {
  if [ "$#" -ne 1 ]; then
    print_usage_and_exit "$@"
  fi
}

require_port_number() {
  port="$1"
  case "$port" in
    ''|*[!0-9]*)
      echo "Port must be an integer from 1 to 65535, got: $port" >&2
      exit 1
      ;;
  esac
  if [ "$port" -lt 1 ] || [ "$port" -gt 65535 ]; then
    echo "Port must be an integer from 1 to 65535, got: $port" >&2
    exit 1
  fi
}

require_lsof() {
  if ! command -v lsof >/dev/null 2>&1; then
    echo "lsof is required to inspect listen ports but was not found on PATH." >&2
    exit 1
  fi
}

format_pid_list() {
  echo "$1" | tr '\n' ' ' | sed 's/[[:space:]]*$//'
}

list_listen_pids_on_port() {
  port="$1"
  lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null | sort -u || true
}

wait_until_port_has_no_listener() {
  port="$1"
  wait_seconds="$2"
  elapsed_seconds=0
  while [ "$elapsed_seconds" -lt "$wait_seconds" ]; do
    listen_pids=$(list_listen_pids_on_port "$port")
    if [ -z "$listen_pids" ]; then
      return 0
    fi
    sleep 1
    elapsed_seconds=$((elapsed_seconds + 1))
  done
  return 1
}

send_signal_to_listen_pids() {
  signal="$1"
  port="$2"
  listen_pids="$3"
  if [ -z "$listen_pids" ]; then
    echo "Cannot send $signal: no listen PIDs on port $port." >&2
    exit 1
  fi
  echo "Sending $signal to PID(s) $(format_pid_list "$listen_pids") on port $port."
  # A PID may exit between lsof and kill. The caller checks whether the port is free.
  kill "-$signal" $listen_pids || true
}

free_listen_port() {
  port="$1"
  listen_pids=$(list_listen_pids_on_port "$port")
  if [ -z "$listen_pids" ]; then
    return 0
  fi

  echo "Port $port is already in use by PID(s): $(format_pid_list "$listen_pids")."

  # CONT first so a Ctrl+Z-suspended process can handle TERM.
  send_signal_to_listen_pids CONT "$port" "$listen_pids"
  send_signal_to_listen_pids TERM "$port" "$listen_pids"
  if wait_until_port_has_no_listener "$port" "$PORT_FREE_WAIT_SECONDS"; then
    echo "Port $port is free."
    return 0
  fi

  remaining_listen_pids=$(list_listen_pids_on_port "$port")
  send_signal_to_listen_pids KILL "$port" "$remaining_listen_pids"
  if wait_until_port_has_no_listener "$port" "$PORT_FREE_WAIT_SECONDS"; then
    echo "Port $port is free."
    return 0
  fi

  still_listen_pids=$(list_listen_pids_on_port "$port")
  echo "Failed to free port $port. Still in use by PID(s): $(format_pid_list "$still_listen_pids")." >&2
  exit 1
}

main() {
  require_single_port_argument "$@"
  require_port_number "$1"
  require_lsof
  free_listen_port "$1"
}

main "$@"
