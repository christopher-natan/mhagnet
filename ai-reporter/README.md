# Mhagnet AI Reporter
Document extraction of report with AI that automatically locate and retrieve specific information 
from various types of documents. 

### Docker
- Clone the Mhagnet AI Reporter
- Type the command 
`docker compose up --build`

  
### Endpoints
Return results depending on the type of document and prompt.

    ENDPOINT: {SERVER}:{PORT}/api/document/extract
    METHOD: POST
    HEADER: url

### Directory structure
    .
    ├── controllers             # Handle the entry point, call services and models
    ├── models                  # Manages the data, reads data from files or database
    ├── services                # Performs specific functions used by controllers
    ├── utils                   # Tools and utilities
    ├── prompts                 # AI Prompt sources
    ├── configs.ts              # App global config

### Set the Open AI Key
We need to set the OpenAI Key

