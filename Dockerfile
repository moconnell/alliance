FROM node:16-alpine

COPY . /usr/src/app

WORKDIR /usr/src/app

COPY $PWD/.env.docker $PWD/.env

# install make
RUN apk add --update make

# install GCC
RUN apk add --update build-base

# install Python
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# install Concurrently
RUN npm install -g concurrently

# install deps
RUN npm ci

ENTRYPOINT ["concurrently", "npm:start-local", "npm:deploy-local"]