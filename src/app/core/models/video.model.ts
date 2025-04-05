export interface Video {
  id: string;
  title: string;
  description: string;
  filePath: string;
  thumbnailPath?: string;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}
