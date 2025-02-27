
# Photography Portfolio App

A responsive photography portfolio application built with React, TypeScript, and Framer Motion.

## Features

- Responsive masonry grid layout with progressive image loading
- Smooth animations and transitions using Framer Motion
- Category-based filtering (People, Animals, Landscapes)
- Interactive hover effects with image details
- Mobile-optimized image preview with responsive controls
- Optimized image loading with blur placeholders
- Real-time data fetching with React Query
- Supabase integration for image storage and management

## Tech Stack

- React 18
- TypeScript
- Framer Motion
- Tailwind CSS
- Vite
- React Router DOM
- Shadcn UI
- Tanstack Query
- Supabase

## Getting Started

### Prerequisites

- Node.js (v14 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm (comes with Node.js) or yarn
- Supabase account and project

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd <project-directory>
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure Supabase
- Create a `.env` file in the root directory
- Add your Supabase configuration:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Adding New Images

### Image Storage with Supabase

1. **Access Supabase Storage**:
   - Navigate to your Supabase project dashboard
   - Go to the Storage section
   - Upload images to the 'images' bucket

2. **Image Requirements**:
   - Supported formats: JPG, PNG, WEBP
   - Recommended max size: 5MB per image
   - Optimal dimensions: 1200-2400px width
   - Include proper metadata (title, category)

### Adding Image Records

Add image information to your Supabase database with:
- id (auto-generated)
- url (from Supabase storage)
- title (display name)
- category ('people', 'animals', or 'landscapes')
- width (original image width)
- height (original image height)
- created_at (timestamp)

## Image Optimization Features

- Progressive image loading
- Blur placeholders while loading
- Responsive image sizing
- Lazy loading for better performance
- Prefetching of adjacent categories
- Optimized image caching with React Query

## Mobile Experience

- Fully responsive design for all screen sizes
- Touch-friendly interface with appropriate tap targets
- Optimized image previews for mobile devices
- Adaptive UI elements that respond to screen size
- Smooth animations optimized for mobile performance

## Troubleshooting

Common issues and their solutions:

1. **Images not loading**: 
   - Verify Supabase storage bucket permissions
   - Check image URL format in database
   - Ensure proper CORS configuration
   - Verify image exists in storage bucket

2. **Build failures**: 
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Ensure environment variables are set correctly

3. **Layout issues**: 
   - Check Tailwind CSS classes
   - Verify responsive breakpoints
   - Test on different screen sizes

## License

MIT License

Copyright (c) 2025 Yajnesh AT

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
