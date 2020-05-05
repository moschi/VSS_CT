## VSS - Challenge Task

This document explains how to start and work with the application. The Documentation can be found [here](./Docu.md).

## Start up

Run the following commands line by line. 

```bash
git clone https://github.com/moschi/VSS_CT.git

cd docker/jass && npm run build && cd .. 

docker-compose --file .\jasstable.yml --project-name CT --project-directory . up -d --build --remove-orphans

```

The app is now available on [localhost:9443](localhost:9443), login with the credentials: "moe:test".

### Frontend

The frontend can be run standalone for local development with the following commands: 

install: 
```bash
cd jass
npm install 
```

start: 
```bash
npm start
```

App opens on: [localhost:3000](localhost:3000). Note: all requests are mocked. 

production build: 

```bash
npm run build
```

This creates the production build in [jass/build](./jass/build).


