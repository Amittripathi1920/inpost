import { supabase } from "@/lib/supabaseClient";

// Fetch dropdown options based on category
export async function getOptions(category: string, userId?: string): Promise<any[]> {
  const { data, error } = await supabase.functions.invoke('get-options', {
    body: { category, userId }
  });
  
  if (error) throw new Error(error.message);
  return data;
}

// Utility function to fetch ID from value
export async function getIdByValue(
  table: string,
  idColumn: string,
  matchColumn: string,
  value: string
) {
  const { data, error } = await supabase.functions.invoke('get-id-by-value', {
    body: { table, idColumn, matchColumn, value }
  });
  
  if (error) throw new Error(error.message);
  return data.id;
}

// Save post using normalized structure
export async function saveGeneratedPost({
  topic_id,
  influencer_id,
  length_id,
  language_id,
  tone_id,
  exp_level_id,
  generated_post,
}: {
  topic_id: number;
  influencer_id: number;
  length_id: number;
  language_id: number;
  tone_id: number;
  exp_level_id: number;
  generated_post: string;
}) {
  const { data, error } = await supabase.functions.invoke('save-generated-post', {
    body: {
      topic_id,
      influencer_id,
      length_id,
      language_id,
      tone_id,
      exp_level_id,
      generated_post,
    }
  });
  
  if (error) throw new Error(error.message);
  return data;
}

// Fetch posts with metadata for dashboard
export async function getUserGeneratedPosts(): Promise<any[]> {
  const { data, error } = await supabase.functions.invoke('get-user-generated-posts', {
    body: {}
  });
  
  if (error) throw new Error(error.message);
  return data;
}

// Add a new function to support the date range filtering functionality
export async function getFilteredPostsByDateRange(dateRange: { from: Date, to: Date }): Promise<any[]> {
  const { data, error } = await supabase.functions.invoke('get-filtered-posts', {
    body: {
      from_date: dateRange.from.toISOString(),
      to_date: dateRange.to.toISOString()
    }
  });
  
  if (error) throw new Error(error.message);
  return data;
}

// NEW FUNCTIONS FOR PostGenerator.tsx

// Get user profile data
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase.functions.invoke('get-user-profile', {
    body: { userId }
  });
  
  if (error) throw new Error(error.message);
  return data;
}

// Get IDs for post generation
export async function getIdsForPostGeneration(options: {
  topicName: string;
  languageName: string;
  toneName: string;
  postLengthType: string;
  expLevelName: string;
}) {
  const { data, error } = await supabase.functions.invoke('get-ids-for-post-generation', {
    body: options
  });
  
  if (error) throw new Error(error.message);
  return data;
}

// Update user's first time status
export async function updateUserFirstTimeStatus(userId: string, isFirstTime: boolean) {
  const { data, error } = await supabase.functions.invoke('update-user-first-time-status', {
    body: { 
      userId,
      isFirstTime
    }
  });
  
  if (error) throw new Error(error.message);
  return data;
}