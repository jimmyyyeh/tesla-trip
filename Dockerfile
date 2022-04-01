# Buster-slim Node(Erbium) 12.20.2 LTS
FROM node:14-buster-slim
LABEL maintainer="Jimmy Yeh <chienfeng0719@hotmail.com>"

# Prepare packages
ARG PRODUCT_NAME="app"
ENV ENV="/root/.bashrc"
RUN mkdir -p /${PRODUCT_NAME}
RUN apt update && apt install -y vim
RUN yarn global add @vue/cli
WORKDIR /${PRODUCT_NAME}

