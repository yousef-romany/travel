'use client';

import { useState, useEffect } from 'react';
import {
  fetchFeaturedPlaceToGoBlogs,
  fetchNearbyPlaceToGoBlogs,
  searchPlaceToGoBlogs,
  fetchPlaceToGoBlogStatistics,
  fetchPlaceToGoBlogsByPrice,
  fetchPlaceToGoBlogsWithInstagram
} from '@/fetch/placesToGo';

interface Blog {
  id: string;
  documentId: string;
  title: string;
  details: string;
  price: number;
  lat?: string;
  lng?: string;
  distance?: number;
  image?: any;
  place_to_go_categories?: any[];
  place_to_go_subcategories?: any[];
}

interface Statistics {
  total: number;
  published: number;
  withLocation: number;
  withImage: number;
  withInstagram: number;
}

export default function ServiceFeaturesDemo() {
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [nearbyBlogs, setNearbyBlogs] = useState<Blog[]>([]);
  const [searchResults, setSearchResults] = useState<Blog[]>([]);
  const [priceRangeBlogs, setPriceRangeBlogs] = useState<Blog[]>([]);
  const [instagramBlogs, setInstagramBlogs] = useState<Blog[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Load featured blogs on mount
  useEffect(() => {
    loadFeaturedBlogs();
    loadStatistics();
    loadInstagramBlogs();
  }, []);

  // Load user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to Cairo coordinates
          setUserLocation({ lat: 30.0444, lng: 31.2357 });
        }
      );
    } else {
      // Default to Cairo coordinates
      setUserLocation({ lat: 30.0444, lng: 31.2357 });
    }
  }, []);

  const loadFeaturedBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetchFeaturedPlaceToGoBlogs(6);
      setFeaturedBlogs(response.data || []);
    } catch (error) {
      console.error('Error loading featured blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await fetchPlaceToGoBlogStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const loadInstagramBlogs = async () => {
    try {
      const response = await fetchPlaceToGoBlogsWithInstagram();
      setInstagramBlogs(response.data || []);
    } catch (error) {
      console.error('Error loading Instagram blogs:', error);
    }
  };

  const loadNearbyBlogs = async () => {
    if (!userLocation) return;

    try {
      setLoading(true);
      const response = await fetchNearbyPlaceToGoBlogs(
        userLocation.lat,
        userLocation.lng,
        100 // 100km radius
      );
      setNearbyBlogs(response.data || []);
    } catch (error) {
      console.error('Error loading nearby blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await searchPlaceToGoBlogs(searchQuery);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error searching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadByPriceRange = async () => {
    try {
      setLoading(true);
      const response = await fetchPlaceToGoBlogsByPrice(100, 1000);
      setPriceRangeBlogs(response.data || []);
    } catch (error) {
      console.error('Error loading blogs by price:', error);
    } finally {
      setLoading(false);
    }
  };

  const BlogCard = ({ blog }: { blog: Blog }) => (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {blog.image?.url && (
        <img
          src={blog.image.url}
          alt={blog.title}
          className="w-full h-48 object-cover rounded-md mb-3"
        />
      )}
      <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
      {blog.distance && (
        <p className="text-sm text-gray-600 mb-2">
          📍 {blog.distance.toFixed(2)} km away
        </p>
      )}
      {blog.price && (
        <p className="text-sm font-semibold text-green-600 mb-2">
          ${blog.price}
        </p>
      )}
      <p className="text-sm text-gray-700 line-clamp-2">
        {blog.details?.substring(0, 150)}...
      </p>
    </div>
  );

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold mb-6">Place-to-Go Blog Services Demo</h1>

      {/* Statistics Section */}
      {statistics && (
        <section className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">📊 Blog Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-3xl font-bold text-blue-600">{statistics.total}</p>
              <p className="text-sm text-gray-600">Total Blogs</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-3xl font-bold text-green-600">{statistics.published}</p>
              <p className="text-sm text-gray-600">Published</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-3xl font-bold text-purple-600">{statistics.withLocation}</p>
              <p className="text-sm text-gray-600">With Location</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-3xl font-bold text-orange-600">{statistics.withImage}</p>
              <p className="text-sm text-gray-600">With Image</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-3xl font-bold text-pink-600">{statistics.withInstagram}</p>
              <p className="text-sm text-gray-600">With Instagram</p>
            </div>
          </div>
        </section>
      )}

      {/* Featured Blogs Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">⭐ Featured Blogs</h2>
        {loading && <p>Loading...</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredBlogs.map((blog) => (
            <BlogCard key={blog.documentId} blog={blog} />
          ))}
        </div>
      </section>

      {/* Nearby Blogs Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📍 Nearby Blogs</h2>
        <div className="mb-4">
          <button
            onClick={loadNearbyBlogs}
            disabled={!userLocation}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Find Nearby Blogs
          </button>
          {userLocation && (
            <p className="text-sm text-gray-600 mt-2">
              Using location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
          )}
        </div>
        {loading && <p>Loading...</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyBlogs.map((blog) => (
            <BlogCard key={blog.documentId} blog={blog} />
          ))}
        </div>
      </section>

      {/* Search Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">🔍 Search Blogs</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for destinations..."
            className="flex-1 px-4 py-2 border rounded-lg"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Search
          </button>
        </div>
        {loading && <p>Searching...</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((blog) => (
            <BlogCard key={blog.documentId} blog={blog} />
          ))}
        </div>
      </section>

      {/* Price Range Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">💰 Blogs by Price Range ($100 - $1000)</h2>
        <button
          onClick={loadByPriceRange}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          Load by Price Range
        </button>
        {loading && <p>Loading...</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {priceRangeBlogs.map((blog) => (
            <BlogCard key={blog.documentId} blog={blog} />
          ))}
        </div>
      </section>

      {/* Instagram Blogs Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📸 Blogs with Instagram Posts</h2>
        {loading && <p>Loading...</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instagramBlogs.map((blog) => (
            <BlogCard key={blog.documentId} blog={blog} />
          ))}
        </div>
      </section>
    </div>
  );
}
