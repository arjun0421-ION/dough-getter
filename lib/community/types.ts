export type PostType = "question" | "share" | "discussion";
export type PostTopic = "sourdough" | "pricing" | "decorating" | "business" | "general";
export type PostSort = "latest" | "top";

export interface PostAuthor {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  plan: string;
}

export interface Post {
  id: string;
  user_id: string;
  type: PostType;
  title: string;
  body: string;
  image_url: string | null;
  topic: PostTopic;
  upvotes: number;
  created_at: string;
  author: PostAuthor;
  comment_count: number;
  has_upvoted: boolean;
  has_saved: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  upvotes: number;
  is_answer: boolean;
  created_at: string;
  author: PostAuthor;
  has_upvoted: boolean;
}

export interface PostFilter {
  topic?: PostTopic | "all" | "saved";
  sort?: PostSort;
}
