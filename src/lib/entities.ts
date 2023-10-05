export interface FileEntity {
  file_id: number,
  name: string,
  folder_id: number,
  created_at: string,
  edited_at: string,
  content: string,
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
  created_on: Date;
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

export interface MessageEntity {
  message_id: number,
  created_at: Date,
  content: string,
  msg_roles: {
    msg_role_id: number,
    name: string,
  },
  msg_sources: {
    embedding_id: number,
    similarity: number,
    content: string;
    file_name: string,
    folder_name: string
  }[]
}

export interface FullChatEntity extends ChatEntity {
  messages: MessageEntity[];
}