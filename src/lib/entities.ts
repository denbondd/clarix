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
