import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getToolById } from '@/lib/data'

interface ToolDetailPageProps {
  params: {
    id: string
  }
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const tool = await getToolById(params.id)

  if (!tool) {
    notFound()
  }

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Back to Tools
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={tool.image_url || '/placeholder-tool.jpg'}
              alt={tool.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{tool.title}</h1>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPricingColor(tool.pricing)}`}>
                    {tool.pricing}
                  </span>
                </div>
                <p className="text-lg text-gray-200">{tool.highlights}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.categories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-line">{tool.features}</p>
                  </div>
                </div>

                {/* Note */}
                {tool.note && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Take</h3>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                      <p className="text-gray-700">{tool.note}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Started</h3>
                  
                  <div className="space-y-4">
                    <a
                      href={tool.affiliate_link}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="w-full bg-green-600 text-white text-center py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium block"
                    >
                      Visit {tool.title}
                    </a>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        We may earn a commission when you purchase through our affiliate link.
                      </p>
                    </div>
                  </div>

                  {/* Pricing Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Pricing</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPricingColor(tool.pricing)}`}>
                        {tool.pricing}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}