#!/bin/sh
# 
# run the dev setup
#

# installations
npm i
go get
go install github.com/cosmtrek/air@latest

if ! [ -x "$(command -v parallel)" ] && ! [ -n "$(parallel -h | grep "GNU Parallel")"];
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