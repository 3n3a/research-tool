#!/bin/sh
# 
# run the dev setup
#

# installations
npm i
go get

if ! [ -x "$(command -v parallel)" ];
then
    echo "Installing Parallel..."
    sudo apt update
    sudo apt install -y parallel
else
    echo "Parallel exists"
fi

# running
echo "Starting Tailwind Watcher + Go Reloader"
parallel ::: "npm run dev" "air"