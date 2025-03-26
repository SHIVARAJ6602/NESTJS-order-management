```markdown
## Running the Project with Docker

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

   ```bash
   docker build -t order-management .
  ```

- Then run the container:
- `docker run -p 8080:8080 order-management`

3. Access the application at `https://order-app-c5vdzevwdq-el.a.run.app`.

4. Acess API Documant at `https://order-app-c5vdzevwdq-el.a.run.app/api-docs`.

5. ER-Diagram

```

```

- ![alt text](<NestJS-based order management microservice ER.png>)

- [view ER description PDF](<NestJS-based order management microservice ER.pdf>)

  ```

### Exposed Ports

- Application: `8080` (mapped to host `8080`).
- Database: Not exposed to the host.

```
