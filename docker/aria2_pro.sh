#!/bin/bash

docker run -d \
    --name aria2-pro \
    --restart unless-stopped \
    --log-opt max-size=1m \
    -e PUID=$UID \
    -e PGID=$GID \
    -e UMASK_SET=022 \
    -e RPC_SECRET=ahlson \
    -e RPC_PORT=6800 \
    -p 6800:6800 \
    -e LISTEN_PORT=6888 \
    -p 6888:6888 \
    -p 6888:6888/udp \
    -v /home/Aira2Pro/config:/config \
    -v /home/Alist/downloads:/downloads \
    -v /home/Aira2Pro/Alist:/opt/alist/data/temp/aria2 \
    p3terx/aria2-pro
