## Environment

- **Framework**: The application is built with [Laravel](https://laravel.com), leveraging its modern features and ecosystem.
- **Containerization**: [Laravel Sail](https://laravel.com/docs/sail) is used to provide a lightweight Docker environment, making local development and deployment seamless.
- **Performance**: The application runs on [Laravel Octane](https://laravel.com/docs/octane) with the [FrankenPHP](https://frankenphp.dev) server. This setup allows handling requests efficiently without bootstrapping the framework on every request. 
- **Deployment**: A deployment script named [`deploy.sh`](./deploy.sh) is included at the project root. It automates the installation of dependencies, container build, and application optimization.
- **Dependency Management**:
  - On initial deployment, the `./vendor` and `./node_modules` directories do not exist.
  - The project includes a `./composer` binary, which is used to install PHP dependencies.
  - Once `vendor/` is created, all subsequent commands are run using `./vendor/bin/sail`.