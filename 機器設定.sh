#!/bin/bash

set -euxo pipefail

# Add Chrome's apt-key
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee -a /etc/apt/sources.list.d/google.list
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -

# Add Node's apt-key
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

# Install NodeJS and Google Chrome
sudo apt-get update
sudo apt-get install -y nodejs google-chrome-stable
