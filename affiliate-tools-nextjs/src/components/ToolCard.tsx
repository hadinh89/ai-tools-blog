'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Tool } from '@/lib/supabaseClient'

interface ToolCardProps {
  tool: Tool
}

export default function ToolCard({ tool }: ToolCardProps) {
  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'Free':
        return 'bg-green-100 text-green-800'
      case 'Freemium':
        return 'bg-blue-100 text-blue-800'
      case 'Paid':
        return 'bg-purple-100 text-purple-800'
      case 'Lifetime':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={tool.image_url || '/placeholder-tool.jpg'}
          alt={tool.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
            {tool.title}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ml-2 flex-shrink-0 ${getPricingColor(tool.pricing)}`}>
            {tool.pricing}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {tool.highlights}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.categories.slice(0, 3).map((category) => (
            <span
              key={category}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {category}
            </span>
          ))}
          {tool.categories.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{tool.categories.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Link
            href={`/tools/${tool.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            Learn More
          </Link>
          <a
            href={tool.affiliate_link}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
          >
            Visit Tool
          </a>
        </div>
      </div>
    </div>
  )
}