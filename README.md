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

`npx lerna init --packages="packages/*"`

This creates:

- **lerna.json**: Lerna's configuration file.
- **package.json**: The project package.json.
- **.gitignore**: Files that git must exclude.

It will automatically add the following configuration to the **package.json**:

`"workspaces": ["packages/*"]`

And the next one to the **lerna.json**:

`"packages": ["packages/*"]`

Additionally, I am going to change the **package.json** _name_ to _technical-test_

### Step 3: Creating Packages

Each concern (e.g., API, services, utilities) is represented as a package. Create directories for each:

`npx lerna create <packageName> --yes`

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

`npm install`

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

`npm start`

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

`npx tsc --init`

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

`npm run dev`

Go to `http://localhost:3000` to check if the app is up.

## Task 3: Advanced Database Integration with Prisma and PostgreSQL
