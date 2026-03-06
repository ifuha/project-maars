export type User = {
  userId: number;
  name: string;
  email: string;
  icon: string;
  header: string;
  bio?: string;
  posts: Post[];
  trees: Tree[];
  comments: Comment[];
};

export type Post = {
  postId: number;
  userId: number;
  content: string;
  title: string;
  thumbnail: string;
  isPrivate: boolean;
  user: User;
  comments: Comment[];
  postTags: PostTag[];
};

export type Comment = {
  commentId: number;
  content: string;
  postId: number;
  userId: number;
  user?: User;
};

export type Tree = {
  treeId: number;
  postId: number;
  userId: number;
};

export type Topic = {
  topicId: number;
  treeId: number;
  postId: number;
  order: number;
};

export type Tag = {
  tagId: number;
  name: string;
};

export type PostTag = {
  postId: number;
  tagId: number;
  tag: Tag;
  post: Post;
};

export type MarsWeather = {
  id: number;
  sol: string;
  tempMax: number;
  tempMin: number;
  tempAvg: number;
  pressure: number;
  windSpeed: number;
  fetchedAt: string;
};
