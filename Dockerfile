FROM node:latest
WORKDIR /workspace
RUN yarn global add @google/clasp
RUN yarn install
COPY . /workspace/