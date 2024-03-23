export interface Activity {
  total_likes: number;
  total_comments: number;
  total_reads: number;
  total_parent_comments: number;
}

interface personal_info {
  fullname?: string,
  profile_img: string,
  email?: string,
  username: string,
}

export interface Author {
  _id: string,
  personal_info: personal_info
}

export interface BlogDocument extends Document {
  blog_id: string;
  title: string;
  banner?: string | null;
  des?: string | null;
  content?: string | null;
  tags?: string[];
  author: Author;
  activity?: Activity;
  comments?: string;
  draft: boolean;
  publishedAt: Date;
  updatedAt: Date;
}