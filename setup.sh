#!/usr/bin/env bash
set -e

# ------------------------------------------
# JAMC project setup script for Codex sandbox
# (with CREATEDB granted so Prisma Migrate can create a shadow DB)
# ------------------------------------------

echo "🔧 1) Checking for pnpm…"
if ! command -v pnpm >/dev/null 2>&1; then
  echo "   • pnpm not found. Installing globally via npm…"
  npm install -g pnpm
else
  echo "   • pnpm is already installed."
fi

echo ""
echo "🔧 2) Copying .env.example → .env.local (if missing)…"
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "   • Created .env.local from .env.example"
else
  echo "   • .env.local already exists; skipping copy."
fi

echo ""
echo "📦 3) Installing Node.js dependencies with pnpm…"
pnpm install

echo ""
echo "🐘 4) Installing PostgreSQL (apt)…"
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

echo ""
echo "🚀 5) Starting PostgreSQL service…"
sudo service postgresql start || true

echo ""
echo "🗄️ 6) Creating Postgres role & database for sandbox…"
DB_USER="sandbox_user"
DB_PASS="sandbox_pwd"
DB_NAME="sandbox_db"

# 6a) Create role if it doesn’t exist
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1; then
  echo "   • Role '$DB_USER' already exists; skipping role creation."
else
  sudo -u postgres psql -c "CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASS';"
  echo "   • Created role '$DB_USER'."
fi

# 6b) Grant CREATEDB so Prisma can spin up a shadow database
echo "   • Granting CREATEDB privilege to '$DB_USER' so Prisma Migrate can create a shadow database..."
sudo -u postgres psql -c "ALTER ROLE $DB_USER WITH CREATEDB;"
echo "   • Granted CREATEDB to '$DB_USER'."

# 6c) Create database if it doesn’t exist
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1; then
  echo "   • Database '$DB_NAME' already exists; skipping creation."
else
  sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
  echo "   • Created database '$DB_NAME' (owner: $DB_USER)."
fi

echo ""
echo "🏃 7) Running database migrations…"
pnpm db:migrate

echo ""
echo "🌱 8) Seeding database…"
pnpm db:seed

echo ""
echo "✅ Setup complete! Next steps:"
echo ""
echo "    1) If you’re using Prisma, migrations have already run and your shadow DB can be created."
echo "    2) Run your dev server with:\n\n       pnpm dev\n"
echo ""
echo "Your app will connect to the database at:"
echo "    postgres://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME?schema=public"
echo ""
