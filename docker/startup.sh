#!/usr/bin/env bash
sudo docker-compose --file jasstable.yml --project-name CT --project-directory . up -d --build --remove-orphans
