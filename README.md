```markdown
```

### Running the Project with Docker

To run this project using Docker, follow the steps below:

### Prerequisites

Ensure you have Docker and Docker Compose installed on your system. The project uses the following Docker images:

- Node.js version `22.13.1-slim` for the application.
- PostgreSQL `latest` for the database.

### Environment Variables

The application requires the following environment variables:

- `NODE_ENV`: Set to `production`.
- `PORT`: The port on which the application will run (`8080`).

### Steps to Build and Run

1. Clone the repository and navigate to the project directory.
2. Build and start the services using Docker:

- Build:

   ```bash
    docker build -t order-management .
    ```

- Then run the container:

   ```bash
   docker run -p 8080:8080 order-management
   ```

### Access the REST API at

  You can access the API here: [API URL](https://order-app-c5vdzevwdq-uc.a.run.app).


### Access OpenAPI (Swagger)

You can access the API documentation here: [API Documentation](https://order-app-c5vdzevwdq-uc.a.run.app/api-docs).


### ER-Diagram

```
```

- ![alt text](<NestJS-based order management microservice ER.png>)

- [view ER description PDF](<NestJS-based order management microservice ER.pdf>)

```markdown
```

### Postman Collections

```markdown
```

- [Order Management API Postman Collection](<Order Management API Postman Collection.json>)
- Create New user and login, Or use id=1 and passowrd='password' to generate JWT token
- Use JWT token to access protected routes using POSTMAN or other service

### Exposed Ports

- Application: `8080` (mapped to host `8080`).
- Database: Not exposed to the host.

```
