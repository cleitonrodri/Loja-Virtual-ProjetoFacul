# Usa uma versão do Node.js
FROM node:18-alpine

# Cria a pasta do app dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de configuração do NPM
COPY package*.json ./

# Instala as dependências (express, mysql2, cors, dotenv)
RUN npm install

# Copia todo o resto do código backend
COPY . .

# Expõe a porta que o server.js usa
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "server.js"]