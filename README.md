
# Photography Portfolio App

A responsive photography portfolio application built with React, TypeScript, and Framer Motion.

## Features

- Responsive masonry grid layout
- Smooth animations and transitions
- Category-based filtering
- Hover effects and image details
- Optimized image loading

## Getting Started

### Prerequisites

- Node.js (v14 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm (comes with Node.js) or yarn

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

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Adding New Images

### Image Storage Options

1. **Cloud Storage (Recommended)**:
   - Use services like AWS S3, Google Cloud Storage, or Cloudinary
   - Benefits:
     - Better performance
     - Automatic image optimization
     - CDN delivery
     - Multiple image sizes/formats

2. **Project Assets**:
   - Store images in `public/images/`
   - Use relative paths in the images array

### Adding New Images

1. Upload your image to your chosen storage solution
2. Add the image information to the `images` array in `src/pages/Index.tsx`:

```typescript
{
  id: 'unique-id',
  url: 'your-image-url',
  width: original-width,
  height: original-height,
  title: 'Image Title',
  category: 'people' | 'animals' | 'landscapes'
}
```

The MasonryGrid component automatically handles different image aspect ratios and sizes.

## Image Optimization Tips

- Use compressed images (JPEG for photos, PNG for graphics)
- Implement responsive images using srcset
- Consider using a CDN
- Use appropriate image dimensions (avoid oversized images)
- Enable lazy loading for better performance

## Development Guidelines

- Follow the existing TypeScript types and interfaces
- Maintain the component structure
- Use Tailwind CSS for styling
- Implement responsive design patterns
- Test across different devices and screen sizes

## Deployment

The application can be built for production using:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready for deployment to your chosen hosting platform.
