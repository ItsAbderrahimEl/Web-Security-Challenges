
## 🚀 Environment

- **Framework:** Laravel + [Octane](https://laravel.com/docs/octane) (FrankenPHP backend)
- **Containerization:** [Laravel Sail](https://laravel.com/docs/sail) for Dockerized deployment
- **Dependencies:** Managed via Composer and Node — initialized through `./vendor/bin/sail`

---

## 🧱 Remediation

- Use parameterized queries:  

  ```php
  Game::where('user_name', $user->name)->get();
  ```

- Avoid `whereRaw()` with interpolated input

- Sanitize & validate usernames

- Limit DB user privileges

---

## 💡 Lessons Learned

- Frontend assets can reveal hidden subdomains.  
- Second-order injections bypass typical fuzzing tools.  
- ORM features (like Eloquent) provide safer query handling.

---

## 🧰 Tech Stack

| Component  | Technology          |
| ---------- | ------------------- |
| Backend    | Laravel 12          |
| Server     | FrankenPHP (Octane) |
| Container  | Laravel Sail        |
| DB         | SQLite              |

---

## Environment

- **Framework**: The application is built with [Laravel](https://laravel.com), leveraging its modern features and ecosystem.
- **Containerization**: [Laravel Sail](https://laravel.com/docs/sail) is used to provide a lightweight Docker environment, making local development and deployment seamless.
- **Performance**: The application runs on [Laravel Octane](https://laravel.com/docs/octane) with the [FrankenPHP](https://frankenphp.dev) server. This setup allows handling requests efficiently without bootstrapping the framework on every request. 
- **Deployment**: A deployment script named [`deploy.sh`](./deploy.sh) is included at the project root. It automates the installation of dependencies, container build, and application optimization.
- **Dependency Management**:
  - On initial deployment, the `./vendor` and `./node_modules` directories do not exist.
  - The project includes a `./composer` binary, which is used to install PHP dependencies.
  - Once `vendor/` is created, all subsequent commands are run using `./vendor/bin/sail`.

---

## 📚 References

- [Laravel Query Builder — Parameter Binding](https://laravel.com/docs/12.x/queries)  
- [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)  
- [SQLite Built-in Functions](https://www.sqliz.com/sqlite-ref/system-function/)  

---

### 💬 Author Note

This challenge highlights how **stored data can become a weapon** when reused unsafely in SQL contexts.  
Always treat persisted user input as untrusted — even after validation.

---

© 2025 Abderrahim El Ouariachi — All rights reserved.