
export interface User {
  id: string;
  username: string;
  avatar: string;
  isFollowing: boolean;
}

export interface VideoContent {
  id: string;
  url: string;
  user: User;
  description: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  musicName: string;
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  likes: number;
  time: string;
}
