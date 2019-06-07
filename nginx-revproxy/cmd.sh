#!/bin/bash
certbot-auto --nginx -d matsura-yuma.site -d www.matsura-yuma.com -m lemonburst1958@gmail.com --agree-tos -n
certbot-auto renew