FROM mcr.microsoft.com/vscode/devcontainers/go:latest AS GO
WORKDIR /go/src/github.com/MizushimaToshihiko/safety/testserver
# Golang 環境構築(任意)
RUN go get golang.org/x/tools/gopls \
  golang.org/x/tools/cmd/godoc
RUN go get -u github.com/kisielk/errcheck

RUN apt-get -y update
RUN apt-get install -y \
    curl \
    gnupg
RUN curl -sL https://deb.nodesource.com/setup_17.x | bash -
RUN apt-get install -y nodejs
RUN npm install npm@latest -g

RUN yarn global add @google/clasp
RUN yarn install