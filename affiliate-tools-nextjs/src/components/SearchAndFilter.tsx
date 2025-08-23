'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { PRICING_OPTIONS } from '@/lib/data'

interface SearchAndFilterProps {
  categories: string[]
}

export default function SearchAndFilter({ categories }: SearchAndFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || '')
  const [selectedPricing, setSelectedPricing] = useState(searchParams.get('pricing') || '')

  const updateURL = (q: string, cat: string, pricing: string) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (cat) params.set('cat', cat)
    if (pricing) params.set('pricing', pricing)
    
    const newURL = params.toString() ? `?${params.toString()}` : '/'
    router.push(newURL)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    updateURL(value, selectedCategory, selectedPricing)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    updateURL(searchQuery, value, selectedPricing)
  }

  const handlePricingChange = (value: string) => {
    setSelectedPricing(value)
    updateURL(searchQuery, selectedCategory, value)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedPricing('')
    router.push('/')
  }

  const hasActiveFilters = searchQuery || selectedCategory || selectedPricing

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Tools
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by tool name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Pricing Filter */}
        <div>
          <label htmlFor="pricing" className="block text-sm font-medium text-gray-700 mb-2">
            Pricing
          </label>
          <select
            id="pricing"
            value={selectedPricing}
            onChange={(e) => handlePricingChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Pricing</option>
            {PRICING_OPTIONS.map((pricing) => (
              <option key={pricing} value={pricing}>
                {pricing}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}