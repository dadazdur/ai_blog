export type PostStatus = "draft" | "published";

export type ResourceType = "prompt" | "template" | "guida" | "video";

export const resourceTypeLabels: Record<ResourceType, string> = {
  prompt: "Prompt",
  template: "Template",
  guida: "Guida",
  video: "Video",
};

export type Author = {
  id: string;
  slug: string;
  name: string;
  role_title: string | null;
  bio: string | null;
  credentials: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  email: string | null;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  position?: number;
};

export type FaqItem = { question: string; answer: string };

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_md: string;
  cover_url: string | null;
  cover_alt: string | null;
  status: PostStatus;
  published_at: string | null;
  updated_at: string | null;
  created_at: string;
  seo_title: string | null;
  seo_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  noindex: boolean;
  faq: FaqItem[] | null;
  reading_minutes: number | null;
  views: number;
  category_id: string | null;
  author_id: string | null;
  category?: Category | null;
  author?: Author | null;
};

export type Resource = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: ResourceType;
  prompt_text: string | null;
  external_url: string | null;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  published: boolean;
  downloads: number;
  position?: number;
  created_at: string;
};

export type SubscriberStatus = "pending" | "confirmed" | "unsubscribed";

export type Subscriber = {
  id: string;
  email: string;
  status: SubscriberStatus;
  source: string | null;
  token: string;
  created_at: string;
  confirmed_at: string | null;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  studio: string | null;
  role: "user" | "admin";
  created_at: string;
};
