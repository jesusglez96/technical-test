# Technical Test

## Index

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
