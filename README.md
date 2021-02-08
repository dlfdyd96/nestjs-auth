# NestJS Auth

## TODO List

- Prologue
  - [ ] Authentication
  - [ ] Authorization
  - [ ] 추가(TypeORM, Swagger)
- Setup
  - [ ] MySQL docker-compose
  - [ ] TypeORM Setup
  - [ ] User Entity Model
  - [ ] TypeORM Migration
- NestJS
  - [ ] NestJS Auth
  - [ ] Role-based Authorization
- 추가
  - [ ] Custom Decorator
  - [ ] Swagger

## 1. Prologue

### Authentication

### Authorization

### 추가(TypeORM, Swagger)

## 2. Setup

### MySQL docker-compose

1. `docker-compose.yml`로 mysql container환경을 구성합니다.

```yml
services:
  mysql:
    image: mysql:5.7
    container_name: dev-mysql
    restart: always
    ports:
      - 10310:3306
    environment:
      TZ: Asia/Seoul
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: dev
      MYSQL_USER: dev
      MYSQL_PASSWORD: dev
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
      - --skip-character-set-client-handshake
    volumes:
      - dev-mysql:/var/lib/mysql

volumes:
  dev-mysql:
```

2. `docker-compose up -d` 명령어를 사용하여 MySQL Docker Container를 생성해줍니다.

3. MySQL WorkBench에서 Container가 생성되었는지 확인하고,

   ```
   id: root
   pw: root
   ```

   로 Connect 합니다.
   ![workbench_connection](./images/workbench_connect.png)

4. Schema(Database)를 만들어주고,
   ![workbench_schema](./images/workbench_schema.png)

5. 왼쪽 위 `Administration` 탭의 `Users and Privileges`에서 새로운 account를 등록해줍니다.
   ```
   id: ilyong # 사용자 마음대루
   pw: ilyong # 사용자 마음대루
   ```
   ![workbench_add_account](./images/workbench_add_account.png)
   ![workbench_add_account2.png](./images/workbench_add_account2.png)
   차례대로 입력후 오른쪽 밑 `Apply`

### TypeORM Setup

1. Install package

```sh
$ npm i joi @nestjs/config
$ npm i @nestjs/typeorm typeorm mysql2
```

2. Database Connection

- 환경변수

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=10310
MYSQL_USERNAME=ilyong
MYSQL_PASSWORD=ilyong
MYSQL_DATABASE=ilyong
```

### User Entity Model

1. Create User Module, Service

```sh
$ nest generate module user
$ nest generate service user
$ nest generate controller user
```

2. Create User Entity

- User Entity 를 정의해줍니다.

```ts
// src/user/entity/user.entity.ts
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  version: string;
}
```

3. `AppModule`의 `TypeOrmModule.forRoot()` method는 TypeORM Package에서 나온 `createConnection()` 함수에 의해 노출된 모든 설정 속성들을 지원합니다.

```ts
// src/app.module.ts

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_PORT: Joi.string().required(),
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.string().required(),
        MYSQL_USERNAME: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_DATABASE: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      synchronize: true,
      logging: true,
      entities: [],
      charset: 'utf8mb4_unicode_ci',
      timezone: '+09:00',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

3. `UserModule`에서 `forFeature()` method를 사용함으로써 현재(User) 스코프에 Repository를 등록을 정의합니다. 그러면, 현재 스코프(UserModule~)에서 `@InjectRepository()` 데코레이터를 사용함으로써, `UserModule`내의 Provider에서 `UsersRepository`를 inject 할 수 있습니다!

```ts
// src/user/user.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
```

> **Alternatively ♻**
>
> `ormconfig.json`을 project root directory에 생성하여 Configuration 객체를 forRoot()로 통과시킬 수 도 있습니다.

4. `npm run build` -> `npm run start` 또는 `npm run start:dev` script를 실행하면 database에 `users` Table이 생성된 것 을 확인할 수 있습니다.

### (추가) TypeORM Migration

- `forRoot()`의 `synchronize: true`는 개발환경에서만 사용해야합니다.

  왜냐하면 `*.entity.ts`를 변경할때마다 변경사항들을 해당하는 Database Table에 바로 반영하기 때문에, 자칫하면 data를 잃어버릴 수도 있습니다.

TODO: Migration 방법

## 3. NestJS

### NestJS Auth

### Role-based Authorization

## 4. 추가

### Custom Decorator

### Swagger
