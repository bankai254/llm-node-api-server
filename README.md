# LLM API Server

This project is a RESTful API built using Node.js, Express, MongoDB, and TypeScript. It provides endpoints to manage conversations, where each conversation can have multiple messages. The API interacts with an external service to generate responses for the messages.

## Features

- **Conversations Management**: Create and manage conversations.
- **Messages Management**: Add messages to conversations, where each message includes a query and a response.
- **External API Integration**: Fetch responses for messages from an external API.

## Prerequisites

- **Node.js**: >= 14.x.x
- **npm**: >= 6.x.x
- **MongoDB**: A running instance of MongoDB

## Installation

1.  **Clone the repository:**

        git clone https://github.com/bankai254/llm-node-api-server
        cd llm-node-api-server

2.  **Install dependencies:**

        npm install

3.  **Set up environment variables:**
    Create a `.env ` file in the root directory and add the following:

    MONGODB_URI=mongodb://localhost:27017/conversations_db PORT=3000
    EXTERNAL_API_URL=http://localhost:8000

4.  **Compile TypeScript:**

        npm run build

5.  **Setting up the LLM Server :**
    
    To learn more about the LLM Server - https://github.com/bankai254/llm-python-program

    - **Option 1** - Using Remote repository with Docker
      - Update the `llm` service environment `HF_TOKEN`
      - Run `docker compose up --build` (first time) or `docker compose up` (subsequent times)
    - **Option 2** - Using local repository with Docker
      - Clone https://github.com/bankai254/llm-python-program.git
      - Update `llm` service `build` value to the location of the local repository
      - Add `HF_TOKEN` to `.env` file in local repository
      - Run `docker compose up --build` (first time) or `docker compose up` (subsequent times)

5.  **Start the server :**
    You can skip this if you intend to use Docker.

        npm start

6.  **Using Docker:**

        docker-compose up --build

## Scripts

- **`npm start`**: Runs the compiled JavaScript code.
- **`npm run build`**: Compiles TypeScript to JavaScript.
- **`npm run dev`**: Runs the server in development mode using `ts-node` and `nodemon`.
- **`npm run lint`**: Lints the TypeScript code using ESLint.
- **`npm run format`**: Formats the code using Prettier.

## API Endpoints

### Conversations

- **GET `/conversations`** - Retrieves all conversations.

  **Response:**

      `[
         {
           "_id": "unique_conversation_id_1",
           "model": 1,
           "messages": [
             {
               "_id": "unique_message_id_1",
               "query": "Hello, how are you?",
               "response": "I'm fine, thank you!",
               "createdAt": "2024-08-03T12:00:00.000Z"
             }
           ],
           "createdAt": "2024-08-03T12:00:00.000Z"
         }
      ]`

- **GET `/conversations/:id`** - Retrieves a specific conversation by ID.

  **Response:**

      `{
       "_id": "unique_conversation_id_1",
       "model": 1,
       "messages": [
         {
           "_id": "unique_message_id_1",
           "query": "Hello, how are you?",
           "response": "I'm fine, thank you!",
           "createdAt": "2024-08-03T12:00:00.000Z"
         }
       ],
       "createdAt": "2024-08-03T12:00:00.000Z"
      }`

- **POST `/conversations`** - Creates a new conversation with an initial message.

  **Request Body:**

      `{
        "model": 1,
        "query": "Hello, how are you?"
      }`

  **Response:**

      `{
        "_id": "unique_conversation_id_2",
        "model": 1,
        "messages": [
          {
            "_id": "unique_message_id_2",
            "query": "Hello, how are you?",
            "response": "I'm fine, thank you!",
            "createdAt": "2024-08-03T14:00:00.000Z"
          }
        ],
        "createdAt": "2024-08-03T14:00:00.000Z"
      }`

### Messages

- **POST `/conversations/:id/messages`** - Adds a new message to an existing conversation.

  **Request Body:**

       `{
         "query": "What's the weather like today?"
       }`

  **Response:**

      	  `{
      	    "_id": "unique_message_id_3",
      	    "query": "What's the weather like today?",
      	    "response": "The weather is sunny and warm.",
      	    "createdAt": "2024-08-03T15:00:00.000Z"
      	  }`
