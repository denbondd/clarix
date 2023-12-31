DROP TABLE IF EXISTS msg_sources;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS chats;
DROP TABLE IF EXISTS agent_has_folders;
DROP TABLE IF EXISTS agents;
DROP TABLE IF EXISTS models;
DROP TABLE IF EXISTS embeddings;
DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS folders;
DROP TABLE IF EXISTS msg_roles;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS users;

-- Auth module
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  "image" TEXT
);

CREATE TABLE accounts (
  account_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE ("provider", provider_account_id)
);

-- KnowledbeBase module
CREATE TABLE folders (
  folder_id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

CREATE TABLE files (
  file_id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  folder_id INT NOT NULL REFERENCES folders(folder_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  edited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  content TEXT NOT NULL,
  UNIQUE(folder_id, name)
);

CREATE TABLE embeddings (
  embedding_id SERIAL PRIMARY KEY NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  file_id INT NOT NULL REFERENCES files(file_id) ON DELETE CASCADE
);

-- Agents module
CREATE TABLE models (
  model_id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  tech_name VARCHAR(50) NOT NULL
);
INSERT INTO models (name, tech_name) VALUES ('Chat GPT 3.5-turbo', 'gpt-3.5-turbo'), ('Chat GPT 4', 'gpt-4');

CREATE TABLE agents (
  agent_id SERIAL PRIMARY KEY NOT NULL,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  model_id INT NOT NULL REFERENCES models(model_id),
  system_prompt VARCHAR(255) NOT NULL,
  temperature INT NOT NULL,
  UNIQUE(user_id, name)
);

CREATE TABLE agent_has_folders (
  agent_id INT NOT NULL,
  folder_id INT NOT NULL,
  PRIMARY KEY (agent_id, folder_id),
  FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE CASCADE,
  FOREIGN KEY (folder_id) REFERENCES folders(folder_id) ON DELETE CASCADE
);

-- Chat module
CREATE TABLE chats (
  chat_id SERIAL PRIMARY KEY NOT NULL,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  agent_id INT NOT NULL REFERENCES agents(agent_id),
  UNIQUE(user_id, name)
);

CREATE TABLE msg_roles (
  msg_role_id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(12) NOT NULL
);
INSERT INTO msg_roles (name) VALUES ('system'), ('user'), ('assistant');

CREATE TABLE messages (
  message_id SERIAL PRIMARY KEY NOT NULL,
  chat_id INT NOT NULL REFERENCES chats(chat_id),
  role_id INT NOT NULL REFERENCES msg_roles(msg_role_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  content TEXT NOT NULL
);

CREATE TABLE msg_sources (
  message_id INT NOT NULL,
  embedding_id INT NOT NULL,
  similarity DOUBLE PRECISION NOT NULL,
  PRIMARY KEY (message_id, embedding_id),
  FOREIGN KEY (message_id) REFERENCES messages(message_id) ON DELETE CASCADE,
  FOREIGN KEY (embedding_id) REFERENCES embeddings(embedding_id) ON DELETE CASCADE
);