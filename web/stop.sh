#! /bin/sh

kill -9 `ps aux |grep gunicorn |grep your_app_name | awk '{ print $2 }'`