#!/usr/bin/env bash

DEBUG=false
LANG="es_ES"
HOST="localhost:8080"

# OSX set volume to max
#osascript -e "set Volume 10"

# User id
ID=`hostname`

# Find voice for puterizer
VOICE=`say -v ? | awk '{if($2=="es_ES"){ print $1 }}' | head -n1`

if [ "$DEBUG" = true ] ; then
    echo "Configured voice $VOICE Puterizer for -> $ID"
    say -v "$VOICE" "Listo!"
fi

# What to run when we receive something from websockets connections
sayMyName() {
  echo "Speaking: $1"
  say $1
}

export -f sayMyName
mkfifo shutterout

# Connect to websocket host
curl --no-buffer -s --header "Connection: Upgrade" --header "Upgrade: websocket" \
    --header "Host: $HOST" --header "Origin: http://$HOST" \
    --header "Sec-WebSocket-Key: xxxxxxx" --header "Sec-WebSocket-Version: 13" \
    http://$HOST/ | awk 'BEGIN{FS="*"; RS="\n"} {printf("%s\n", $2);fflush(stdout);}' > shutterout &
    
# Clean conection on script exit
trap 'echo "Killing jobs" && rm shutterout && kill $(jobs -p)' EXIT

# Pipe each line to xargs for execution
cat shutterout | xargs -I {} bash -c "sayMyName '{}'"
