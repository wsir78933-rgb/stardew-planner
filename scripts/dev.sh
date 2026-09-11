#!/bin/sh
set -eu

DEV_PORT=3003

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

sh "$script_dir/free-listen-port.sh" "$DEV_PORT"
exec next dev --port "$DEV_PORT"
