#!/usr/bin/env bash


# Exit immediately if any command fails
set -e

# At this stage ./vendor/bin/sail is not available
echo "Installing Composer dependencies..."
./composer install --no-dev --optimize-autoloader

echo "Building the container image..."
./vendor/bin/sail build --no-cache

echo "Starting the container..."
./vendor/bin/sail up -d

echo "Installing NPM dependencies..."
./vendor/bin/sail npm install --silent --no-progress

echo "Building frontend assets..."
./vendor/bin/sail npm run build

echo "Generating the laravel key..."
./vendor/bin/sail artisan key:generate

echo "Migrating the database..."
./vendor/bin/sail artisan migrate:fresh --seed

echo "Clearing previous state..."
./vendor/bin/sail artisan optimize:clear

echo "Optimizing Laravel application..."
./vendor/bin/sail artisan optimize


echo "Deployment finished successfully!"
