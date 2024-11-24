# Technical Test

## Index

- [Technical Test](#technical-test)
  - [Index](#index)
  - [Task 1: Advanced Monorepo Setup](#task-1-advanced-monorepo-setup)
    - [Step 1: Create the repo](#step-1-create-the-repo)
    - [Step 2: Installing Lerna](#step-2-installing-lerna)
    - [Step 3: Creating Packages](#step-3-creating-packages)
    - [Step 4: Adding Scripts](#step-4-adding-scripts)
    - [Step 5: Try](#step-5-try)
  - [Task 2: Advanced Server Setup](#task-2-advanced-server-setup)
    - [Step 1: Set up TypeScript](#step-1-set-up-typescript)
    - [Step 2: Define Scalable Structure](#step-2-define-scalable-structure)
    - [Step 3: Implement the Fastify App](#step-3-implement-the-fastify-app)
    - [Step 4: Run and Check](#step-4-run-and-check)
  - [Task 3: Advanced Database Integration with Prisma and PostgreSQL](#task-3-advanced-database-integration-with-prisma-and-postgresql)
    - [Step 1: Configure Prisma](#step-1-configure-prisma)
    - [Step 2: Implement User Management](#step-2-implement-user-management)
    - [Step 3: Test](#step-3-test)

## Task 1: Advanced Monorepo Setup

I choose **lerna** to create the project.

The project structure will be as follows:

```markdown
technical-test/
├── packages/
│ ├── api/
│ │ └── package.json
│ ├── services/
│ │ └── package.json
│ └── utilities/
│ └── package.json
├── package.json
└── lerna.json
```

### Step 1: Create the repo

```bash
mkdir technical-test
cd technical-test
```

### Step 2: Installing Lerna

```bash
npx lerna init --packages="packages/*"
```

This creates:

- **lerna.json**: Lerna's configuration file.
- **package.json**: The project package.json.
- **.gitignore**: Files that git must exclude.

It will automatically add the following configuration to the **package.json**:

```json
"workspaces": ["packages/*"]
```

And the next one to the **lerna.json**:

```json
"packages": ["packages/*"]
```

Additionally, I am going to change the **package.json** _name_ to _technical-test_

### Step 3: Creating Packages

Each concern (e.g., API, services, utilities) is represented as a package. Create directories for each:

```bash
npx lerna create <packageName> --yes
```

This is going to create a directory for each package with a **package.json** created with default values and a simple **JavaScript** file and a **test**.

### Step 4: Adding Scripts

We need to add the following scripts to every package:

```json
"scripts": {
  "start": "node <mainFile>"
}
```

And the next one to the root package.json:

```json
"scripts": {
    "test": "lerna run test",
    "build": "lerna run build",
    "start": "lerna run start"
}
```

### Step 5: Try

We are going to try to use the utilities package in the service's logic.

Initially, make an install:

```bash
npm install
```

Then, we should move to the corresponding package and install utilities

```bash
cd packages/services
npm install utilities
```

Following, we add a simple line code to `./packages\services\lib\services.js`

```javascript
const utilities = require('utilities');
console.log(utilities());
```

To conclude, we need to execute:

```bash
npm start
```

And we should see the message printed

## Task 2: Advanced Server Setup

### Step 1: Set up TypeScript

Install **Fastify** and **TypeScript**:

```bash
cd packages/api
npm install fastify
npm install -D typescript ts-node @types/node @fastify/autoload @fastify/cors @fastify/env @fastify/sensible
```

Initialize **TypeScript**:

```bash
npx tsc --init
```

Modify the **tsconfig.json**:

```json
{
  "include": ["lib/**/*"],
  "exclude": ["node_modules", "dist"],
  "compilerOptions": {
    "outDir": "./dist"
    ...
  }
}
```

With this configuration we are defining the files in the TypeScript's scope and the directory where the transpilation result should be.

To finish this configuration, we need to configure the **package.json**:

```json
{
  "scripts": {
    "test": "node ./__tests__/api.test.js",
    "dev": "ts-node lib/api.ts",
    "build": "rm -r dist | tsc",
    "start": "node dist/api.js"
  }
}
```

### Step 2: Define Scalable Structure

We are going to implement an scalable app structure:

```markdown
api/
├── dist/
├── lib/
│ ├── api.ts # Main application entry point
│ ├── plugins/ # Plugins for Fastify
│ │ ├── cors.ts # CORS plugin
│ │ ├── env.ts # Environment variables
│ │ └── sensible.ts # Sensible error handling
│ ├── routes/ # Modular route definitions
│ │ ├── index.ts # Default routes
│ │ └── user.ts # Example user routes
│ ├── services/ # Business logic
│ │ └── userService.ts
│ └── types/ # Type definitions
│ └── index.d.ts # Global types
├── package.json
├── tsconfig.json
```

This structure ensures:

- Clear Separation of Concerns.
- Scalability to grow with your application.
- Maintainability by adhering to clear separation of concerns.
- Modularity for ease of development and testing.

### Step 3: Implement the Fastify App

- **lib/plugins/env.ts**: Manage environment variables.

```ts
import fp from 'fastify-plugin';

export default fp(async (app) => {
  app.register(require('@fastify/env'), {
    schema: {
      type: 'object',
      properties: {
        PORT: { type: 'string', default: '3000' },
      },
    },
  });
});
```

- **lib/plugins/cors.ts**: Enable CORS.

```ts
import fp from 'fastify-plugin';
import cors from '@fastify/cors';

export default fp(async (app) => {
  app.register(cors, {
    origin: '*',
  });
});
```

- **lib/services/userService.ts**: Encapsulate business logic.

```ts
type User = {
  id: string;
  name: string;
};

const users: User[] = [
  { id: '1', name: 'Jesus' },
  { id: '2', name: 'Carmela' },
];

export const getUserById = async (id: string): Promise<User | null> => {
  return users.find((user) => user.id === id) || null;
};
```

- **lib/routes/user.ts**: Define user-related routes.

```ts
import { FastifyInstance } from 'fastify';
import { getUserById } from '../services/userService';

export default async function (app: FastifyInstance) {
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await getUserById(id);
    if (!user) {
      reply.notFound('User not found');
    }
    return user;
  });
}
```

- **lib/routes/index.ts**: Register modular routes.

```ts
import { FastifyInstance } from 'fastify';
import userRoutes from './user';

export default async function (app: FastifyInstance) {
  app.get('/', async () => {
    return { message: 'Welcome to the Fastify App' };
  });

  app.register(userRoutes, { prefix: '/users' });
}
```

- **lib/api.ts**: Initialize the Fastify app and load plugins and routes in the main app.

```ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import routes from './routes';
import envPlugin from './plugins/env';

const buildApp = async () => {
  const app = Fastify({ logger: true });

  // Register plugins
  app.register(envPlugin);
  app.register(cors);
  app.register(sensible);

  // Register routes
  app.register(routes);

  try {
    await app.listen({ port: 3000 });
    console.log('Server is running at http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  return app;
};

buildApp();
```

### Step 4: Run and Check

Run:

```bash
npm run dev
```

Go to `http://localhost:3000` to check if the app is up.

## Task 3: Advanced Database Integration with Prisma and PostgreSQL

### Step 1: Configure Prisma

Move to services:

```bash
cd packages/services
```

Install Prisma:

```bash
npm install typescript tsx @types/node --save-dev
npx tsc --init
npm install prisma @prisma/client
```

Initialize Prisma:

```bash
npx prisma init
```

Configure PostgreSQL database URL in the .env file:

```environment
DATABASE_URL="postgresql://postgres:admin@localhost:5432/technical-test?schema=public"
```

Define User and Post Models. In **prisma/schema.prisma**:

```sql
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @unique @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        Int      @unique @id @default(autoincrement())
  title     String
  content   String
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
}
```

We have included a relationship between User and Post using the Prisma constraint, every post depends on a user:

```sql
author    User     @relation(fields: [authorId], references: [id])
```

Also, with `@unique` we ensure that those fields are going to be uniques.

Migrate the Database(We should have the database up):

```bash
npx prisma migrate dev --name init
```

Generate the Prisma Client:

```bash
npx prisma generate
```

### Step 2: Implement User Management

Create the User Service in the package **services**, we are going to use Prisma.validation to make some simple validations:

```ts
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createUserValidator = Prisma.validator<Prisma.UserCreateInput>();
const updateUserValidator = Prisma.validator<Prisma.UserUpdateInput>();

export const createUser = async (name: string, email: string) => {
  const data: Prisma.UserCreateInput = createUserValidator({
    name,
    email,
  });
  return prisma.user.create({
    data: { name, email },
  });
};

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  });
};

export const updateUser = async (
  id: number,
  data: Partial<{ name: string; email: string }>
) => {
  const validatedData: Prisma.UserUpdateInput = updateUserValidator(data);
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: number) => {
  return prisma.user.delete({
    where: { id },
  });
};

export const getAllUsers = async () => {
  return prisma.user.findMany({ include: { posts: true } });
};
```

In packages/services, `npm run build`.

Install the services package in the api:

```bash
cd packages/api
npm i services
```

Modify the **api/routes/user.ts**:

```ts
import { FastifyInstance } from 'fastify';
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
} from 'services';

export default async function (app: FastifyInstance) {
  // Create User
  app.post('/', async (request, reply) => {
    const { name, email } = request.body as { name: string; email: string };
    try {
      const user = await createUser(name, email);
      reply.code(201).send(user);
    } catch (error) {
      reply.code(400).send({ error: 'Failed to create user' });
    }
  });

  // Get All Users
  app.get('/', async (_, reply) => {
    const users = await getAllUsers();
    reply.send(users);
  });

  // Get User by ID
  app.get('/:id', async (request, reply) => {
    // @ts-ignore
    const id = parseInt(request.params.id, 10);
    const user = await getUserById(id);
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }
    reply.send(user);
  });

  // Update User
  app.put('/:id', async (request, reply) => {
    // @ts-ignore
    const id = parseInt(request.params.id, 10);
    const data = request.body as Partial<{ name: string; email: string }>;
    try {
      const user = await updateUser(id, data);
      reply.send(user);
    } catch (error) {
      reply.code(400).send({ error: 'Failed to update user' });
    }
  });

  // Delete User
  app.delete('/:id', async (request, reply) => {
    // @ts-ignore
    const id = parseInt(request.params.id, 10);
    try {
      await deleteUser(id);
      reply.code(204).send();
    } catch (error) {
      reply.code(400).send({ error: 'Failed to delete user' });
    }
  });
}
```

### Step 3: Test

Here, we only have to start our service and test it with **postman** or a similar application
