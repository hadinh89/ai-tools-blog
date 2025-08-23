import { Suspense } from 'react'
import { getAllCategories, searchTools } from '@/lib/data'
import ToolCard from '@/components/ToolCard'
import SearchAndFilter from '@/components/SearchAndFilter'
import Loading from '@/components/Loading'

interface HomePageProps {
  searchParams: {
    q?: string
    cat?: string
    pricing?: string
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q, cat, pricing } = searchParams
  
  // Fetch data based on search params
  const tools = await searchTools(q, cat, pricing as 'Free' | 'Freemium' | 'Paid' | 'Lifetime' | undefined)
  const categories = await getAllCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Affiliate Tools</h1>
              <p className="text-gray-600 mt-1">Discover the best AI tools for your needs</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <Suspense fallback={<Loading />}>
          <SearchAndFilter categories={categories} />
        </Suspense>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {tools.length} tool{tools.length !== 1 ? 's' : ''} found
            {(q || cat || pricing) && (
              <span className="text-gray-400">
                {' '}matching your criteria
              </span>
            )}
          </p>
        </div>

        {/* Tools Grid */}
        {tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or browse all tools.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
