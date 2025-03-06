
/**
 * Application Configuration
 * 
 * This file centralizes all application configuration values.
 * Note: This file only contains publishable/public keys.
 * For private keys, use environment variables or Supabase secrets.
 */

// Supabase configuration
export const supabaseConfig = {
  url: "https://evjofjyjfzewjtzlkruw.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2am9manlqZnpld2p0emxrcnV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODg1OTUsImV4cCI6MjA1NTk2NDU5NX0.WtVqx-u-33GngzB5OT0qcbDFB4l7LigeMATjGyXj07Q"
};

// API endpoints
export const apiEndpoints = {
  images: '/api/images',
  categories: '/api/categories'
};

// Application settings
export const appSettings = {
  imageSizes: {
    thumbnail: 100,
    medium: 800,
    large: 1600
  },
  defaultCategory: 'all',
  categories: ['people', 'animals', 'landscapes'],
  staleTime: 5 * 60 * 1000, // 5 minutes in milliseconds
  cacheTime: 30 * 60 * 1000 // 30 minutes in milliseconds
};

// Feature flags
export const featureFlags = {
  enableImagePreview: true,
  enableImageDownload: false, // Disabled as per recent changes
  enableCategoryFiltering: true
};
