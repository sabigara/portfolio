FROM python:3.7-alpine

RUN echo "http://dl-8.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories
RUN apk update
RUN apk upgrade
RUN apk add --update curl gcc g++
RUN ln -s /usr/include/locale.h /usr/include/xlocale.h

RUN mkdir -p /opt/portfolio
COPY . /opt/portfolio

WORKDIR /opt/portfolio

# RUN chmod +x /opt/portfolio/start.sh
# RUN chmod +x /opt/portfolio/stop.sh

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "portfolio.wsgi"]