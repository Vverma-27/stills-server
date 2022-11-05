FROM node:16
WORKDIR /app
COPY package.json ./package.json
# RUN yarn install
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; \
    then yarn install --production; \
    else yarn install; \
    fi
COPY . ./
ENV PORT 3000
RUN export GOOGLE_APPLICATION_CREDENTIALS="/app/service-account-file.json"
EXPOSE ${PORT}