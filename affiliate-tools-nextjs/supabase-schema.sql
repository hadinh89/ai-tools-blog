-- Create the tools table
CREATE TABLE tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  affiliate_link TEXT NOT NULL,
  categories TEXT[] NOT NULL DEFAULT '{}',
  highlights TEXT NOT NULL,
  features TEXT NOT NULL,
  pricing TEXT NOT NULL CHECK (pricing IN ('Free', 'Freemium', 'Paid', 'Lifetime')),
  note TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on categories for better performance
CREATE INDEX idx_tools_categories ON tools USING GIN (categories);

-- Create an index on pricing for filtering
CREATE INDEX idx_tools_pricing ON tools (pricing);

-- Create an index on title for search
CREATE INDEX idx_tools_title ON tools USING GIN (to_tsvector('english', title));

-- Enable Row Level Security
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON tools
  FOR SELECT USING (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO tools (title, affiliate_link, categories, highlights, features, pricing, note, image_url) VALUES
(
  'ChatGPT',
  'https://chat.openai.com/?ref=affiliate',
  ARRAY['AI Chat', 'Writing', 'Productivity'],
  'Advanced AI chatbot for conversations, writing, and problem-solving',
  'Natural language processing, Code generation, Creative writing, Translation, Math problem solving',
  'Freemium',
  'Most popular AI chatbot with GPT-4 capabilities',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop'
),
(
  'Midjourney',
  'https://www.midjourney.com/?ref=affiliate',
  ARRAY['AI Art', 'Image Generation', 'Creative'],
  'Create stunning artwork and images with AI',
  'Text-to-image generation, High-quality outputs, Multiple art styles, Discord integration',
  'Paid',
  'Premium AI art generation with exceptional quality',
  'https://images.unsplash.com/photo-1686191128892-3e87d4d6e8c1?w=400&h=300&fit=crop'
),
(
  'Notion AI',
  'https://www.notion.so/?ref=affiliate',
  ARRAY['Productivity', 'Writing', 'Organization'],
  'AI-powered workspace for notes, docs, and collaboration',
  'AI writing assistance, Database management, Task organization, Team collaboration, Templates',
  'Freemium',
  'All-in-one workspace with AI capabilities',
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop'
),
(
  'Canva',
  'https://www.canva.com/?ref=affiliate',
  ARRAY['Design', 'Graphics', 'Creative'],
  'Easy-to-use design platform with AI features',
  'AI design tools, Templates, Photo editing, Video creation, Brand kit',
  'Freemium',
  'Popular design platform with AI-powered features',
  'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop'
),
(
  'Grammarly',
  'https://www.grammarly.com/?ref=affiliate',
  ARRAY['Writing', 'Grammar', 'Productivity'],
  'AI-powered writing assistant for better communication',
  'Grammar checking, Style suggestions, Plagiarism detection, Tone analysis, Writing insights',
  'Freemium',
  'Essential tool for improving writing quality',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop'
),
(
  'Copy.ai',
  'https://www.copy.ai/?ref=affiliate',
  ARRAY['Marketing', 'Copywriting', 'AI Writing'],
  'AI copywriting tool for marketing and sales',
  'Marketing copy generation, Social media content, Email campaigns, Product descriptions, Blog posts',
  'Freemium',
  'Specialized AI tool for marketing copy',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
),
(
  'Jasper',
  'https://www.jasper.ai/?ref=affiliate',
  ARRAY['AI Writing', 'Content Creation', 'Marketing'],
  'AI content creation platform for businesses',
  'Long-form content, Marketing copy, Blog posts, Social media, SEO optimization',
  'Paid',
  'Comprehensive AI writing platform for businesses',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'
),
(
  'Stable Diffusion',
  'https://stability.ai/?ref=affiliate',
  ARRAY['AI Art', 'Image Generation', 'Open Source'],
  'Open-source AI image generation model',
  'Text-to-image generation, Image editing, Custom models, API access, Local deployment',
  'Free',
  'Open-source alternative to commercial AI art tools',
  'https://images.unsplash.com/photo-1673187733777-4d8c2c5c8c8c?w=400&h=300&fit=crop'
);