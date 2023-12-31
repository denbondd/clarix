export interface FileEntity {
  file_id: number,
  name: string,
  folder_id: number,
  created_at: string,
  edited_at: string,
  _count: {
    embeddings: number;
  };
}

export interface FolderEntity {
  folder_id: number;
  name: string;
  user_id: string;
  created_at: string;
  files: FileEntity[];
}

export interface ModelEntity {
  model_id: number;
  name: string;
}

export interface AgentEntity {
  models: ModelEntity;
  name: string;
  description?: string;
  temperature: number;
  created_on: string;
  system_prompt: string;
  agent_id: number;
  user_id: string;
  agent_has_folders: {
    agent_id: number;
    folder_id: number;
  }[];
}

export interface ChatEntity {
  chat_id: number;
  user_id: string;
  name: string;
  agents: {
    name: string;
    agent_id: number;
  };
}

export interface MessageSource {
  embedding_id: number,
  similarity: number,
  content: string;
  file: {
    id: number;
    name: string,
  },
  folder: {
    id: number;
    name: string,
  },
}

export interface MessageEntity {
  message_id: number,
  created_at: Date,
  content: string,
  role: 'user' | 'assistant' | 'system',
  msg_sources: MessageSource[]
}