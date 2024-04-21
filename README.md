<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## API de Ecommerce

¡Bienvenido a la API de nuestro ecommerce! Esta API está diseñada para proporcionar acceso a una variedad de recursos relacionados con la gestión de productos, usuarios y pedidos en nuestra plataforma de ecommerce.

## Recursos Disponibles

## Autenticación

La API de este ecommerce requiere autenticación para ciertas operaciones. Utilizamos JSON Web Tokens (JWT) para autenticar a los usuarios.
Para obtener un token JWT, inicia sesión utilizando el endpoint /auth/signin.

    POST /auth/signup: Crea un nuevo nuevo usuario en la plataforma.
    POST /auth/signin: Inicia sesion en la plataforma.

### Usuarios

    GET /users: Obtiene una lista de todos los usuarios registrados.
    GET /users/{id}: Obtiene los detalles de un usuario específico por su ID.
    GET /users/{QueryParam}: Obtiene los detalles de un usuario específico por su Nombre ingresado por QUERY PARAMETERS.
    PUT /users/{id}: Actualiza los detalles de un usuario existente por su ID.
    DELETE /users/{id}: Elimina un usuario de la plataforma por su ID.

### Productos

    GET /products: Obtiene una lista de todos los productos disponibles.
    GET /products/{id}: Obtiene los detalles de un producto específico por su ID.
    GET /users/{QueryParam}: Obtiene los detalles de un producto específico por su Nombre ingresado por QUERY PARAMETERS.
    POST /products: Crea un nuevo producto en la plataforma.
    POST /products/multiple: Crea varios productos al mismo tiempo en la plataforma.
    PUT /products/{id}: Actualiza los detalles de un producto existente por su ID.
    DELETE /products/{id}: Elimina un producto de la plataforma por su ID.

### Categorias

    GET /categories: Obtiene una lista de todas las categorias disponibles.

### Ordenes

    GET /pedidos/{id}: Obtiene los detalles de una orden específica por su ID.
    POST /orders: Crea una nueva orden de compra en la plataforma.

### Cargar de imagen y asignacion

    POST /files/uploadimage/{id}: Cargar imagen de un producto en la nube y lo asigna a un producto especifico por su ID.

### Busqueda de articulos

    POST /consults: Realiza una busqueda de un articulo ingresado como parametro, devuelve una lista de articulos relacionados a su busqueda.

## Description

Proyecto Backend de un ecommerce utilizando el framework [Nest](https://github.com/nestjs/nest).