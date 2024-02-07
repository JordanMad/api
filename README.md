## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```
Make sure to have all of the apps cloned and ports 3000, 3001 and 3002 free.

Not sure about the production build if its going to build, so use only the dev environment.
Make sure to have node > 18

mocks.json file is the DB of the project.

Only happy paths are implemented.
Controllers are in the same files as the routes declaration.

Future implementation:
Zod validaton of the inputs

Open [http://localhost:3002/status](http://localhost:3002/status) with your browser to see the result.
