import { Tool } from './supabaseClient'

export const mockTools: Tool[] = [
  {
    id: '1',
    title: 'ChatGPT',
    affiliate_link: 'https://chat.openai.com/?ref=affiliate',
    categories: ['AI Chat', 'Writing', 'Productivity'],
    highlights: 'Advanced AI chatbot for conversations, writing, and problem-solving',
    features: 'Natural language processing, Code generation, Creative writing, Translation, Math problem solving',
    pricing: 'Freemium',
    note: 'Most popular AI chatbot with GPT-4 capabilities',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Midjourney',
    affiliate_link: 'https://www.midjourney.com/?ref=affiliate',
    categories: ['AI Art', 'Image Generation', 'Creative'],
    highlights: 'Create stunning artwork and images with AI',
    features: 'Text-to-image generation, High-quality outputs, Multiple art styles, Discord integration',
    pricing: 'Paid',
    note: 'Premium AI art generation with exceptional quality',
    image_url: 'https://images.unsplash.com/photo-1686191128892-3e87d4d6e8c1?w=400&h=300&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'Notion AI',
    affiliate_link: 'https://www.notion.so/?ref=affiliate',
    categories: ['Productivity', 'Writing', 'Organization'],
    highlights: 'AI-powered workspace for notes, docs, and collaboration',
    features: 'AI writing assistance, Database management, Task organization, Team collaboration, Templates',
    pricing: 'Freemium',
    note: 'All-in-one workspace with AI capabilities',
    image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    title: 'Canva',
    affiliate_link: 'https://www.canva.com/?ref=affiliate',
    categories: ['Design', 'Graphics', 'Creative'],
    highlights: 'Easy-to-use design platform with AI features',
    features: 'AI design tools, Templates, Photo editing, Video creation, Brand kit',
    pricing: 'Freemium',
    note: 'Popular design platform with AI-powered features',
    image_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    title: 'Grammarly',
    affiliate_link: 'https://www.grammarly.com/?ref=affiliate',
    categories: ['Writing', 'Grammar', 'Productivity'],
    highlights: 'AI-powered writing assistant for better communication',
    features: 'Grammar checking, Style suggestions, Plagiarism detection, Tone analysis, Writing insights',
    pricing: 'Freemium',
    note: 'Essential tool for improving writing quality',
    image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    title: 'Copy.ai',
    affiliate_link: 'https://www.copy.ai/?ref=affiliate',
    categories: ['Marketing', 'Copywriting', 'AI Writing'],
    highlights: 'AI copywriting tool for marketing and sales',
    features: 'Marketing copy generation, Social media content, Email campaigns, Product descriptions, Blog posts',
    pricing: 'Freemium',
    note: 'Specialized AI tool for marketing copy',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    title: 'Jasper',
    affiliate_link: 'https://www.jasper.ai/?ref=affiliate',
    categories: ['AI Writing', 'Content Creation', 'Marketing'],
    highlights: 'AI content creation platform for businesses',
    features: 'Long-form content, Marketing copy, Blog posts, Social media, SEO optimization',
    pricing: 'Paid',
    note: 'Comprehensive AI writing platform for businesses',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    title: 'Stable Diffusion',
    affiliate_link: 'https://stability.ai/?ref=affiliate',
    categories: ['AI Art', 'Image Generation', 'Open Source'],
    highlights: 'Open-source AI image generation model',
    features: 'Text-to-image generation, Image editing, Custom models, API access, Local deployment',
    pricing: 'Free',
    note: 'Open-source alternative to commercial AI art tools',
    image_url: 'https://images.unsplash.com/photo-1673187733777-4d8c2c5c8c8c?w=400&h=300&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

export const mockCategories = [
  'AI Art',
  'AI Chat',
  'AI Writing',
  'Content Creation',
  'Copywriting',
  'Creative',
  'Design',
  'Grammar',
  'Graphics',
  'Image Generation',
  'Marketing',
  'Open Source',
  'Organization',
  'Productivity',
  'Writing'
]