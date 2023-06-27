FROM node:10.11.0-alpine

ENV COLLECTION=""
ENV ENV_FILE=""


# setting the work direcotry
WORKDIR /etc/newman

# copy package.json
COPY ./package.json .

RUN npm install

RUN mkdir /src

#COPY ./src /etc/newman/src
#VOLUME [ "/src:/etc/newman/src" ] 

#CMD ["sh", "-c", "npm run execute", "-- -e \"${ENV_FILE}\" -c  \"${COLLECTION}\""]
#CMD sh -c npm run execute -- -e "$ENV_FILE" -c "$COLLECTION"


CMD ["sh", "-c", "npm run execute -- -e \"${ENV_FILE}\" -c  \"${COLLECTION}\""]
