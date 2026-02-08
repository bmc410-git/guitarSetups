# MccoyGuitarsSetup

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Firebase

This project now includes the Firebase JavaScript SDK. Follow these steps to finish setup and (optionally) enable hosting or other Firebase services:

1. Fill in your Firebase config

	- Open `src/environments/firebase.config.ts` and replace the placeholder values with the real values from your Firebase Console (Project settings → SDK setup).

2. Use the Firebase CLI (optional)

	- We added `firebase-tools` as a dev dependency. You can run it via `npx` or install it globally:

	  - Use without global install: `npx firebase login` / `npx firebase init` / `npx firebase deploy`
	  - Or install globally: `npm install -g firebase-tools` then `firebase login` etc.

3. Initialize hosting (optional)

	- From the project root run: `npx firebase init` and choose the services you need (Hosting, Firestore, Functions, etc.).

4. Deploy (optional)

	- Build the app for production: `npm run build`
	- Deploy with the Firebase CLI: `npx firebase deploy` (or `firebase deploy` if installed globally).

Notes

- This repository uses the Firebase JS SDK directly (`firebase`) and initializes it in `src/main.ts`.
- The Angular-focused integration library (`@angular/fire`) currently had a peer dependency mismatch with Angular 21 at the time of setup, so it wasn't installed automatically. If you want to use `@angular/fire` when a compatible version is available, install it with `npm install @angular/fire` and follow its docs.
