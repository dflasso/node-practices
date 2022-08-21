# Prerequisitos 

## Install CLI de nest
```bash
node --version
npm i -g @nestjs/cli
nest --version
nest --help
```

## Crear un proyecto
```bash
nest new <nombre_proyecto>
```

# Estructura de proyecto
1. Node_modules:
Todo proyecto de Javascript posee este directorio donde se almacenan las librerías y dependencias que se descarguen con NPM.

2. SRC:
Directorio principal del proyecto donde encontramos:

- app.controller.spec.ts: archivo de pruebas unitarias del controlador con el mismo nombre.
- app.controller.ts: controlador que contiene endpoints a diferentes recursos.
- app.module.ts: módulo principal de toda la aplicación NestJS.
- app.service.ts: servicio consumido por los controladores para determinados propósitos.
- main.ts: archivo Core de la aplicación NestJS donde se realizan configuraciones e imports básicos para su funcionamiento.
3. Test:
Directorio de pruebas unitarias y de integración. NestJS utiliza por defecto Jest para escribir las pruebas.

- .editorconfig: este archivo no viene por defecto, pero se recomienda crearlo e instalar el plugin con el mismo nombre en el editor. Permite autoformatear los archivos, espacios, indentación, etc.
- .eslintrc.js: permite la configuración de un analizador de código para detectar tempranamente errores y resolverlos. - Requiere instalación de un plugin en el editor.
- .gitignore: indicarle a GIT qué archivos/directorios ignorar.
.prettierrc: archivo de configuración para el autoformateo de código. Requiere instalación de un plugin en el editor.
- nest-cli.json: archivo con configuraciones de NestJS. Algunos plugins del framework requieren de configuraciones adicionales en este archivo.
- package-lock.json: describe las dependencias exactas que se generaron en la instalación del proyecto.
- package.json: archivo para el manejo de dependencias, scripts y metadatos relevantes para el proyecto.
- README.md: archivo markdown para la documentación del proyecto.
- tsconfig.build.json: archivo principal para la configuración de TypeScript.
- tsconfig.json: extensión con más configuraciones de TypeScript.

# Arquitectura
![architecture nest.js](https://static.platzi.com/media/user_upload/Captura-072763bb-e6fd-4917-bdc1-797a1768890e.jpg)

# Indice
1. [Controladores](#id1)
2. [GET: cómo recibir parámetros](#id2)
3. [Parámetros de ruta vs Parámetros query](#id3)
4. [Separación de responsabilidades](#id4)
5. [Estructura recomendada para los archivos](#id5)
6. [método POST](#id6)
7. [método Put](#id7)
8. [Códigos de estado o HTTP response status codes](#id8)
9. [Eliminar datos con DELETE](#id9)
10. [Códigos de estado o HTTP response status codes](#id10)
11. [Qué son los servicios en NestJS](#id11)
12. [Implementando servicios en tu controlador](#id12)
13. [Manejo de errores](#id13)
14. [Introducción a pipes](#id14)
15. [Custom pipes](#id15)
16. [Data Transfers Objects](#id16)
17. [Validar parámetros con class-validator y mapped-types](#id17)
18. [Evitar parámetros incorrectos](#id18)

<div id='id1' />

# Controladores
Los controladores son los encargados de recibir los request de nuestra aplicación.

Estas request son las peticiones que llegan a nuestra aplicación desde un cliente web, móvil, etc, que vienen a través del protocolo HTTP.

Entre sus funciones están el de validar los request, que sus permisos y datos sean los correctos, y según el resultado de esa validación permitir su acceso a la capa de servicios para poder obtener los datos.

Al ser una petición que viaja a través del protocolo HTTP va a utilizar los verbos:
- GET : Obtener recursos
- PUT : Actualizar recursos
- POST : Crear recursos
- DELETE : Eliminar recursos

Los controladores se definen con una clase acompañada de un decorador, quien va a indicar cual será el comportamiento de dicho decorador.

## Estructura de un controlador
La aplicación de NestJS creada por defecto con el CLI con el comando nest new <project-name> trae consigo un controlador básico con el nombre app.controller.ts. Verás que dicho archivo contiene una clase que a su vez posee un decorador llamado @Controller().

Dicho decorador le indica al compilador de NestJS que esta clase tendrá el comportamiento de un controlador.

```js

// app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```
Los controladores deben ser importados en un módulo para que sean reconocidos los endpoints.


```js
// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [
    // Imports de Controladores
    AppController
  ],
})
export class AppModule {}
```

El controlador importa un servicio que son los responsables de la lógica y obtención de datos desde una BBDD que el controlador requiere.

```js
// app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

Puedes correr el servidor de NestJS con el comando npm run start:dev e ingresar a la ruta localhost:3000/ para visualizar el contenido que el controlador envía.

Si quieres crear una nueva ruta, basta con crear un método en la clase del controlador y colocarle el decorador @Get() con un nombre para el nuevo endpoint.

```js
// app.controller.ts
@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('new-endpoint')
  newEndpoint(): string {
    return 'New endpoint';
  }
}
```
Ingresa a esta nueva ruta desde localhost:3000/new-endpoint para visualizar su respuesta y así crear los endpoints que necesites.



# GET: cómo recibir parámetros
<div id='id2' />
En particular, el verbo GET suele utilizarse para endpoints que permiten la obtención de datos como un producto o una lista de productos.

Es frecuente la necesidad de que este tipo de endpoints también reciban información dinámica en las URL como el identificador de un producto.

Para capturar estos datos en NestJS, tienes que importar el decorador Param desde @nestjs/common y emplearlo de la siguiente manera en tus endpoints.

```js
import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  //primera forma
  @Get('product/:idProduct')
  getProduct1(@Param() params: any): string {
    return `Producto id: ${params.idProduct}`;
  }
//segunda forma
  @Get('product/:idProduct')
  getProduct2(@Param('idProduct') idProduct: string): string {
    return `Producto id: ${idProduct}`;
  }
}
```

Observa el decorador @Get() que posee el nombre del endpoint seguido de un :idProduct que identifica al parámetro dinámico. Luego puedes implementar el decorador @Param() para capturar todos los parámetros juntos en un objeto o @Param('idProduct') para capturar únicamente el parámetro con dicho nombre.

De esta forma, accede en un navegador a localhost:3000/product/12345 para capturar ese 12345 y posteriormente utilizarlo.
```js
import { ..., Param } from '@nestjs/common';
...

@Controller()
export class AppController {
  ...

  @Get('products/:productId')
  getProduct(@Param('productId') productId: string) {
    return `product ${productId}`;
  }

  @Get('categories/:id/products/:productId')
  getCategory(@Param('productId') productId: string, @Param('id') id: string) {
    return `product ${productId} and ${id}`;
  }
}
```

# Parámetros de ruta vs Parámetros query
<div id='id3' />
Los parámetros de ruta son aquellos que forman parte del propio endpoint y suelen ser parámetros obligatorios.

```js
@Get('product/:idProduct')
getProduct2(@Param('idProduct') idProduct: string): string {
    return `Producto id: ${idProduct}`;
}
```
En NestJS se capturan con el decorador @Param().

Por otro lado, están los parámetros de consulta o query en las URL como por ejemplo example.com/products?limit=10&offset=20 que se capturan con el decorador @Query() importado desde @nestjs/common.

```js
@Get('products')
getProducts(@Query('limit') limit = 10, @Query('offset') offset = 0): string {
    return `Lista de productos limit=${limit} offset=${offset}`;
}
```

Su principal diferencia es que los parámetros de consulta suelen ser opcionales; el comportamiento del endpoint tiene que contemplar que estos datos pueden no existir con un valor por defecto.

Los parámetros de ruta se utilizan para IDs u otros identificadores obligatorios, mientras que los parámetros de consulta se utilizan para aplicar filtros opcionales a una consulta. Utilízalos apropiadamente en tus endpoints según tengas la necesidad.

## Evitando el bloqueo de rutas
Un importante consejo a tener en cuenta para construir aplicaciones con NestJS es asegurar que un endpoint no esté bloqueando a otro.
Por ejemplo:

```js
/* Ejemplo Bloqueo de Endpoints */
@Get('products/:idProduct')
endpoint1() {
    // ...
}
@Get('products/filter')
endpoint2() {
    // ...
}
```

El endpoint1 bloquea al **endpoint2, ya que este está esperando un parámetro :idProduct y si llamamos a localhost:3000/products/filter NestJS entenderá que la palabra filter es el ID que espera el primer endpoint ocasionando que no sea posible acceder al segundo endpoint.

Se soluciona de forma muy sencilla invirtiendo el orden de los mismos. Coloca los endpoints dinámicos en segundo lugar para que no ocasionen problemas.

```js
/* Solución Bloqueo de Endpoints */
@Get('products/filter')
endpoint2() {
    // ...
}
@Get('products/:idProduct')
endpoint1() {
    // ...
}
```

Este es un inconveniente común que suele suceder en NestJS y es importante que lo conozcas para evitar dolores de cabeza.

```js
import { ..., Query } from '@nestjs/common';

@Controller()
export class AppController {
  ...

  @Get('products')
  getProducts(
    @Query('limit') limit = 100,
    @Query('offset') offset = 0,
    @Query('brand') brand: string,
  ) {
    return `products limit=> ${limit} offset=> ${offset} brand=> ${brand}`;
  }

  @Get('products/filter')
  getProductFilter() {
    return `yo soy un filter`;
  }
}
```

# Separación de responsabilidades
<div id='id4' />
NestJS le da mucha importancia a los Principios SOLID en el desarrollo de software para mantener las buenas prácticas de codificación. Una de ellas es la responsabilidad única.

## Qué es la responsabilidad única

La S de SOLID hace referencia a “Single Responsibility” y recomienda que cada pieza de software debe tener una única función. Por ejemplo, un controlador de productos no debería encargarse de categorías o de usuarios. Se debe crear un controlador para cada entidad que la aplicación necesite.

Lo mismo ocurre con los métodos. Un método para la obtención de datos solo debe realizar dicha acción y no estar actualizando o manipulando los datos de otra manera.

### Responsabilidades en NestJS
En NestJS, una buena práctica es crear un directorio llamado controllers donde se agruparán todos los controladores que tu aplicación necesite. Ese ya es un buen paso para mantener el orden en tu proyecto.

Apóyate del CLI de NestJS para autogenerar código rápidamente con el comando:
```bash
nest generate controller <controller-name>
```
o en su forma corta:
```bash
nest g co <controller-name>.
```

Es una buena forma de comenzar a seguir las buenas prácticas a la hora de escribir código y estructurar una aplicación.

Controllers y responsabilidades
```shell
nest g cor controllers/categories --flat
```
src/controllers/categories.controller.ts

```js
import { Controller, Get, Param } from '@nestjs/common';

@Controller('categories') // 👈 Route
export class CategoriesController {

  @Get(':id/products/:productId')
  getCategory(
    @Param('productId') productId: string,
    @Param('id') id: string
  ) {
    return `product ${productId} and ${id}`;
  }
}
```

src/app.module.ts
```js
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './controllers/products.controller';
import { CategoriesController } from './controllers/categories.controller';

@Module({
  imports: [],
  controllers: [
   AppController,
   ProductsController, // 👈 New controller
   CategoriesController  // 👈 New controller
  ],
  providers: [AppService],
})
export class AppModule {}
```

# Estructura recomendada para los archivos

![structure suggestion project](https://res.cloudinary.com/dph6ckco5/image/upload/v1620580068/Captura_de_pantalla_de_2021-05-09_14-05-23_wtwulh.png)

Comandos del cli

```
nest g co modules/order/controller/order --flat
nest g mo modules/order/module/order --flat
nest g s modules/order/service/order --flat
```

# método POST
<div id='id6' />
Así como el verbo HTTP GET se utiliza para la obtención de datos, el verbo HTTP Post se utiliza para la creación de los mismos previamente.

## Qué es el método Post
Es el método para creación de datos. Para utilizarlo en Nest.js debemos importar el decorador.

## Crear registro con Post
En tu proyecto NestJS, tienes que importar los decoradores Post y Body desde @nestjs/common. El primero para indicar que el endpoint es del tipo POST y el segundo para capturar los datos provenientes del front-end en el cuerpo del mensaje.

```js
import { Controller, Post, Body } from '@nestjs/common';

@Controller()
export class AppController {

  @Post('product')
  createProducto(@Body() body: any): any {
    return {
      name: body.name,
      price: body.price
    };
  }
}
```
Un buen endpoint del tipo POST tiene que devolver el registro completo recientemente insertado en la BBDD para que el front-end pueda actualizarse inmediatamente y no tener que realizar una consulta por el mismo.

Recuerda también que, al tratarse de un endpoint POST, no puedes realizar la solicitud desde el navegador al igual que con los endpoints GET. Para probar tu aplicación, tienes que utilizar una plataforma de APIs como Postman.
```js
import { ..., Post, Body } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  ...

  @Post() // 👈 New decorator
  create(@Body() payload: any) {
    return {
      message: 'accion de crear',
      payload,
    };
  }
}
```

# Métodos PUT 
<div id='id7' />
El verbo HTTP GET se utiliza para la obtención de datos y el verbo POST para la creación de estos. También existe el verbo PUT y DELETE para la actualización y borrado de datos respectivamente.

## Actualización de datos con PUT
El verbo PUT se usa para la actualización de un registro en la BBDD. Suele recibir un Body con los datos a actualizar, pero también es importante que reciba el ID del registro para buscar al mismo.

```js
import { Controller, Put, Param, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  @Put('product/:idProduct')
  updateProducto(@Param('idProduct') idProduct: string, @Body() body: any): any {
    return {
      idProduct: idProduct,
      name: body.newName,
      price: body.newPrice
    };
  }
}
```

El ID suele recibirse por parámetros de URL para que sea obligatorio, mientras que reservamos el cuerpo del mensaje para los datos actualizados. Finalmente, retornamos el registro completo luego de ser actualizado.

# Eliminar datos con DELETE
<div id='id9' />
Eliminar un registro es sencillo. Basta con decorar el endpoint con DELETE. Suele recibir el ID del registro a borrar únicamente.

```js
import { Controller, Delete, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  @Delete('product')
  deleteProducto(@Param('idProduct') idProduct: string): any {
    return {
      idProduct: idProduct,
      delete: true,
      count: 1
    };
  }
}
```

Una buena práctica para este tipo de endpoints es retornar un booleano que indique si el registro fue eliminado o no. Además de incluir un count que indique cuántos registros fueron eliminados.

**src/controllers/products.controller.ts**

```js
import {..., Put, Delete } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  ...
  @Put(':id')
  update(@Param('id') id: number, @Body() payload: any) {
    return {
      id,
      payload,
    };
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return id;
  }
}
```
# Códigos de estado o HTTP response status codes
<div id='id10' />
El protocolo HTTP tiene estandarizado una lista de códigos de estado que indican los tipos de respuesta que las API deben enviar dependiendo la situación. Como profesional en el desarrollo de software, debes conocerlos y diferenciarlos.

## Cuáles son los códigos HTTP
Hay cinco familias de códigos de estado HTTP que tienes que utilizar apropiadamente para que tus APIs informen correctamente la situación de la solicitud.

- Estados informativos (100–199)
- Estados de éxito (200–299) 
- Estados de redirección (300–399)
- Estados de error del cliente (400–499)
- Estados de error del servidor (500–599)

## Cómo manejar los códigos de estado HTTP con NestJS
En NestJS, puedes manejar los códigos de estado HTTP importando el decorador HttpCode y el enumerado HttpStatus desde @nestjs/common.

El primero te servirá para indicar cuál será el código de estado HTTP que un endpoint tiene que devolver; el segundo para ayudarte por si no recuerdas qué código pertenece a cada tipo de respuesta.

```js
import { Controller, HttpCode, HttpStatus } from '@nestjs/common';

@Get('product/:idProduct')
@HttpCode(HttpStatus.OK)
getProduct2(@Param('idProduct') idProduct: string): string {
    return `Producto id: ${idProduct}`;
}

@Post('product')
@HttpCode(HttpStatus.CREATED)
createProducto(@Body() body: any): any {
    return {
      name: body.name,
      price: body.price
    };
}
```
El enumerado HttpStatus.OK indica código de estado 200 que es el que suele devolver por defecto todos los endpoints cuando la operación sale exitosamente. Los endpoints POST suelen devolver HttpStatus.CREATED o código 201 para indicar la creación exitosa del registro.

**src/controllers/products.controller.ts**
```js
import { ..., HttpStatus, HttpCode, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('products')
export class ProductsController {
  ...
  @Get(':productId')
  @HttpCode(HttpStatus.ACCEPTED) // 👈 Using decorator
  getOne(
    @Res() response: Response,
    @Param('productId') productId: string
  ) {
    response.status(200).send({...}); // 👈 Using express directly
  }
}
```

# Qué son los servicios en NestJS
<div id='id11' />
Los servicios son una pieza esencial de las aplicaciones realizadas con el framework NestJS. Están pensados para proporcionar una capa de acceso a los datos que necesitan las aplicaciones para funcionar.

Un servicio tiene la responsabilidad de gestionar el trabajo con los datos de la aplicación, de modo que realiza las operaciones para obtener esos datos, modificarlos, etc.

## Primer servicio con NestJS
Para crear un servicio puedes utilizar el comando:
```
nest generate service <service-name>
```
o en su forma corta:
```
nest g s <service-name>
```
Los servicios utilizan el decorador **@Injectable()** y deben ser importados en los providers del módulo al que pertenecen o tu aplicación no lo reconocerá y tendrás errores al levantar el servidor.

```js
// app.module.ts
import { Module } from '@nestjs/common';
import { AppService } from './app.service';

@Module({
  imports: [],
  providers: [
    // Imports de Servicios
    AppService
  ],
})
export class AppModule {}
```
Crea un método en el servicio para cada propósito que necesites. Uno para obtener un producto, otro para obtener un listado de productos. Uno para crear producto, para actualizar, eliminar, etc.

## Servicios en NestJS
```js
// src/entities/product.entity.ts

export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}
```

```
nest g s services/products --flat
```

```js
// src/services/products.service.ts
import { Injectable } from '@nestjs/common';

import { Product } from './../entities/product.entity';

@Injectable()
export class ProductsService {
  private counterId = 1;
  private products: Product[] = [
    {
      id: 1,
      name: 'Product 1',
      description: 'bla bla',
      price: 122,
      image: '',
      stock: 12,
    },
  ];

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    return this.products.find((item) => item.id === id);
  }

  create(payload: any) {
    this.counterId = this.counterId + 1;
    const newProduct = {
      id: this.counterId,
      ...payload,
    };
    this.products.push(newProduct);
    return newProduct;
  }

   update(id: number, payload: any) {
    const product = this.findOne(id);
    if (product) {
      const index = this.products.findIndex((item) => item.id === id);
      this.products[index] = {
        ...product,
        ...payload,
      };
      return this.products[index];
    }
    return null;
  }
}
```

```js
// src/app.module.ts
import { Module } from '@nestjs/common';
...
import { ProductsService } from './services/products.service';

@Module({
  imports: [],
  controllers: [...],
  providers: [AppService, ProductsService], // 👈 New Service
})
export class AppModule {}
```

# Implementando servicios en tu controlador
<div id='id12' />
Los servicios son el otro 50% de los controladores. Podría decirse que un controlador siempre hará uso de uno o más servicios para implementar lógica de negocio. Veamos cómo se relacionan.

## Inyección de dependencias
Antes de hablar de la relación entre servicios y controladores, hay que hablar del patrón de diseño que NestJS utiliza internamente.

Imagínate que tienes un Servicio A que utiliza el Servicio B y este a su vez utiliza el Servicio C. Si tuvieses que instanciar el Servicio A, primero deberías instanciar el C para poder instanciar el B y luego sí hacerlo con el A. Se vuelve confuso y poco escalable si en algún momento también tienes que instanciar el Servicio D o E.

La inyección de dependencias llega para solucionar esto, resolver las dependencias de una clase por nosotros. Cuando instanciamos en el constructor el Servicio A, NestJS internamente crea automáticamente la instancia del servicio B y C sin que nosotros nos tengamos que preocupar por estos.

## Controladores y servicios
Los controladores inyectan los servicios desde el constructor. De esta manera, cada endpoint puede hacer uso de la lógica del servicio.

```js
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```
Importa los servicios que necesites, pero hazlo de una manera controlada para mantener la escalabilidad de tu proyecto. Si necesitas importar 20 servicios en un mismo controlador, tal vez tengas que mejorar la estructura del proyecto.

### Controllers

```js
// src/controllers/products.controller.ts

import { ProductsService } from './../services/products.service';


@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProducts(...) {
    return this.productsService.findAll();
  }

  @Get(':productId')
  getOne(...) {
    return this.productsService.findOne(+productId);
  }

  @Post()
  create(..) {
    return this.productsService.create(payload);
  }

  @Put(':id')
  update(...) {
    return this.productsService.update(+id, payload);
  }

}
```

# Manejo de errores con throw: NotFoundException, ForbiddenException, InternalServerErrorException o HttpException 
<div id='id12' />
Desarrollar una API correctamente también implica manejar los errores que sus endpoints pueden tener de manera clara para el front-end.

## Manejo de errores con NestJS
NestJS implementa de forma muy sencilla la posibilidad de responder con errores al cliente que realiza las consultas. Esto lo hace con una serie de clases que implementan los códigos HTTP correctos dependiendo el tipo de error que necesites.

```js
import { NotFoundException } from '@nestjs/common';

@Get('product/:idProduct')
@HttpCode(HttpStatus.OK)
async getProduct(@Param('idProduct') idProduct: string): string {
  const product = await this.appService.getProducto(idProduct);
  if (!product) {
      throw new NotFoundException(`Producto con ID #${idProduct} no encontrado.`);
  }
  return product;
}
```

Importando NotFoundException puedes arrojar un error con la palabra reservada throw indicando que un registro no fue encontrado. Esta excepción cambiará el estado HTTP 200 que envía el decorador @HttpCode(HttpStatus.OK) por un 404 que es el correspondiente para la ocasión.

También puedes lanzar errores cuando el usuario no tiene permisos para acceder a un recurso.
```js
import { ForbiddenException } from '@nestjs/common';

@Get('product/:idProduct')
@HttpCode(HttpStatus.OK)
async getProduct(@Param('idProduct') idProduct: string): string {
  // ...
  throw new ForbiddenException(`Acceso prohibido a este recurso.`);
}
```

O incluso lanzar errores de la familia del 5XX cuando ocurre un error inesperado en el servidor.

```js
import { InternalServerErrorException } from '@nestjs/common';

@Get('product/:idProduct')
@HttpCode(HttpStatus.OK)
async getProduct(@Param('idProduct') idProduct: string): string {
  // ...
  throw new InternalServerErrorException(`Ha ocurrido un error inesperado.`);
}
```

Explora todas las clases con estados HTTP que NestJS posee para desarrollar tus endpoints de manera profesional y manejar correctamente los errores.

### SRC services

```js
// src/services/products.service.ts

import { ..., NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductsService {
  ...

  findOne(id: number) {
    const product = this.products.find((item) => item.id === id);
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  update(id: number, payload: any) {
    const product = this.findOne(id);
    const index = this.products.findIndex((item) => item.id === id);
    this.products[index] = {
      ...product,
      ...payload,
    };
    return this.products[index];
  }

  remove(id: number) {
    const index = this.products.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    this.products.splice(index, 1);
    return true;
  }
}

```

Otra forma de manejar excepciones es con el modulo HttpException seria algo asi:

```js
import { HttpException, HttpStatus } from '@nestjs/common';

// DENTRO DE TU SERVICIO O CONTROLLER
getProducts(){
    throw new HttpException('Error no se encontro', HttpStatus.BAD_REQUEST);
}

```

#### Referencia: 
- [documentación oficial](https://docs.nestjs.com/exception-filters)

# Introducción a pipes
<div id='id14' />
NestJS utiliza el concepto de PIPES para la validación y transformación de los datos antes del ingreso de estos a un controlador.

## Casos de uso de PIPES
Los pipes tienen dos casos de uso típicos:

- Transformación: transforma los datos de entrada a la forma deseada (por ejemplo, de cadena a entero).
- Validación: evalúa los datos de entrada y, si son válidos, simplemente los pasa sin cambios; de lo contrario, lanza una excepción cuando los datos son incorrectos.

## Implementando tu primer PIPE
NestJS ya trae consigo una serie de pipes que puedes utilizar para la manipulación de datos. Impórtalos desde @nestjs/common y úsalos de la siguiente manera.


```js
import { ParseIntPipe } from '@nestjs/common';

@Get('product/:idProduct')
getProduct(@Param('idProduct', ParseIntPipe) idProduct: string): string {
    // ...
}
```

El pipe ParseIntPipe, agrégalo como segundo parámetro del decorador Param para transformar el parámetro idProduct y asegurar que este sea un número entero.

De no serlo, arrojará un error y al mismo tiempo estás protegiendo tu aplicación de datos erróneos o maliciosos.

```js
// src/controllers/products.controller.ts
import {..., ParseIntPipe} from '@nestjs/common';

@Get(':id')
get(@Param('id', ParseIntPipe) id: number) {
  return this.productsService.findOne(id);
}
```
## Referencia 
- [Pipes](https://docs.nestjs.com/pipes#built-in-pipes)

# Crea tu propio pipe
<div id='id15' />

Crear tus propias validaciones de datos será muy importante para segurizar tu aplicación y evitar errores inesperados.

## Cómo crear custom PIPES
Crea tu propio PIPE para implementar lógica custom de validación de datos.

1. Crea tu primer Pipe
Con el CLI de NestJS autogenera un nuevo pipe con el comando:
```nest generate pipe <pipe-name>``` o en su forma corta ```nest g p <pipe-name>```
Por defecto, verás un código como el siguiente.

```js
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {

  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
```

2. Implementa la lógica del Pipe
Implementa aquí tu propia lógica de transformación y validación de datos. Ten en cuenta que si los datos no son válidos, puedes arrojar excepciones para informarle al front-end que los datos son erróneos

```js
import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {

  transform(value: string, metadata: ArgumentMetadata) {
    const finalValue = parseInt(value, 10);
    if (isNaN(finalValue)) {
      throw new BadRequestException(`${value} no es un número.`);
    }
    return finalValue;
  }
}
```
3. Importa y utiliza el Pipe
Finalmente, implementa tu custom PIPE en el controlador.
```js
import { ParseIntPipe } from './pipes/parse-int.pipe';

@Get('product/:idProduct')
getProduct(@Param('idProduct', ParseIntPipe) idProduct: string): string {
    // ...
}
```

Puedes desarrollar la lógica para validar y transformar los datos que más se adecue a tus necesidades. Es fundamental no permitir el ingreso de datos erróneos a tus controladores. Por eso, los pipes son una capa previa a los controladores para realizar esta validación.



# Data Transfers Objects
<div id='id16' />
NestJS utiliza el concepto de Objetos de Transferencia de Datos, o simplemente abreviado como DTO, para el tipado de datos y su segurización.

Qué son objetos de transferencia de datos o data transfers objects
Los DTO no son más que clases customizadas que tu mismo puedes crear para indicar la estructura que tendrán los objetos de entrada en una solicitud.

1. Creando DTO
Crea un nuevo archivo que por lo general lleva como extensión **.dto.ts** para indicar que se trata de un DTO.
```js
// products.dto.ts
export class CreateProductDTO {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly image: string;
}
```
La palabra reservada readonly es propia de TypeScript y nos asegura que dichos datos no sean modificados.

Crea tantos atributos como tu clase CreateProductDTO necesite para dar de alta un nuevo producto.

2. Importando DTO
Importa la clase en tu controlador para tipar el Body del endpoint POST para la creación de un producto.
```js
import { CreateProductDTO } from 'products.dto.ts';

@Post('product')
createProducto(@Body() body: CreateProductDTO): any {
    // ...
}
```
De esta forma, ya conoces la estructura de datos que tendrá el parámetro body previo a la creación de un producto.
```js
// src/controllers/products.controller.ts
export class ProductsController {
  @Post()
  create(@Body() payload: CreateProductDto) { // 👈 Dto
    ...
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateProductDto  // 👈 Dto
   ) { 
   ...
  }

}
```

```js
// src/services/products.service.ts
export class ProductsService {
  create(payload: CreateProductDto) { // 👈 Dto
    ...
  }

  update(id: number, payload: UpdateProductDto) { // 👈 Dto
    ...	
  }

}
```

# Validar parámetros con class-validator y mapped-types
<div id='id17' />
Los DTO no solo sirven para tipar y determinar la estructura de los datos de entrada de un endpoint, también pueden contribuir en la validación de los datos y en la entrega de mensajes al front-end en caso de error en los mismos.

## Validación de datos con DTO
Utiliza el comando ```npm i class-validator class-transformer``` para instalar dos dependencias que nos ayudarán en la validación de los datos.
Estas librerías traen un set de decoradores para las propiedades de los DTO y así validar los tipos de datos de entrada.

```js
import { IsNotEmpty, IsString, IsNumber, IsUrl } from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  
  @IsNotEmpty()
  @IsString()
  readonly description: string;
  
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;
  
  @IsNotEmpty()
  @IsUrl()
  readonly image: string;
}
```
Estas validaciones contribuyen en la experiencia de desarrollo devolviendo mensajes al front-end sobre qué datos están faltando o cuáles no son correctos. Por ejemplo, si en el Body de la petición enviamos.
```json
{
  "name": "Nombre producto",
  "price": 100,
  "image": "imagen"
}
```
El servidor nos devolverá el siguiente mensaje:
```json
{
  "statusCode": 400,
  "message": [
    "description should not be empty",
    "description must be a string",
    "image must be an URL address"
  ],
  "error": "Bad Request"
}
```
Indicando que la solicitud espera de forma obligatoria un campo description del tipo string y un campo image con una URL.
## Cómo reutilizar código de los DTO
A medida que tu aplicación crezca, tendrás que crear muchos DTO, para la creación de un producto, edición, filtros, etc. Una buena práctica es la reutilización de las clases DTO que ya tengas implementado para no repetir propiedades.

Instala la dependencia ```@nestjs/mapped-types``` que nos ayudará con la reutilización de código de la siguiente manera.
```js
import { IsNotEmpty, IsString, IsNumber, IsUrl } from 'class-validator';
import { PartialType, OmitType } from '@nestjs/mapped-types';

export class CreateProductDTO {
  
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  
  @IsNotEmpty()
  @IsString()
  readonly description: string;
  
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;
  
  @IsNotEmpty()
  @IsUrl()
  readonly image: string;
}

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDTO, ['name']),
) {}
```
### Importa PartialType y OmitType desde @nestjs/mapped-types.

PartialType permite extender una clase de otra y que todos sus campos sean opcionales. Así, el DTO UpdateProductDto no tiene como obligatorio sus campos y es posible editar todos o solo uno.

Por otro lado, OmitType, permite la omisión de campos haciendo que cierta cantidad de ellos no formen parte del DTO en el caso de que dichos campos no deban ser editados.
```js
// src/dtos/products.dtos.ts
import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly stock: number;

  @IsUrl()
  @IsNotEmpty()
  readonly image: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

```js
// src/main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  ...
  app.useGlobalPipes(new ValidationPipe());
  ...
}
bootstrap();
```
# Evitar parámetros incorrectos
<div id='id18' />
Los DTO ayudan con el tipado y la validación de datos, además de indicar la obligatoriedad de los mismos para que los registros se creen completos. Es importante también evitar que haya datos que no deben estar en las solicitudes, ya que podrían ser ataques maliciosos.

## Cómo hacer la prohibición de datos
Busca el archivo **main.ts** que contiene el bootstrap de tu aplicación, es decir, el punto inicial de la misma. Agrega aquí la siguiente configuración.
```js
// main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,                    // Ignorar datos que no esten en los DTO
      forbidNonWhitelisted: true,         // Lanzar error si existen datos prohibidos
      disableErrorMessages: process.env.ENVIRONMENT == 'production' ? true : false,         // Desabilitar mensajes de error (producción)
    })
  );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
```
Importa **ValidationPipe** desde ```@nestjs/common``` y configura en true las propiedades ```whitelist``` para ignorar datos que no estén en el DTO. Usa **forbidNonWhitelisted** para lanzar errores si existen datos prohibidos y **disableErrorMessages** que es recomendable activarlo solo en producción para no enviar mensajes de error y no dar información al front-end.

De esta simple manera, tus endpoints gracias a los DTO son súper profesionales, seguros y contribuyen a una buena experiencia de desarrollo.