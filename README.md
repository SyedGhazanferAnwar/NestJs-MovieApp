# NestJS MovieApp


NestJS MovieApp is a movie management application that allows users to perform CRUD operations on movies, register, and authenticate users. The app is designed with simplicity and scalability in mind, making it an ideal solution for managing movie data efficiently.

## Key Features

1. **Movie Management**: Users can create, read, update, and delete movies, providing full control over the movie database.

2. **User Authentication**: The application supports user registration and authentication using JSON Web Tokens (JWT), ensuring secure access to movie management features.

3. **Rating and Comments**: Authenticated users can rate movies and leave comments, encouraging user engagement and feedback.

4. **API Documentation**: The application comes with detailed API documentation powered by Swagger, accessible at `http://localhost:3000/docs`.

5. **Implement Ranking or Scoring for Films** (Not Implemented due to Shortage of Time)

6. **Search and Autocomplete** (Not Implemented due to Shortage of Time)
## Installation and Configuration

To run the NestJS MovieApp, follow these steps:

1. Clone the repository: `git clone https://github.com/SyedGhazanferAnwar/NestJs-MovieApp.git`

2. Install dependencies: `npm install`

3. Configure MONGODB_CONNECTION_STRING in the .env file.

4. Configure Elasticsearch (Optional): If you are using Elasticsearch, ensure it is installed and running, and update the Elasticsearch node URL in `src/elasticsearch/elasticsearch.service.ts`.


## Running the Application

To start the application, use the following command:

```bash
npm run start:dev
```

The NestJS MovieApp will be available at `http://localhost:3000`.

## Note

Please note that due to time constraints, some optimizations like validations with Joi and additional enhancements are not be fully implemented in this submission. However, I am committed to further improving and expanding the application in the future.

## Contact

If you have any questions or feedback, please feel free to reach out to me at s.ghazanferanwar@gmail.com. I look forward to discussing this assignment further and contributing my skills.

Thank you for considering my submission.

Best regards,
Syed Ghazanfer Anwar