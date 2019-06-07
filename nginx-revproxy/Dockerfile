FROM nginx:1.13

RUN apt-get update
RUN apt-get install -y wget
RUN wget https://github.com/progrium/entrykit/releases/download/v0.4.0/entrykit_0.4.0_linux_x86_64.tgz
RUN tar -xvzf entrykit_0.4.0_linux_x86_64.tgz
RUN rm entrykit_0.4.0_linux_x86_64.tgz
RUN mv entrykit /usr/local/bin/
RUN entrykit --symlink

ADD https://dl.eff.org/certbot-auto /usr/local/bin/certbot-auto
RUN chmod a+x /usr/local/bin/certbot-auto
RUN certbot-auto --os-packages-only -n
COPY ./cmd.sh /usr/local/bin/cmd.sh
RUN chmod +x /usr/local/bin/cmd.sh

RUN certbot-auto certonly --standalone -d matsura-yuma.site -d www.matsura-yuma.site -m lemonburst1958@gmail.com --agree-tos -n


# RUN git clone https://github.com/letsencrypt/letsencrypt
# WORKDIR letsencrypt
# RUN ls
# RUN ./letsencrypt-auto --help
# RUN ./letsencrypt-auto certonly --webroot -w /static -d matsura-yuma.site -d www.matsura-yuma.com -m lemonburst1958@gmail.com --agree-tos -n

# RUN apt install letsencrypt
# RUN letsencrypt certonly --webroot -w 

RUN rm /etc/nginx/conf.d/*
COPY nginx.conf.tmpl /etc/nginx/
COPY conf.d/ /etc/nginx/conf.d/

ENTRYPOINT [ \
  "render", \
      "/etc/nginx/nginx.conf", \
      "--", \
  "render", \
      "/etc/nginx/conf.d/upstream.conf", \
      "--", \
  "render", \
      "/etc/nginx/conf.d/public.conf", \
      "--" \
]

CMD ["nginx", "-g", "daemon off;"]
