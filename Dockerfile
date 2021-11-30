
# [Choice] Ubuntu version: hirsute, bionic, focal
ARG VARIANT="focal"
FROM mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT} AS focal
WORKDIR /focal
COPY . /focal/

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        build-essential \
        git \
        vim \
        man \
        manpages-dev \
        strace \
        gdb

FROM mcr.microsoft.com/vscode/devcontainers/go:latest AS GO
WORKDIR /go/src/github.com/MizushimaToshihiko/safety/testserver
# Golang 環境構築(任意)
RUN go get golang.org/x/tools/gopls \
  golang.org/x/tools/cmd/godoc

RUN go install github.com/tenntenn/goplayground/cmd/gp@latest
RUN go get -u github.com/kisielk/errcheck

FROM node:latest
WORKDIR /workspace
RUN yarn global add @google/clasp
RUN yarn install
COPY --from=focal /focal .
COPY --from=GO /go/src/github.com/MizushimaToshihiko/safety/testserver .
