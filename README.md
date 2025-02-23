
# Photography Portfolio App

A responsive photography portfolio application built with React, TypeScript, and Framer Motion.

## Features

- Responsive masonry grid layout
- Smooth animations and transitions
- Category-based filtering
- Hover effects and image details
- Optimized image loading

## Planned Features

- 🔍 Image Search: Search images by title, category, or description
- 🖼️ Lightbox View: Full-screen image viewing with zoom capabilities
- 💾 Download Options: Allow users to download images in different resolutions
- 🔄 Social Sharing: Share images on social media platforms
- 👤 User Authentication: Personal accounts for saving favorite images
- 📱 Mobile App: Progressive Web App (PWA) support
- 🏷️ Image Tagging: Add and filter by custom tags
- 💬 Comments: Allow users to comment on images
- 📊 Analytics: Track image views and interactions
- 🎨 Theme Customization: Light/dark mode and custom color schemes

## Tech Stack

- React 18
- TypeScript
- Framer Motion
- Tailwind CSS
- Vite
- React Router DOM
- Shadcn UI

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

## Performance Optimizations

- Lazy loading of images
- Image compression and optimization
- Code splitting
- Route-based chunking
- Caching strategies
- Service Worker implementation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari
- Chrome for Android

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Deployment

The application can be built for production using:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready for deployment to your chosen hosting platform.

## Troubleshooting

Common issues and their solutions:

1. **Images not loading**: Check your image paths and ensure proper permissions
2. **Build failures**: Verify all dependencies are installed and Node.js version is compatible
3. **Layout issues**: Check Tailwind CSS classes and responsive design implementations

## License

MIT License

Copyright (c) 2024 [Your Name]

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
