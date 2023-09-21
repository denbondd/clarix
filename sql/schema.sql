DROP TABLE IF EXISTS msg_sources;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS chats;
DROP TABLE IF EXISTS agents;
DROP TABLE IF EXISTS agent_settings;
DROP TABLE IF EXISTS models;
DROP TABLE IF EXISTS embeddings;
DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS folders;

-- KnowledbeBase module
CREATE TABLE folders (
    folder_id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    user_id VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	UNIQUE(user_id, name)
);

CREATE TABLE files (
    file_id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    folder_id INT NOT NULL REFERENCES folders(folder_id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	content VARCHAR(10485760) NOT NULL,
	UNIQUE(folder_id, name)
);

CREATE TABLE embeddings (
    embedding_id SERIAL PRIMARY KEY NOT NULL,
    content VARCHAR(255) NOT NULL,
    embedding VECTOR(1536),
    file_id INT NOT NULL REFERENCES files(file_id)
);

-- Agents module
CREATE TABLE models (
    model_id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE agent_settings (
    agent_setting_id SERIAL PRIMARY KEY NOT NULL,
    system_prompt VARCHAR(255) NOT NULL,
    temperature DOUBLE PRECISION NOT NULL
);

CREATE TABLE agents (
    agent_id SERIAL PRIMARY KEY NOT NULL,
    user_id VARCHAR(32) NOT NULL,
    model_id INT NOT NULL REFERENCES models(model_id),
    agent_setting_id INT NOT NULL REFERENCES agent_settings(agent_setting_id),
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
	UNIQUE(user_id, name)
);

-- Chat module
CREATE TABLE chats (
    chat_id SERIAL PRIMARY KEY NOT NULL,
    user_id VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    agent_id INT NOT NULL REFERENCES agents(agent_id),
	UNIQUE(user_id, name)
);

CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY NOT NULL,
    chat_id INT NOT NULL REFERENCES chats(chat_id),
    inbound BOOLEAN NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content VARCHAR(1024) NOT NULL
);

CREATE TABLE msg_sources (
    message_id INT NOT NULL,
    embedding_id INT NOT NULL,
    similarity DOUBLE PRECISION NOT NULL,
    PRIMARY KEY (message_id, embedding_id),
    FOREIGN KEY (message_id) REFERENCES messages(message_id),
    FOREIGN KEY (embedding_id) REFERENCES embeddings(embedding_id)
);
