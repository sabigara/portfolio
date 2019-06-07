#!/bin/bash
certbot-auto --nginx -d matsura-yuma.site -d www.matsura-yuma.site -m lemonburst1958@gmail.com --agree-tos -n
# certbot-auto certonly --standalone -d matsura-yuma.site -d www.matsura-yuma.site -m lemonburst1958@gmail.com --agree-tos -n
certbot-auto renew