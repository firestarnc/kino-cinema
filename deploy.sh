
#!/usr/bin/env bash

set -euo pipefail

# QServers post-upload deployment helper for this Next.js app.
# Run this in your deployed project directory after extracting the release zip.

APP_NAME="${APP_NAME:-kino-cinema}"
APP_PORT="${PORT:-3000}"
PM2_CMD="$(command -v pm2 || true)"
PM2_LOCAL_CMD="./node_modules/.bin/pm2"

echo "[deploy] Starting deployment for ${APP_NAME} on port ${APP_PORT}"

if [[ ! -f package.json ]]; then
	echo "[deploy] ERROR: package.json not found. Run this from the app root."
	exit 1
fi

if [[ ! -f .env ]]; then
	echo "[deploy] ERROR: .env is missing. Create it before building."
	exit 1
fi

echo "[deploy] Installing dependencies"
npm install

echo "[deploy] Building production bundle"
npm run build

echo "[deploy] Ensuring PM2 is available"
if [[ -z "${PM2_CMD}" ]]; then
	if [[ -x "${PM2_LOCAL_CMD}" ]]; then
		echo "[deploy] PM2 found in project dependencies"
		PM2_CMD="${PM2_LOCAL_CMD}"
	else
		echo "[deploy] PM2 not found globally; installing project-local pm2"
		npm install pm2 --save-prod
		if [[ -x "${PM2_LOCAL_CMD}" ]]; then
			PM2_CMD="${PM2_LOCAL_CMD}"
		else
			echo "[deploy] Local PM2 install failed; trying global install"
			npm install -g pm2
			PM2_CMD="$(command -v pm2 || true)"
		fi
	fi
fi

if [[ -z "${PM2_CMD}" ]]; then
	echo "[deploy] ERROR: PM2 installation failed."
	exit 1
fi

echo "[deploy] Restarting process via PM2"
if "${PM2_CMD}" describe "${APP_NAME}" >/dev/null 2>&1; then
	"${PM2_CMD}" restart "${APP_NAME}" --update-env
else
	"${PM2_CMD}" start npm --name "${APP_NAME}" -- start
fi

"${PM2_CMD}" save >/dev/null

echo "[deploy] Waiting for app boot"
sleep 2

echo "[deploy] Running backend health check"
if ! curl -fsS "http://127.0.0.1:${APP_PORT}/" >/dev/null; then
	echo "[deploy] ERROR: Backend is not reachable at 127.0.0.1:${APP_PORT}"
	echo "[deploy] Hint: check logs with: pm2 logs ${APP_NAME} --lines 120"
	exit 1
fi

echo "[deploy] Success: backend is reachable on 127.0.0.1:${APP_PORT}"
