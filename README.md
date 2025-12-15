# Forum API

Forum API adalah aplikasi backend untuk sistem forum diskusi yang dibangun dengan Node.js dan Hapi.js.

## Fitur

- Autentikasi pengguna (register, login, logout)
- Manajemen thread diskusi
- Sistem komentar
- Refresh token untuk keamanan
- Database PostgreSQL
- Testing dengan Jest

## Teknologi

- Node.js
- Hapi.js
- PostgreSQL
- JWT untuk autentikasi
- Jest untuk testing
- ESLint untuk code quality

## Instalasi

1. Clone repository
```bash
git clone <repository-url>
cd forum-api
```

2. Install dependencies
```bash
npm install
```

3. Setup database
```bash
npm run migrate up
```

4. Setup environment variables
```bash
cp .env.example .env
```
Edit file .env sesuai konfigurasi database dan JWT secret

## Menjalankan Aplikasi

### Development
```bash
npm run start:dev
```

### Production
```bash
npm start
```

### Testing
```bash
npm test
```

## API Endpoints

### Authentication
- POST /users - Register user baru
- POST /authentications - Login user
- PUT /authentications - Refresh access token
- DELETE /authentications - Logout user

### Threads
- POST /threads - Buat thread baru
- GET /threads/{id} - Detail thread

### Comments
- POST /threads/{threadId}/comments - Tambah komentar
- DELETE /threads/{threadId}/comments/{commentId} - Hapus komentar

## Environment Variables

```
HOST=<host>
PORT=<port>
PGHOST=<database_host>
PGUSER=<database_user>
PGPASSWORD=<database_password>
PGDATABASE=<database_name>
PGPORT=<database_port>
ACCESS_TOKEN_KEY=<access_token_key>
REFRESH_TOKEN_KEY=<refresh_token_key>
ACCESS_TOKEN_AGE=<token_age_in_seconds>
```

## Testing

Jalankan semua test:
```bash
npm test
```

Test dengan coverage:
```bash
npm run test:watch
```

## Deployment

1. Setup VPS dengan Node.js dan PostgreSQL
2. Clone repository ke VPS
3. Install dependencies
4. Setup environment variables
5. Jalankan migrasi database
6. Start aplikasi dengan PM2

```bash
pm2 start ecosystem.config.js
```

## Health Check

Untuk mengecek status aplikasi:
```bash
curl http://<host>:<port>/health
```