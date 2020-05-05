## VSS - Challenge Task

## Start app 

Run the following commands line by line. The app is now available on [localhost:9443](localhost:9443).

```bash
git clone https://github.com/moschi/VSS_CT.git

cd docker/jass && npm run build && cd .. 

docker-compose --file .\jasstable.yml --project-name CT --project-directory . up -d --build --remove-orphans

```

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

App opens on: [localhost:3000](localhost:3000)

production build: 

```bash
npm run build
```

This creates the production build in [jass/build](./jass/build).








