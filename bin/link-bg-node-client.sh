#!/usr/bin/env zsh

BEFORE="@baragaun\/bg-node-client\": \".*\""
AFTER="@baragaun\/bg-node-client\": \"link:..\/bg-node-client\""

sed -i '' -e "s/${BEFORE}/${AFTER}/" ./package.json
nvm use
pnpm install "link:../bg-node-client"
