# Usa Node oficial (mejor LTS)
FROM node:20

# Establece directorio de trabajo
WORKDIR /usr/src/app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia todo el código fuente
COPY . .

# Expone el puerto de la app
EXPOSE 4000

# Comando por defecto
CMD ["npm","run", "prod"]
