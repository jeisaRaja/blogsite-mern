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

export interface User {
  _id: string,
  personal_info: personal_info
}

export interface BlogDocument {
  _id: string,
  blog_id: string;
  title: string;
  banner?: string | null;
  des?: string | null;
  content?: string | null;
  tags?: string[];
  author: User;
  activity?: Activity;
  comments?: Array<Comment>;
  draft: boolean;
  publishedAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  blog_id: string;
  blog_author: string;
  comment: string;
  children: Comment[];
  commented_by: {
    personal_info: {
      username: string;
      profile_img: string;
    };
    _id: string;
  };
  isReply: boolean;
  parent?: string;
  commentedAt: Date;
  updatedAt: Date;
  __v: number;
}
