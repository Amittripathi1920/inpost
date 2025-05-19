export interface Post {
  id: string;
  generated_post: string;
  created_at: string;
  topic?: {
    topic_name: string;
  };
  hashtags?: string;
  tone?: {
    tone_name: string;
  };
  language?: {
    language_name: string;
  };
  length?: {
    length_type: string;
  };
  exp_level?: {
    exp_name: string;
  };
}

export interface TopicCount {
  name: string;
  count: number;
}

export interface LengthData {
  name: string;
  count: number;
}

export interface PostsByMonth {
  name: string;
  count: number;
}

export interface HashtagData {
  tag: string;
  count: number;
}

export interface ColorOption {
  name: string;
  color: string;
}

export interface DashboardFilters {
  topic: string;
  length: string;
  tone: string;
  language: string;
}