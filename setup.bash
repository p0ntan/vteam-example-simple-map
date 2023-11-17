#!/usr/bin/env bash
#
# Put code here to build and setup the repo
#

# Build the image first, to have a container to work with.
docker build -t vteam-simple-map:1.0 .

# This will be differnet for different containers/repos.
# For this repo I want to start the server and then keep it running to access the logs in the terminal.
docker run --rm -v "$(pwd)/src:/usr/share/nginx/html/" -p "5000:80" --name simple-map vteam-simple-map:1.0

# This can be removed, but it's good if the images gets removed for others to keep it cleaner.
docker rmi vteam-simple-map:1.0
