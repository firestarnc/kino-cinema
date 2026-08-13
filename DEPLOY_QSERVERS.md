# Kino Screens Deployment (QServers Apache + Zip Upload)

This project is deployed by uploading a zip archive to `public_html`.

## Important facts

- `npm` does **not** upload files for you.
- `npm` does **not** auto-create your server `.env` values.
- You must upload files first, then configure `.env`, then run install/build/start on server.

## Release flow (recommended)

1. Prepare a release zip from your local project.
2. Upload zip to QServers `public_html`.
3. Extract zip in `public_html`.
4. Ensure `.env` on server has production values.
5. Run automated deploy:
   - `npm run deploy:qservers`
6. If needed, run health check only:
   - `npm run health:backend`
7. If app does not boot, inspect PM2 logs:
   - `pm2 logs kino-cinema --lines 120`
8. Ensure Apache proxy target is still `http://127.0.0.1:3000/`.
9. Confirm site and booking routes work.
10. Apply/verify Apache cache + compression rules.

## 60-second zero-miss deploy checklist

Use this exact sequence after each zip upload to avoid Apache AH01114 backend errors.

1. SSH into server and move to deploy folder:
  - cd /home/YOUR_USER/public_html
2. Confirm required files exist:
  - ls -la package.json deploy.sh scripts/check-backend.sh
3. Ensure deploy scripts are executable:
  - chmod +x deploy.sh scripts/check-backend.sh
4. Run automated deploy:
  - npm run deploy:qservers
5. Run backend health check:
  - npm run health:backend
6. Confirm backend listener is up:
  - ss -tulpen | grep 3000
7. Confirm local backend responds:
  - curl -I http://127.0.0.1:3000/
8. Confirm public domain responds:
  - curl -I https://kinoscreens.com/

Expected healthy state:
- Port 3000 has a LISTEN process.
- Local curl to 127.0.0.1:3000 returns HTTP headers.
- Public domain no longer returns proxy connection errors.

If anything fails, run in this order:
1. pm2 status
2. pm2 logs kino-cinema --lines 120
3. tail -f /home/YOUR_USER/logs/error_log
4. Re-run: npm run deploy:qservers

One-time PM2 persistence setup (do this once):
1. pm2 save
2. pm2 startup
3. Run the command printed by pm2 startup
4. pm2 save

## New deployment commands

- `npm run deploy:qservers`
  - Runs install + build.
  - Starts or restarts PM2 process `kino-cinema`.
  - Fails deployment if `http://127.0.0.1:3000/` is not reachable.
- `npm run health:backend`
  - Checks whether backend is reachable at `127.0.0.1:${PORT:-3000}`.

## Minimal server env checklist

Set these in server `.env` (or process manager env):

- `NEXT_PUBLIC_SITE_URL=https://kinoscreens.com`
- `NEXT_PUBLIC_BUSINESS_NAME=Kino Screens`
- `NEXT_PUBLIC_BUSINESS_PHONE=...`
- `NEXT_PUBLIC_BUSINESS_STREET=...`
- `NEXT_PUBLIC_BUSINESS_LOCALITY=Benin City`
- `NEXT_PUBLIC_BUSINESS_REGION=Edo`
- `NEXT_PUBLIC_BUSINESS_POSTAL_CODE=300001`
- `NEXT_PUBLIC_BUSINESS_COUNTRY=NG`
- `NEXT_PUBLIC_BUSINESS_OPENING_HOURS=Mo-Su 10:00-22:00`

Project-specific secrets (payment, db, email, admin):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_BLOCKBUSTER_BUCKET`
- `NEXT_PUBLIC_SUPABASE_MOVIE_PACKAGE_BUCKET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_SECRET_KEY`
- `QSERVERS_SMTP_HOST`
- `QSERVERS_SMTP_PORT`
- `QSERVERS_SMTP_USER`
- `QSERVERS_SMTP_PASSWORD`
- `BOOKING_FROM_EMAIL`
- `ADMIN_BASIC_USERNAME`
- `ADMIN_BASIC_PASSWORD`

## Apache optimization snippet

Use this after deployment to improve speed.

You can also use the ready template in `qservers.public_html.htaccess.example`:

1. Copy it to `public_html/.htaccess`.
2. Reload Apache from QServers panel/SSH.

```apache
<IfModule mod_brotli.c>
  BrotliCompressionQuality 5
  AddOutputFilterByType BROTLI_COMPRESS text/plain text/html text/css text/javascript application/javascript application/json application/xml image/svg+xml
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain text/html text/css text/javascript application/javascript application/json application/xml image/svg+xml
</IfModule>

SetEnvIf Request_URI "^/_next/static/" IS_NEXT_STATIC
SetEnvIf Request_URI "^/(posters|backdrops|rooms|avatars)/" IS_PUBLIC_MEDIA
SetEnvIf Request_URI "^/api/" IS_API

<IfModule mod_headers.c>
  Header always set Cache-Control "public, max-age=31536000, immutable" env=IS_NEXT_STATIC
  Header always set Cache-Control "public, max-age=2592000" env=IS_PUBLIC_MEDIA
  Header always set Cache-Control "no-store" env=IS_API
</IfModule>
```

## Post-deploy validation

Check these URLs manually:

- `https://kinoscreens.com/now-showing/`
- `https://kinoscreens.com/book/`
- `https://kinoscreens.com/screening/film-1/`

Header checks:

- `/_next/static/*` should return `Cache-Control: public, max-age=31536000, immutable`
- `/api/*` should return `Cache-Control: no-store`

## Notes for this project

- `trailingSlash` is enabled in Next config.
- Keep route links with trailing slash in production for Apache consistency.
- After any `.env` change, restart process (and rebuild if needed).
- Poster loading is Supabase-only. If `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_BLOCKBUSTER_BUCKET`, or `NEXT_PUBLIC_SUPABASE_MOVIE_PACKAGE_BUCKET` is missing, the app fails fast during startup.
