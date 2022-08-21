# Indice
1. [Encapsular lógica en módulos](#id1)
2. [Interacción entre módulos](#id2)
3. [Entendiendo la inyección de dependencias](#id3)
4. [useValue y useClass](#id4)
5. [Módulo de configuración - Manejar variables de entorno](#id5)
6. [useFactory - Inyecciones Asíncronas](#id6)
7. [Global Module](#id7)
8. [Integrando Swagger y PartialType con Open API](#id8)


# Encapsular lógica en módulos
<div id='id1' />
Las aplicaciones profesionales que se desarrollan con NestJS se realizan de forma modularizada para dividir el código fuente de forma lógica y que el proyecto sea más escalable y comprensible.

## Crear un módulo con controllers, services y entities
``` nest g resource users```

### un controllador dentro de un módulo
```nest g co controllers/users users```

## Cómo hacer la modularización de un proyecto en NestJS
Para modularizar una aplicación, el CLI de NestJS trae consigo la posibilidad de autogenerar módulos con el comando ```nest generate module <module-name>``` o en su forma corta ```nest g mo <module-name>```.

Los módulos son simples clases que utilizan el decorador **@Module()** para importar todo lo que construyan al mismo.

```js
import { Module } from '@nestjs/common';

@Module({
  imports: [],             // Importación de otros módulos
  controllers: [],         // Importación de controladores
  providers: [],           // Importación de servicios
})
export class PruebaModule {}
```
De esta manera, un módulo agrupará un conjunto de controladores y servicios, además de importar otros módulos.

A partir de aquí, tu aplicación podría tener un módulo para usuarios, otro para productos, otro para comentarios, etc. Crea tantos módulos como tu aplicación necesite.
## Ejemplo de modularización de una aplicación
En las siguientes imágenes te mostramos como debería quedar organizada la aplicación:
![structure  project suggestion - nest.js](https://i.imgur.com/ozsw0eb.png)

Donde los módulos deberían quedar así:
```js
// src/products/products.module.ts
import { Module } from '@nestjs/common';

import { ProductsController } from './controllers/products.controller';
import { BrandsController } from './controllers/brands.controller';
import { CategoriesController } from './controllers/categories.controller';
import { ProductsService } from './services/products.service';
import { BrandsService } from './services/brands.service';
import { CategoriesService } from './services/categories.service';

@Module({
  controllers: [ProductsController, CategoriesController, BrandsController],
  providers: [ProductsService, BrandsService, CategoriesService],
  exports: [ProductsService],
})
export class ProductsModule {}
```

```js
// src/users/users.module.ts
import { Module } from '@nestjs/common';

import { CustomerController } from './controllers/customers.controller';
import { CustomersService } from './services/customers.service';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [CustomerController, UsersController],
  providers: [CustomersService, UsersService],
})
export class UsersModule {}
```

```js
// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

# Interacción entre módulos
<div id='id2' />

Dentro de un módulo, puedes tener la necesidad de utilizar un servicio que pertenece a otro módulo. Importar estos servicios en otros módulos requiere de un paso adicional.
## Importaciones de servicios compartidos
Si tienes un Módulo A que posee un Servicio A y un segundo Módulo B requiere hacer uso de este, debes exportar el servicio para que otro módulo pueda utilizarlo.
```js
// Módulo A
import { ServiceA } from './service-A.service';

@Module({
  providers: [ServiceA],
  exports: [ServiceA]
})
export class ModuleA {}
```
```js
// Módulo B
import { ServiceA } from './module-A/service-A.service';

@Module({
  providers: [ServiceA]
})
export class ModuleB {}
```
Debes indicar en la propiedad exports del decorador **@Module()** que un módulo es exportable para que otro módulo pueda importarlo en sus providers.

De esta manera, evitas errores de compilación de tu aplicación que ocurren cuando importas servicios de otros módulos que no están siendo exportados correctamente.


# Entendiendo la inyección de dependencias
<div id='id3' />
Es muy sencillo crear un servicio en NestJS, inyectarlo en un componente y utilizar su lógica. A pesar de esto, siempre es recomendable entender cómo lo está haciendo y qué sucede por detrás en tu aplicación.

## Patrones de diseño en NestJS
NestJS utiliza varios Patrones de Diseño para permitir que esto funcione. Te presentamos dos para tener en cuenta:

### Inyección de dependencias
Imagínate que tienes un Servicio A que utiliza el Servicio B y este a su vez utiliza el Servicio C. Si tuvieses que instanciar el Servicio A, primero deberías instanciar el C para poder instanciar el B y luego sí hacerlo con el A. Se vuelve confuso y poco escalable si en algún momento también tienes que instanciar el Servicio D o E.

La inyección de dependencias llega para solucionar esto, resolver las dependencias de una clase por nosotros. Cuando instanciamos en el constructor el Servicio A, NestJS por detrás genera automáticamente la instancia del servicio B y C sin que nosotros nos tengamos que preocupar por estos.

### Singleton
La inyección de dependencias no es el único patrón de diseño que NestJS utiliza con sus servicios. También hace uso del patrón Singleton para crear una instancia única de cada servicio. Así es como, si tienes un servicio que se utiliza en N cantidad de componentes (u otros servicios) todos estos estarán utilizando la misma instancia del servicio, compartiendo el valor de sus variables y todo su estado.

### Precauciones utilizando servicios
Un servicio puede ser importado en muchos componentes u otros servicios a la vez. Puedes inyectar la cantidad de servicio que quieras en un componente, siempre de una forma controlada y coherente.
![circular references - inyeccion de dependencias](https://static.platzi.com/media/user_upload/Circular%20dependency-0c7642ea-5281-4561-b20c-1bd97bfee9ba.jpg)

Solo debes tener cuidado con las dependencias circulares. Cuando un servicio importa a otro y este al anterior. NestJS no sabrá cuál viene primero y tendrás un error al momento de compilar tu aplicación.
 
 ## Lecturas recomendadas
 - [Aprende Inyección de Dependencias: El camino de las buenas prácticas (Primera parte)](https://platzi.com/blog/inyeccion-de-dependencias-el-camino-de-las-buenas-practicas/)
 - [Aprende Inyección de Dependencias: El código es poder (Segunda parte)](https://platzi.com/blog/inyeccion-de-dependencias-el-codigo-es-poder/)


# useValue y useClass
<div id='id4' />
NestJS posee diferentes formas de inyectar servicios en un módulo según la necesidad. Exploremos algunas de ellas, sus diferencias y cuándo utilizarlas.

## Cómo hacer la inyección con “useClass”
Cuando realizas un import de un servicio en un módulo:
```js
import { AppService } from './app.service';

@Module({
  providers: [AppService],
})
export class AppModule {}
```
Internamente, NestJS realiza lo siguiente:
```js
import { AppService } from './app.service';

@Module({
  providers: [
    {
      provide: AppService,
      useClass: AppService
    }
  ]
})
export class AppModule {}
```
Ambas sintaxis son equivalentes, useClass es el tipo de inyección por defecto. Básicamente, indica que un servicio debe utilizar X clase para funcionar. Si el día de mañana, por algún motivo en tu aplicación, el servicio AppService queda obsoleto y tienes que reemplazarlo por uno nuevo, puedes realizar lo siguiente:
```js
import { AppService2 } from './app.service';

@Module({
  providers: [
    {
      provide: AppService,
      useClass: AppService2
    }
  ]
})
export class AppModule {}
```
De este modo, no tienes necesidad de cambiar el nombre AppService en todos los controladores donde se utiliza, este será reemplazado por la nueva versión del servicio.

## Cómo hacer la inyección con “useValue”
Además de clases, puedes inyectar valores como un string o un número. useValue suele utilizarse para inyectar globalmente en tu aplicación la llave secreta de una API o alguna otra variable de entorno que tu app necesita.
Para esto, simplemente inyecta el valor de una constante en el providers.
```js
const API_KEY = '1324567890';

@Module({
  providers: [
    {
      provide: 'API_KEY',
      useValue: API_KEY
    }
  ],
})
export class AppModule {}
```
Importa este valor en los controladores u otros servicios donde se necesite de la siguiente manera:
```js
import { Controller, Inject } from '@nestjs/common';

@Controller()
export class AppController {

  constructor(@Inject('API_KEY') private apiKey: string) {}
}
```
```js
// src/app.service.ts
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('API_KEY') private apiKey: string) {} // 👈 Inject API_KEY
  getHello(): string {
    return `Hello World! ${this.apiKey}`;
  }
}
```
# Manejar variables de entorno
<div id='id5' />

[Enlace Doc oficial](https://docs.nestjs.com/techniques/configuration)

A medida que tu aplicación crezca, puedes llegar a necesitar decenas de variables de entorno. Variables que cambian de valor dependiendo si estás en un entorno de desarrollo, de pruebas o de producción.

## Variables de entorno en NestJS
El manejo de variables de entorno en NestJS se realiza de una forma muy sencilla. Instala la dependencia @nestjs/config e importa el módulo ConfigModule en el módulo principal de tu aplicación.

 ```js
 import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
  ],
})
export class AppModule {}
 ```
El archivo que almacena las variables de entorno suele llamarse .env. Créalo en la raíz de tu proyecto con las variables que necesitas.
```
API_KEY=1324567890
API_SECRET=ABCDEFGHI
```
De esta manera, las variables de entorno estarán disponibles en tu aplicación y utilizando el objeto global de NodeJS llamado process puedes acceder a estos valores de la siguiente manera:
```
process.env.API_KEY
process.env.API_SECRET
```
## Consejos sobre las variables de entorno
Es muy importante NO VERSIONAR el archivo .env en el repositorio de tu proyecto. No guardes las claves secretas de tu aplicación en GIT.

Para asegurar esto, agrega el archivo .env a la configuración del archivo .gitignore para que no sea reconocido por Git y este no lo guarde en el repositorio.

Lo que puedes hacer es crear un archivo llamado .env.example que contendrá un modelo de las variables de entorno que tu aplicación necesita, pero no sus valores.
```
API_KEY=
API_SECRET=
```

De este modo, cuidas tu aplicación y guardas un archivo para que cualquier desarrollador que tome el proyecto, sepa qué variables necesita configurar para el funcionamiento de la misma.

## Cuadro de código para usar el módulo de configuración
```npm i --save @nestjs/config```

```
// .gitignore
*.env
```

```
// .env
DATABASE_NAME=my_db
API_KEY='1234'
```

```js
// src/app.module.ts
...
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ // 👈 Implement ConfigModule
      envFilePath: '.env',
      isGlobal: true,
    }),
    ...
  ],
})
export class AppModule {}
```

```js
// src/users/services/users.service.ts
import { ConfigService } from '@nestjs/config';
...

@Injectable()
export class UsersService {
  constructor(
    private productsService: ProductsService,
    private configService: ConfigService, // 👈 inject ConfigService
  ) {}
  ...

  findAll() {
    const apiKey = this.configService.get('API_KEY'); // 👈 get API_KEY
    const dbName = this.configService.get('DATABASE_NAME');  // 👈 get DATABASE_NAME
    console.log(apiKey, dbName);
    return this.users;
  }

  ...
}
```
## Configuración por ambientes
Una aplicación profesional suele tener más de un ambiente. Ambiente local, ambiente de desarrollo, ambiente de pruebas, producción, entre otros, dependiendo la necesidad del equipo y de la organización. Veamos cómo puedes administrar N cantidad de ambientes en NestJS.

### Configuración dinámica del entorno
Configuremos la aplicación para intercambiar fácilmente entre diversos ambientes, cada uno con su propia configuración.

1. Archivo principal para manejo de ambientes
Crea un archivo llamado enviroments.ts (o el nombre que prefieras) que contendrá un objeto con una propiedad por cada ambiente que tenga tu aplicación.

```js
// src/enviroments.ts
export const enviroments = {
  dev: '.env',
  test: '.test.env',
  prod: '.prod.env',
};
```
2. Configuración por ambiente
Crea un archivo .env por cada ambiente que necesites. Recuerda que todos los archivos finalizados en .env no deben guardarse en GIT.
```
// .test.env
DATABASE_NAME=my_db_test
API_KEY=12345
```
```
// .prod.env
DATABASE_NAME=my_db_prod
API_KEY=67890
```
3. Importando variables de entorno
Importa en el módulo principal de tu aplicación el archivo principal para manejo de ambientes y, a través de una única variable de entorno llamada NODE_ENV, elegirás qué configuración usar.

- NODE_ENV es una variable de entorno propia de NodeJS y del framework Express que se encuentra preseteada en tu aplicación.


```js
import { enviroments } from './enviroments'; // 👈

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env', // 👈
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

4. Inicio de la aplicación
Finalmente, para iniciar tu aplicación basta con el comando ```NODE_ENV=test npm run start:dev``` o ```NODE_ENV=prod npm run start:dev``` para configurar la variable de entorno principal NODE_ENV y escoger qué configuración utilizar.

5. Utilizando las variables de entorno
Puedes utilizar las variables de entorno en tu aplicación de dos maneras. Con el objeto global de NodeJS llamado process:
```
process.env.DATABASE_NAME
process.env.API_KEY
```
O puedes usar estas variables a través del servicio ConfigService proveniente de @nestjs/config.
```js
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  constructor(private config: ConfigService) {}
  
  getEnvs(): string {
    const apiKey = this.config.get<string>('API_KEY');
    const name = this.config.get('DATABASE_NAME');
    return `Envs: ${apiKey} ${name}`;
  }
}
```
De este modo, configura de la mejor manera que necesites para tu aplicación el manejo de múltiples ambientes, cada uno con su propia configuración.

## Tipado en config
A medida que tu aplicación acumule más y más variables de entorno, puede volverse inmanejable y es propenso a tener errores el no recordar sus nombres o escribirlos mal. A continuación verás como tipar variables.

### Cómo hacer el tipado de variables de entorno
Seguriza tu lista de variables de entorno de manera que evites errores que son difíciles de visualizar. Veamos cómo puedes tipar tus variables.

1. Archivo de tipado de variables
Crea un archivo al que denominaremos config.ts que contendrá el tipado de tu aplicación con ayuda de la dependencia @nestjs/config.
```js
// src/config.ts
import { registerAs } from "@nestjs/config";

export default registerAs('config', () => {
  return {
    database: {
      name: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
    },
    apiKey: process.env.API_KEY,
  }
})
```
Importa registerAs desde @nestjs/config que servirá para crear el tipado de datos. Crea un objeto con la estructura de datos que necesita tu aplicación. Este objeto contiene los valores de las variables de entorno tomados con el objeto global de NodeJS, process.

2. Importación del tipado de datos
Importa el nuevo archivo de configuración en el módulo de tu proyecto de la siguiente manera para que este sea reconocido.

```js
import { ConfigModule } from '@nestjs/config';
import config from './config';

@Global()
@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [config],
      isGlobal: true
    }),
  ],
})
export class AppModule {}
```
3. Tipado de variables de entorno
Es momento de utilizar este objeto que genera una interfaz entre nuestra aplicación y las variables de entorno para no confundir el nombre de cada variable.
```js
import { Controller, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from './config';

@Controller()
export class AppController {

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>
  ) {}
  
  getEnvs(): string {
    const apiKey = this.configService.apiKey;
    const name = this.configService.database.name;
    return `Envs: ${apiKey} ${name}`;
  }
}
```
Observa la configuración necesaria para inyectar y tipar tus variables de entorno. Ahora ya no tendrás que preocuparte por posibles errores al invocar a una de estas variables y evitar dolores de cabeza debugueando estos errores.

### Cuadro de código para tipado en config
```
// .env
DATABASE_NAME=my_db_prod
API_KEY=999
DATABASE_PORT=8091 // 👈
```

```
// .stag.env
DATABASE_NAME=my_db_stag
API_KEY=333
DATABASE_PORT=8091 // 👈
```

```
// .prod.env
DATABASE_NAME=my_db_prod
API_KEY=999
DATABASE_PORT=8091 // 👈
```

```js
// src/config.ts // 👈 new file
import { registerAs } from '@nestjs/config';

export default registerAs('config', () => { // 👈 export default
  return { 
    database: {
      name: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
    },
    apiKey: process.env.API_KEY,
  };
});
```

```js
// src/app.module.ts
import config from './config'; // 👈

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config], // 👈
      isGlobal: true,
    }),
    ...
  ],
  ...
})
export class AppModule {}
```

```js
// src/app.service.ts
import { ConfigType } from '@nestjs/config'; // 👈 Import ConfigType 
import config from './config'; // 👈 config file

@Injectable()
export class AppService {
  constructor(
    @Inject('TASKS') private tasks: any[],
    @Inject(config.KEY) private configService: ConfigType<typeof config>, // 👈
  ) {}
  getHello(): string {
    const apiKey = this.configService.apiKey; // 👈
    const name = this.configService.database.name; // 👈
    return `Hello World! ${apiKey} ${name}`;
  }
}
```


## Validación de esquemas en .envs con Joi
Las variables de entorno son sensibles, pueden ser requeridas o no, pueden ser un string o un number. Validemos tus variables de entorno para evitar errores u omisiones de las mismas.

### Validando variables de entorno
Instala la dependencia Joi con el comando ```npm instal joi --save```. La misma nos dará las herramientas para realizar validaciones de nuestras variables de entorno.

Importa Joi en el módulo de tu aplicación y a través de la propiedad validationSchema del objeto que recibe el ConfigModule crea el tipado y las validaciones de tus variables de entorno.

```js
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        API_KEY: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
      })
    }),
  ],
  ],
})
export class AppModule {}
```
Lo que hace Joi es asegurar que, en el archivo .env, existan las variables de entorno indicadas dependiendo si son obligatorias o no, además de validar el tipo para no ingresar un string donde debería ir un number.

En equipos de trabajo profesional, quienes suelen desplegar las aplicaciones en los entornos es el equipo DevOpsy ellos no necesariamente saben qué variables de entorno necesita tu aplicación y de qué tipo son. Gracias a esta configuración, tu app emitirá mensajes de error claros por consola cuando alguna variable no sea correcta.

### Cuadro de código para variables de entorno
```npm install --save joi```

```js
// src/app.module.ts

import * as Joi from 'joi';  // 👈

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({ // 👈
        API_KEY: Joi.number().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
      }),
    }),
    ...
  ],
  ...
})
export class AppModule {}
```


# useFactory
<div id='id6' />
NestJS permite inyecciones de servicios o datos que necesiten de alguna petición HTTP o algún proceso asíncrono.

## Inyecciones Asíncronas
El tipo de inyección **useFactory** permite que realices un proceso asíncrono para inyectar un servicio o datos provenientes de una API.

  - A partir de NestJS v8, el servicio HttpService importado desde @nestjs/common fue deprecado. Instala la dependencia @nestjs/axios e impórtalo desde ahí. No deberás realizar ningún otro cambio en tu código. También debes asegurarte de importar el módulo HttpModule desde la misma dependencia.
  ```npm i --save @nestjs/axios```

```js
import { HttpService } from '@nestjs/axios';

@Module({
  providers: [
    {
      provide: 'DATA',
      useFactory: async (http: HttpService) => {
        return await http.get('<URL_REQUEST>').toPromise()
      },
      inject: [HttpService]
    }
  ],
})
export class AppModule {}
```
La propiedad **inject** permite que inyectes (valga la redundancia) dentro de esta función asíncrona del useFactory otros servicios que este pueda necesitar. En el ejemplo anterior, se está haciendo una llamada a un request para obtener datos.

Importa estos datos en el controlador que lo necesite de la siguiente manera.
```js
import { Controller, Inject } from '@nestjs/common';

@Controller()
export class AppController {

  constructor(@Inject('DATA') private data: any[]) {}
}
```

Así podrás hacer uso de estos datos que fueron cargados de forma asíncrona.

Ten en cuenta que, al realizar una solicitud asíncrona, el controlador dependerá de la finalización de este proceso para estar disponible, pudiendo retrasar el inicio de tu aplicación. Esta funcionalidad suele utilizarse para conexiones de base de datos o procesos asíncronos similares.

## Cuadro de código para inyección de servicios useFactory
```js
// src/app.module.ts
import { Module, HttpModule, HttpService } from '@nestjs/common';  // 👈 imports

@Module({
  imports: [HttpModule, UsersModule, ProductsModule],
  controllers: [AppController],
  providers: [
    imports: [HttpModule, UsersModule, ProductsModule], // 👈 add HttpModule
    ...,
    {
      provide: 'TASKS',
      useFactory: async (http: HttpService) => { // 👈 implement useFactory
        const tasks = await http
          .get('https://jsonplaceholder.typicode.com/todos')
          .toPromise();
        return tasks.data;
      },
      inject: [HttpService],
    },
  ],
})
export class AppModule {}
```

```js
// src/app.service.ts
  
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(
    @Inject('API_KEY') private apiKey: string,
    @Inject('TASKS') private tasks: any[], // 👈 inject TASKS
  ) {}
  getHello(): string {
    console.log(this.tasks); // 👈 print TASKS
    return `Hello World! ${this.apiKey}`;
  }
}
```

# Global Module
<div id='id7' />
Al desarrollar una aplicación con NestJS, existen necesidades de importar módulos cruzados o de importar un mismo servicio en varios módulos. Lo anterior, hace que la cantidad de imports en cada módulo crezca y se vuelva complicado de escalar.

## Cómo usar el módulo global
NestJS otorga la posibilidad de crear módulos globales que se importarán automáticamente en todos los otros módulos de la aplicación, sin necesidad de importarlos explícitamente.
```nest g mo <nombre_modulo_global> ```
```js
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  // ...
})
export class MyCustomModule {}
```
Todos los servicios que importes en este módulo, estarán disponibles para su utilización en cualquier otro módulo.

Todos los servicios que importes en este módulo, estarán disponibles para su utilización en cualquier otro módulo.

Es importante no abusar de esta característica y no tener más de un módulo global para controlar las importaciones. Pueden ocurrir errores de dependencias circulares que suceden cuando el Módulo A importa al Módulo B y este a su vez importa al Módulo A. El decorador **@Global()** te ayudará a resolver estos problemas.

## Cuadro de código para uso de global module
```js
// src/database/database.module.ts

import { Module, Global } from '@nestjs/common';

const API_KEY = '12345634';
const API_KEY_PROD = 'PROD1212121SA';

@Global()
@Module({
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
  ],
  exports: ['API_KEY'],
})
export class DatabaseModule {}
```

```js
// src/app.module.ts
...
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    ProductsModule,
    DatabaseModule // 👈 Use DatabaseModule like global Module
   ], 
  ...
})
export class AppModule {}
```

```js
/ src/users/services/users.service.ts

import { Injectable, NotFoundException, Inject } from '@nestjs/common';
..

@Injectable()
export class UsersService {
  constructor(
    private productsService: ProductsService,
    @Inject('API_KEY') private apiKey: string, // 👈 Inject API_KEY
  ) {}

}
```

# Integrando Swagger y PartialType con Open API
<div id='id8' />
Una API profesional debe estar documentada. Cuando hablamos de documentación, nos suena a una tarea tediosa que nadie quiere realizar. Afortunadamente, NestJS permite automatizar fácilmente la creación de la misma.

## Cómo hacer la documentación API Rest
[Swagger](https://swagger.io/) es un reconocido set de herramientas para la documentación de API Rest. Instala las dependencias necesarias con el comando ```npm install --save @nestjs/swagger swagger-ui-express``` y configura el archivo **main.ts** con el siguiente código.

```js
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    
  // Configuración Swagger en NestJS
  const config = new DocumentBuilder()
    .setTitle('Platzi API')
    .setDescription('Documentación Platzi API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  // URL API
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
```
Setea el título, descripción y versión de tu documentación. Lo más importante es la URL para acceder a la misma.

Levanta el servidor con npm run start:dev y accede a localhost:3000/docs para visualizar la documentación autogenerada que mapea automáticamente todos los endpoints de tu aplicación.

### Tipado de la documentación
La documentación autogenerada por Swagger es bastante simple, puedes volverla más completa tipando los datos de entrada y salida de cada endpoint gracias a los DTO.

Busca el archivo nest-cli.json en la raíz de tu proyecto y agrega el siguiente plugin:
```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compileOptions": {
    "plugins": ["@nestjs/swagger"]
  }
}
```
A continuación, prepara tus DTO de la siguiente manera:

```js
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';

export class CreateProductDTO {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;
}

export class UpdateAuthorDto extends PartialType(
  OmitType(CreateProductDTO, ['name']),
) {}
```

Lo más relevante aquí es importar PartialType y OmitType desde @nestjs/swagger en lugar de importarlo desde @nestjs/mapped-types. Coloca también el decorador @ApiProperty() en cada una de las propiedades que el DTO necesita.
!¨[swagger example](https://static.platzi.com/media/user_upload/Screenshot%20from%202022-06-17%2014-08-51%281%29-436e5207-765c-4d51-94b4-b3f72d1b8c93.jpg)

De esta manera, observarás en la documentación que indica el tipo de dato que requiere cada uno de tus endpoints.

### Cuadro de código para uso de swagger
```npm install --save @nestjs/swagger swagger-ui-express```

```js
// src/main.ts

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  ...
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('PLATZI STORE')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  ...
  await app.listen(3000);
}
bootstrap();
```

```js
# nest-cli.json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "plugins": ["@nestjs/swagger/plugin"]
  }
}
```

```js
// src/products/dtos/brand.dtos.ts
import { PartialType } from '@nestjs/swagger';
```

```js
// src/products/dtos/category.dtos.ts
import { PartialType } from '@nestjs/swagger';
```

```js
// src/users/dtos/customer.dto.ts
import { PartialType } from '@nestjs/swagger';
```

```js
// src/users/dtos/user.dto.ts
import { PartialType } from '@nestjs/swagger';
```

## Reference
- [doc oficial](https://docs.nestjs.com/openapi/mapped-types)
## Extendiendo la documentación
La documentación automática que genera NestJS y Swagger es muy fácil de implementar y otorga una buena base. La documentación de tu aplicación puede ser aún más completa y detallada, si así lo quieres con algo de trabajo de tu parte.

### Cómo hacer la documentación personalizada
Veamos varios decoradores que te servirán para ampliar la documentación de tu API.

**Descripción de las propiedades**
En tus DTO, puedes dar detalle sobre qué se espera recibir en cada propiedad de tus endpoints gracias al decorador @ApiProperty()
```js
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';

export class CreateProductDTO {

  @ApiProperty({ description: 'Nombre del producto' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Descripción del producto' })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({ description: 'Precio del producto' })
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;
}
```
**Descripción de los controladores**
Puedes agrupar los endpoints en la documentación por controlador con el decorador @ApiTags() y describir, endpoint por endpoint, la funcionalidad de cada uno con el decorador @ApiOperation().

```js
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Productos')
@Controller()
export class AppController {

  @ApiOperation({ summary: 'Obtener lista de productos.' })
  @Get('products')
  getProducts() {
    // ...
  }
}
```

De este modo, la documentación de tu aplicación es súper profesional y está lista para ser recibida por el equipo front-end o por clientes externos que consumirán el servicio.

Cuadro de código para documentación personalizada

```js
// src/products/dtos/products.dtos.ts

import { PartialType, ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger'; // 👈

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `product's name` }) // 👈
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty() // 👈
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty() // 👈
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty() // 👈
  readonly stock: number;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty() // 👈
  readonly image: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

```js
// src/products/controllers/products.controller.ts
import { ApiTags, ApiOperation } from '@nestjs/swagger'; // 👈

@ApiTags('products') // 👈
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List of products' }) // 👈
  getProducts(
    @Query('limit') limit = 100,
    @Query('offset') offset = 0,
    @Query('brand') brand: string,
  ) {
    // return {
    //   message: `products limit=> ${limit} offset=> ${offset} brand=> ${brand}`,
    // };
    return this.productsService.findAll();
  }
}
```

```js
// src/products/controllers/brands.controller.ts
import { ApiTags } from '@nestjs/swagger';


@ApiTags('brands') // 👈
@Controller('brands')
export class BrandsController {
  ...
}
```