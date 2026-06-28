# TPI - Base de Datos II - Parte 2

## Plataforma de Streaming

### Integrantes

* Carina Elizabeth Aranchet
* Astrid Ayelen Añazco

---

## Descripción

Este proyecto corresponde a la segunda etapa del Trabajo Práctico Integrador de la materia **Base de Datos II**.

El objetivo consiste en conectar el clúster de **MongoDB Atlas**, desarrollado en la Parte 1, con una aplicación backend desarrollada en **Node.js**, implementando las operaciones básicas CRUD (Create, Read, Update y Delete) y un mecanismo de respaldo físico mediante `mongodump`.

---

## Tecnologías utilizadas

* Node.js
* Express
* MongoDB Driver
* MongoDB Atlas
* Git
* GitHub

---

## Requisitos

Antes de ejecutar el proyecto es necesario tener instalado:

* Node.js 20 o superior
* npm
* MongoDB Database Tools (para utilizar `mongodump`)

---

## Instalación

Instalar dependencias:

```bash
npm install
```

---

## Ejecutar la aplicación

```bash
npm run dev
```

El servidor iniciará en:

```
http://localhost:3000
```

---

## Operaciones CRUD

La aplicación implementa las siguientes operaciones sobre la colección **usuarios**:

* Crear usuario
* Consultar usuarios activos
* Modificar usuarios existentes
* Baja lógica mediante actualización de los campos `activo` y `fechaBaja`

---

## Backups

El proyecto incluye un script `backup.bat` que realiza un respaldo completo de la base de datos utilizando `mongodump`.

Al ejecutarlo se genera automáticamente la siguiente estructura:

```
resguardos_tpi/
└── AAAA-MM-DD/
    └── streaming_tpi/
```

---

## Estructura del proyecto

```
tpi-parte2/

src/
│
├── app.js
├── db.js
└── usuarios.routes.js

.env
package.json
backup.bat
```

---

## Autoras

* Carina Elizabeth Aranchet
* Astrid Ayelen Añazco

Universidad Tecnológica Nacional – Tecnicatura Universitaria en Programación

Base de Datos II – 2026
