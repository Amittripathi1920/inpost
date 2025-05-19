import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
interface ProfileImageUploaderProps {
  onImageChange: (base64: string) => void; // This is called when base64 is ready
  existingImage: string | null; // Existing image base64 (if any)
}
const ProfileImageUploader = ({ onImageChange, existingImage }: ProfileImageUploaderProps) => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(existingImage);
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: "Please upload a valid image file.",
      });
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      setImagePreview(base64Image); // Set preview
      onImageChange(base64Image); // Pass base64 to parent component
    };
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error while reading the image.",
      });
    };

    reader.readAsDataURL(file); // Convert file to base64
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="profile-image">Profile Image</Label>
        <input
          id="profile-image"
          type="file"
          accept="image/*"
          className="block w-full p-2"
          onChange={handleImageChange}
          disabled={loading}
          title="Upload profile image"
          placeholder="Choose a profile image"
          aria-label="Upload profile image"
        />
      </div>

      {imagePreview && (
        <div className="flex items-center">
          <img
            src={imagePreview}
            alt="Profile Preview"
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>
      )}

      <Button onClick={() => setImagePreview(null)} disabled={loading}>
        {loading ? "Uploading..." : "Remove Image"}
      </Button>
    </div>
  );
};
export default ProfileImageUploader;
