#!/bin/sh

cd ~/portfolio
sudo git pull https://github.com/sabigara/portfolio
docker-compose up -d --build