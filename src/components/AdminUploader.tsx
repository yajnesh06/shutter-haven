
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageCategory } from '@/types';
import { uploadImage } from '@/services/storageService';
import { toast } from '@/components/ui/use-toast';
import { Loader2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const AdminUploader = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ImageCategory>('people');
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
      setErrorMessage(null);
    }
  };

  const resetForm = () => {
    setTitle('');
    setFiles(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    const newProgress: {[key: string]: number} = {};
    
    try {
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
        
        // Initialize progress for this file
        newProgress[fileName] = 0;
        setUploadProgress({...newProgress});
        
        // Use the file name as title if no title is provided
        const imageTitle = title || fileName.split('.')[0];
        
        // Upload the image with progress callback
        await uploadImage(file, {
          title: imageTitle,
          category,
          onProgress: (progress) => {
            newProgress[fileName] = progress;
            setUploadProgress({...newProgress});
          }
        });
      }
      
      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${files.length} image(s)`,
      });
      
      resetForm();
    } catch (error) {
      console.error("Upload error:", error);
      let errorMsg = error instanceof Error ? error.message : "An unknown error occurred";
      
      // Check for common bucket-related errors
      if (errorMsg.includes("does not exist") || errorMsg.includes("bucket not found")) {
        errorMsg = "The 'images' bucket does not exist in your Supabase project. Please create it in the Supabase dashboard.";
      }
      
      setErrorMessage(errorMsg);
      toast({
        title: "Upload failed",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
      <h2 className="text-xl font-bold mb-4">Temporary Admin Uploader</h2>
      
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {errorMessage}
            {errorMessage.includes("bucket") && (
              <div className="mt-3 p-3 bg-background/80 rounded border border-border">
                <h4 className="font-medium">How to create the 'images' bucket:</h4>
                <ol className="mt-2 space-y-1 ml-5 list-decimal text-sm">
                  <li>Go to your Supabase project dashboard</li>
                  <li>Navigate to Storage section</li>
                  <li>Click "New Bucket" button</li>
                  <li>Name it exactly "<strong>images</strong>"</li>
                  <li>Make sure to set it as public</li>
                </ol>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Image Title (optional, will use filename if empty)</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter image title"
          />
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Select 
            value={category} 
            onValueChange={(value) => setCategory(value as ImageCategory)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="people">People</SelectItem>
              <SelectItem value="animals">Animals</SelectItem>
              <SelectItem value="landscapes">Landscapes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="images">Images</Label>
          <Input 
            id="images" 
            type="file" 
            accept="image/*" 
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Select multiple images to upload in batch
          </p>
        </div>
        
        {files && files.length > 0 && (
          <div>
            <p className="text-sm font-medium">Selected Files: {files.length}</p>
            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
              {Array.from(files).map((file, index) => (
                <li key={index} className="flex justify-between">
                  <span>{file.name}</span>
                  {isUploading && (
                    <span>{uploadProgress[file.name] || 0}%</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button 
          onClick={handleUpload} 
          disabled={isUploading || !files || files.length === 0}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload Images'
          )}
        </Button>
      </div>
    </div>
  );
};
