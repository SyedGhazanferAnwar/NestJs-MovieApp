# NestJS MovieApp: A Comprehensive Movie Management Platform

## Project Overview

NestJS MovieApp is a comprehensive movie management application built with NestJS, designed to provide a robust and scalable solution for movie-related operations. The application enables users to interact with a movie database through a feature-rich and secure platform.

### Core Purpose
The primary objective of this application is to offer a sophisticated movie management system that allows users to:
- Create, read, update, and delete movie entries
- Authenticate and manage user accounts
- Interact with movies through ratings and comments
- Perform advanced searching and filtering of movie data

### Key Features
- **Comprehensive Movie Management**: Full CRUD operations for movie entries, giving users complete control over the movie database
- **Secure User Authentication**: Implemented using JSON Web Tokens (JWT) to ensure secure and controlled access
- **Interactive User Engagement**: Allows authenticated users to rate movies and leave comments
- **Advanced Search Capabilities**: 
  - Search movies by name or description
  - Filter results by popularity, genre, country, or rating
  - Intelligent search with misspelling tolerance and stop word handling
- **Movie Ranking System**: Implements dynamic ranking and scoring for movies based on genre-specific criteria
- **API Documentation**: Swagger-powered documentation for easy API exploration and integration

### Technical Foundations
Built with modern web technologies including NestJS, MongoDB, and Elasticsearch, the application provides a scalable and performant solution for movie data management. The architecture supports easy extensibility and follows best practices in software design.

## Getting Started, Installation, and Setup

### Prerequisites

- Node.js (version 20.x or later)
- Yarn package manager
- MongoDB
- Elasticsearch

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nestjs-assignment
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Set your MongoDB connection string in the `.env` file:
     ```
     MONGODB_CONNECTION_STRING="your_mongodb_connection_string"
     ```

### Running the Application

#### Development Mode
To run the application in development mode with hot-reload:
```bash
yarn start:dev
```

#### Production Mode
To build and run the production version:
```bash
# Build the application
yarn build

# Start the production server
yarn start:prod
```

### Development Scripts

- `yarn start`: Start the application
- `yarn start:debug`: Start in debug mode
- `yarn test`: Run unit tests
- `yarn test:watch`: Run tests in watch mode
- `yarn lint`: Run code linting
- `yarn format`: Format code using Prettier

### Additional Configuration

- Ensure Elasticsearch is running and accessible
- Configure any additional environment variables as needed

### Troubleshooting

- Verify MongoDB connection string
- Check Elasticsearch service is running
- Ensure all dependencies are correctly installed

## API Documentation

### Endpoints

#### Authentication Endpoints
These endpoints handle user authentication and registration.

1. **User Login**
   - **Method**: `POST`
   - **Path**: `/auth/login`
   - **Request Body**:
     ```json
     {
       "username": "string",
       "password": "string"
     }
     ```
   - **Success Response**: Returns user authentication token
   - **Error Response**: 
     - `401 Unauthorized` if credentials are invalid

2. **User Registration**
   - **Method**: `POST`
   - **Path**: `/auth/register`
   - **Request Body**:
     ```json
     {
       "username": "string",
       "password": "string",
       "email": "string"
     }
     ```
   - **Success Response**: Returns registered user details

#### Movie Endpoints
These endpoints handle movie-related operations.

1. **Create Movie**
   - **Method**: `POST`
   - **Path**: `/movies`
   - **Request Body**:
     ```json
     {
       "title": "string",
       "genre": "string",
       "description": "string"
     }
     ```
   - **Success Response**: Returns created movie object

2. **Get All Movies**
   - **Method**: `GET`
   - **Path**: `/movies`
   - **Success Response**: Returns array of movie objects

3. **Search Movies**
   - **Method**: `GET`
   - **Path**: `/movies/search`
   - **Query Parameters**:
     - `query`: Search term (required)
     - `genre`: Optional genre filter
   - **Success Response**: Returns matching movie objects

4. **Get Movie by ID**
   - **Method**: `GET`
   - **Path**: `/movies/:id`
   - **Success Response**: Returns specific movie object

5. **Update Movie**
   - **Method**: `PUT`
   - **Path**: `/movies/:id`
   - **Request Body**: Same as Create Movie DTO
   - **Success Response**: Returns updated movie object

6. **Delete Movie**
   - **Method**: `DELETE`
   - **Path**: `/movies/:id`
   - **Success Response**: Returns deleted movie object

#### Protected Movie Endpoints (Require Authentication)
These endpoints require a valid authentication token.

1. **Rate Movie**
   - **Method**: `POST`
   - **Path**: `/movies/rate`
   - **Authentication**: Required
   - **Request Body**:
     ```json
     {
       "movieId": "string",
       "rating": "number"
     }
     ```

2. **Comment on Movie**
   - **Method**: `POST`
   - **Path**: `/movies/comment`
   - **Authentication**: Required
   - **Request Body**:
     ```json
     {
       "movieId": "string", 
       "comment": "string"
     }
     ```

### Authentication
- Token-based authentication is used
- Include the authentication token in the `Authorization` header for protected routes
- Tokens can be obtained by successfully logging in

## Authentication

The application uses JWT (JSON Web Token) for authentication, providing a secure mechanism for user access and identification.

### Authentication Mechanism

Authentication is handled through a token-based system with the following key features:

- **User Registration**: New users can register by providing:
  - First Name
  - Last Name
  - Username
  - Email
  - Password

- **Login Process**:
  1. Users provide their username and password
   
- **Token Generation**:
  - Upon successful authentication, a JWT access token is generated
  - The token contains the user's ID and username
  - Tokens are signed with a secret key for security

### Authentication Headers

When making authenticated requests, include the following header:

```http
Authorization: Bearer <jwt_token>
```

### Security Features

- Passwords are securely hashed using bcrypt before storage
- JWT tokens are verified on each protected route
- Duplicate username or email registrations are prevented
- Unauthorized access attempts are rejected with appropriate error responses

### Token Validation

Each protected route uses an AuthGuard that:
- Extracts the JWT token from the Authorization header
- Verifies the token's authenticity
- Attaches the user payload to the request for further processing

### Important Notes

- Keep your JWT token confidential
- Tokens have a limited validity period
- Always use HTTPS to prevent token interception

## Deployment

This NestJS application can be deployed using multiple approaches:

### Docker Deployment
While no Dockerfile is currently present, the application is containerization-ready. You can create a Dockerfile with the following basic structure:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start:prod"]
```

### Environment Configuration
Configure the following mandatory environment variables:
- `MONGODB_CONNECTION_STRING`: Connection URL for your MongoDB database
- `JWT_SECRET`: Secret key for JWT authentication (recommended)

### Production Deployment
For production, use the following npm/yarn scripts:
- Build application: `yarn build`
- Start in production mode: `yarn start:prod`

### Scaling Considerations
- The application uses NestJS, which supports horizontal scaling
- Stateless design allows for easy horizontal scaling
- Recommended to use a load balancer for distributing traffic
- Consider using a managed MongoDB service for database scalability

### Recommended Cloud Platforms
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- DigitalOcean App Platform

### Performance Optimization
- Enable caching mechanisms
- Use a CDN for static assets
- Implement rate limiting
- Monitor application performance using APM tools

## Project Structure

The project follows a typical NestJS application structure, organized to provide clear separation of concerns and modularity:

### Root Directory
- `nest-cli.json`: NestJS CLI configuration file
- `package.json`: Project dependencies and scripts
- `tsconfig.json` and `tsconfig.build.json`: TypeScript configuration files
- `.env.example`: Example environment configuration
- `.eslintrc.js` and `.prettierrc`: Code style and linting configurations

### Source Code (`src/`)
The source code is organized into modular directories, each representing a specific domain or feature:

#### Core Application Structure
- `main.ts`: Application entry point
- `app.module.ts`: Root application module
- `app.controller.ts`: Main application controller
- `app.service.ts`: Main application service

#### Authentication (`src/auth/`)
- `auth.module.ts`: Authentication module configuration
- `auth.service.ts`: Authentication logic and user management
- `auth.controller.ts`: Authentication-related API endpoints
- `auth.guard.ts`: Authentication middleware
- `constants.ts`: Authentication-related constants
- `dto/`: Data Transfer Objects for authentication
  - `log-in.dto.ts`: Login request structure
  - `register.dto.ts`: User registration request structure
  - `user-response.dto.ts`: User response format

#### Movies Feature (`src/movie/`)
- `movies.module.ts`: Movies feature module
- `movies.service.ts`: Business logic for movie-related operations
- `movies.controller.ts`: Movie-related API endpoints
- `dto/`: Data Transfer Objects for movies
  - `create-movie.dto.ts`: Movie creation request structure
  - `create-comment.dto.ts`: Comment creation request structure
  - `create-rating.dto.ts`: Rating creation request structure
- `schemas/`: Data models
  - `movie.schema.ts`: Movie data model definition

#### Elasticsearch Integration (`src/elasticsearch/`)
- `elasticsearch.module.ts`: Elasticsearch module configuration
- `elasticsearch.service.ts`: Elasticsearch client and search operations

### Testing
- `test/`: End-to-end (e2e) testing directory
  - `app.e2e-spec.ts`: E2E test specifications
  - `jest-e2e.json`: Jest configuration for e2e tests

### Hidden Directories
- `.kno/`: Contains embedding and vector storage files, likely used for advanced search or recommendation features

## Technologies Used

### Backend Framework
- NestJS (v10.0.0)

### Programming Language
- TypeScript (v5.1.3)

### Database
- MongoDB (via Mongoose v7.4.0)

### Authentication
- JWT (JSON Web Tokens) with @nestjs/jwt
- Bcrypt for password hashing

### Search and Indexing
- Elasticsearch (@elastic/elasticsearch v8.8.1)

### Validation and Serialization
- Class Transformer
- Class Validator

### Development Tools
- NestJS CLI
- ESLint
- Prettier
- Jest (Testing Framework)

### Additional Libraries
- RxJS (Reactive Extensions)
- Reflect-Metadata

### API Documentation
- Swagger (@nestjs/swagger)

### Environment and Configuration
- @nestjs/config for environment management

## Additional Notes

### Performance and Scalability Considerations

The application is built using NestJS, which provides a robust architecture for scalable backend services. Key architectural considerations include:

- Modular design with separate modules for authentication, movies, and Elasticsearch integration
- Use of TypeScript for type safety and improved developer experience
- JWT-based authentication for secure user management

### Error Handling and Validation

The application implements structured error handling and input validation:

- Data Transfer Objects (DTOs) in `src/auth/dto/` and `src/movie/dto/` enforce input validation
- Authentication guards protect sensitive endpoints
- Comprehensive error handling in service and controller layers

### Search and Indexing

The application leverages Elasticsearch for advanced search capabilities:

- Supports fuzzy search with misspelling tolerance
- Enables filtering movies by multiple criteria (genre, popularity, rating)
- Implements custom scoring mechanisms for movie relevance

### Security Considerations

- Password protection through hashing (implied by authentication mechanism)
- JWT-based authentication with secure token management
- Input validation to prevent injection and malformed data

### Potential Enhancements

While the current implementation provides core functionality, potential areas for future improvement include:

- Implementing more granular role-based access control
- Adding comprehensive logging and monitoring
- Expanding search and recommendation algorithms
- Implementing rate limiting and additional security measures

### Environment and Configuration

The application uses environment-based configuration:
- `.env.example` suggests configurable parameters
- Supports MongoDB connection configuration
- Optional Elasticsearch integration

### Development Tools

The project is configured with:
- ESLint for code quality
- Prettier for code formatting
- NestJS CLI for project management
- Jest for testing

### Known Limitations

As noted in the original README, some optimizations are pending due to time constraints. Users and contributors should be aware that the project is a work in progress.

## Contributing

We welcome contributions to the NestJS MovieApp! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### Getting Started

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Submit a pull request

### Code Style and Formatting

This project uses ESLint and Prettier for code consistency:

- Use TypeScript with the project's ESLint configuration
- Run `yarn lint` to check your code against style guidelines
- Ensure your code follows the existing code style
- Use single quotes for strings
- Use trailing commas

### Testing

- Write unit tests for new features or bug fixes
- Ensure all existing tests pass by running `yarn test`
- Aim for high test coverage

### Commit Guidelines

- Use clear and descriptive commit messages
- Follow conventional commit format if possible (e.g., `feat:`, `fix:`, `docs:`)
- Keep commits focused and atomic

### Reporting Issues

- Use GitHub Issues to report bugs or suggest enhancements
- Provide a clear description of the issue
- Include steps to reproduce the problem if applicable
- If reporting a bug, include your environment details and any relevant logs

### Pull Request Process

1. Ensure your code passes all tests and linting checks
2. Update the README or documentation if your changes affect usage
3. Your pull request will be reviewed by the maintainers
4. Be responsive to feedback and be prepared to make requested changes

### Additional Notes

- This project is maintained by Syed Ghazanfer Anwar
- Contributions are governed by the project's license
- Be respectful and constructive in all interactions

## License

This project is currently unlicensed. Without a specific license, the following default copyright protections apply:

- The original author retains all copyright
- No one else may reproduce, distribute, or create derivative works
- No permissions are granted for use, modification, or sharing of the code

#### Recommended Actions
If you wish to use this code, it is recommended to:
- Contact the author for explicit permission
- Request a specific open-source license be added to the project