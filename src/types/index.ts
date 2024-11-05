export interface Project {
  id: string;
  title: string;
  description: string;
  author: string;
  genre: string;
  imageUrl: string;
  tags: string[];
  votes: string[];
  createdAt: number;
  isLicensed: boolean;
  seriesUrl?: string;
}