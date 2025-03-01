
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { uploadImage } from '@/services/storageService';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { ImageCategory } from '@/types';

export const ImageUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<ImageCategory | ''>('');
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the current category from the route if available
  const currentCategory = location.pathname.substring(1) as ImageCategory | '';

  // Set the current category as default if available
  React.useEffect(() => {
    if (currentCategory && ['people', 'animals', 'landscapes'].includes(currentCategory)) {
      setCategory(currentCategory as ImageCategory);
    }
  }, [currentCategory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      
      // Clean up preview URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive"
      });
      return;
    }

    if (!category) {
      toast({
        title: "No category selected",
        description: "Please select a category for the image",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadImage(file, category);
      
      if (result) {
        toast({
          title: "Upload successful",
          description: "Your image has been uploaded and will now appear in the gallery",
        });
        
        // Reset form
        setFile(null);
        setPreview(null);
        
        // Refresh the current page or navigate to the newly uploaded image's category
        // Fix the type error by checking if the string is empty rather than comparing directly
        navigate(category.length === 0 ? '/' : `/${category}`, { replace: true });
        window.location.reload(); // Quick way to refresh data
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload New Image</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="image-upload">Select Image</Label>
          <Input 
            id="image-upload" 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="mt-1"
            disabled={isUploading}
          />
        </div>
        
        {preview && (
          <div className="my-4 relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-auto rounded-md object-contain max-h-[300px]" 
            />
          </div>
        )}
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Select 
            value={category} 
            onValueChange={(value) => setCategory(value as ImageCategory)}
            disabled={isUploading}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="people">People</SelectItem>
              <SelectItem value="animals">Animals</SelectItem>
              <SelectItem value="landscapes">Landscapes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleUpload} 
          className="w-full mt-4" 
          disabled={!file || !category || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
