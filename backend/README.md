# PFinances AI - Backend

This is the Laravel backend for the PFinances AI application.

## Getting Started

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies (if not already installed):
    ```bash
    composer install
    ```
3.  Copy `.env.example` to `.env` and configure your database:
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```
4.  Run migrations:
    ```bash
    php artisan migrate
    ```
5.  Start the server:
    ```bash
    php artisan serve
    ```

## API Documentation

(Add API documentation here)
