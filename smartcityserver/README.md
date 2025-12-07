# SmartCity Server (MySQL backend)

This project provides a simple Express backend using Sequelize (MySQL) to store SmartCity entities: schools, hospitals, energy, transport, tourism, plus user and complaint management.

Quick start

1. Copy `.env.example` to `.env` and set your MySQL credentials (or `MYSQL_URI`) and `JWT_SECRET`.

2. Install dependencies:

```powershell
npm install
```

3. Start the server:

```powershell
npm start
```

You can use MySQL Workbench to inspect the `smartcity_db` database and the generated tables.

## Full API curl examples

Set these environment values in `.env` before running the server:

- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DB`, `MYSQL_USER`, `MYSQL_PASSWORD` or `MYSQL_URI`
- `JWT_SECRET` (change the default in production)

Base URL: `http://localhost:3000`

### Authentication

- Register (public):

```powershell
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}'
```

- Login:

```powershell
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"alice@example.com","password":"secret123"}'
```

- Get current user (requires token):

```powershell
curl http://localhost:3000/api/auth/me -H "Authorization: Bearer <token>"
```

### Users (admin)

- Create user (admin or registration):

```powershell
curl -X POST http://localhost:3000/api/sql/users -H "Content-Type: application/json" -H "Authorization: Bearer <admin-token>" -d '{"name":"Bob","email":"bob@example.com","passwordHash":"<hash>","role":"public"}'
```

- List users:

```powershell
curl http://localhost:3000/api/sql/users -H "Authorization: Bearer <admin-token>"
```

- Get user by id:

```powershell
curl http://localhost:3000/api/sql/users/1 -H "Authorization: Bearer <admin-token>"
```

- Update user:

```powershell
curl -X PUT http://localhost:3000/api/sql/users/1 -H "Content-Type: application/json" -H "Authorization: Bearer <admin-token>" -d '{"name":"Bob Smith","phone":"+1-555-1111"}'
```

- Delete user:

```powershell
curl -X DELETE http://localhost:3000/api/sql/users/1 -H "Authorization: Bearer <admin-token>"
```

### Complaints (public + admin)

- Create complaint (public; optional token to attach reporter):

```powershell
curl -X POST http://localhost:3000/api/sql/complaints -H "Content-Type: application/json" -d '{"title":"Pothole","description":"Big pothole on 5th st","category":"transport","priority":"high","imageLink":"https://cdn.example/pothole.jpg","locationLink":"https://maps.example/?q=12.34,56.78"}'
```

- Create complaint (authenticated):

```powershell
curl -X POST http://localhost:3000/api/sql/complaints -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{"title":"Broken light","description":"Street light out","category":"transport"}'
```

- List complaints (filter by status):

```powershell
curl "http://localhost:3000/api/sql/complaints?status=open" -H "Authorization: Bearer <admin-token>"
```

- Get complaint by id:

```powershell
curl http://localhost:3000/api/sql/complaints/1 -H "Authorization: Bearer <admin-token>"
```

- Update complaint (admin or reporter/assigned):

```powershell
curl -X PUT http://localhost:3000/api/sql/complaints/1 -H "Content-Type: application/json" -H "Authorization: Bearer <admin-token>" -d '{"status":"in-progress","assignedTo":2}'
```

- Delete complaint (admin):

```powershell
curl -X DELETE http://localhost:3000/api/sql/complaints/1 -H "Authorization: Bearer <admin-token>"
```

### Domain resources (schools, hospitals, energy, transport, tourism)

Replace `<resource>` with `schools`, `hospitals`, `energy`, `transport`, or `tourism`.

- List items:

```powershell
curl http://localhost:3000/api/sql/<resource>
```

- Get item:

```powershell
curl http://localhost:3000/api/sql/<resource>/1
```

- Create item (admin):

```powershell
curl -X POST http://localhost:3000/api/sql/<resource> -H "Content-Type: application/json" -H "Authorization: Bearer <admin-token>" -d '{"name":"Sample","address":"Addr","capacity":100,"imageLink":"https://...","locationLink":"https://maps..."}'
```

- Update item (admin):

```powershell
curl -X PUT http://localhost:3000/api/sql/<resource>/1 -H "Content-Type: application/json" -H "Authorization: Bearer <admin-token>" -d '{"notes":"Updated notes"}'
```

- Delete item (admin):

```powershell
curl -X DELETE http://localhost:3000/api/sql/<resource>/1 -H "Authorization: Bearer <admin-token>"
```

### Notes

- For image uploads, upload to a file host (S3, Cloudinary) and send the resulting URL in `imageLink`.
- `locationLink` can be a Google Maps URL or other map link.
- Protect admin endpoints with JWT middleware; set `JWT_SECRET` to a secure value.

### Seed SQL (optional)

Create the database if missing (MySQL Workbench):

```sql
CREATE DATABASE IF NOT EXISTS smartcity_db;
```

You can create an admin user by registering and updating the `role` in the DB, or insert directly. After that, run the server and use the curl examples above.
# SmartCity Server (MySQL backend)

This project provides a simple Express backend using Sequelize (MySQL) to store SmartCity entities: schools, hospitals, energy, transport, and tourism.

Quick start

1. Copy `.env.example` to `.env` and set your MySQL credentials (or `MYSQL_URI`).

2. Install dependencies:

```powershell
npm install
```

3. Start the server:

```powershell
npm start
```

Endpoints (SQL)

- POST `/api/sql/schools`  — create school
- GET  `/api/sql/schools`  — list schools
- POST `/api/sql/hospitals` — create hospital
- GET  `/api/sql/hospitals` — list hospitals
- POST `/api/sql/energy` — create energy record
- GET  `/api/sql/energy` — list energy records
- POST `/api/sql/transport` — create transport record
- GET  `/api/sql/transport` — list transport records
- POST `/api/sql/tourism` — create tourism record
- GET  `/api/sql/tourism` — list tourism records

Example curl (create school):

```powershell
curl -X POST http://localhost:3000/api/sql/schools -H "Content-Type: application/json" -d '{"name":"Central High","address":"Main St","capacity":1200}'
```

You can use MySQL Workbench to inspect the `smartcity_db` database and the generated tables.
