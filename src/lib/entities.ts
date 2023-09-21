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
