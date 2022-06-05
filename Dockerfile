FROM node:lts as dependencies
WORKDIR /graphio-gui
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts as builder
WORKDIR /graphio-gui
COPY . .
COPY --from=dependencies /graphio-gui/node_modules ./node_modules
RUN yarn build

FROM node:lts as runner
WORKDIR /graphio-gui
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /graphio-gui/next.config.js ./
COPY --from=builder /graphio-gui/public ./public
COPY --from=builder /graphio-gui/.next ./.next
COPY --from=builder /graphio-gui/node_modules ./node_modules
COPY --from=builder /graphio-gui/package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]