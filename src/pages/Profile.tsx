import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const userInitial = name.charAt(0).toUpperCase() || "U";

  // Update state when user data is available
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setProfileImage(user.profile_image || "");
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please upload a valid image file.",
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Only include fields that have changed
      const updateData: any = {};
      
      // Only update name if it's different from the current user name
      if (name !== user?.name) {
        updateData.full_name = name; // Use full_name to match the database column
      }
      
      // Only update profile image if a new one was selected
      if (imageBase64) {
        updateData.profile_image = imageBase64;
      }
      
      // Only proceed with update if there are changes
      if (Object.keys(updateData).length > 0) {
        const success = await updateProfile(updateData);

        toast({
          title: success ? "Profile Updated" : "Update Failed",
          description: success
            ? "Your profile has been successfully updated."
            : "Failed to update your profile. Please try again.",
          variant: success ? "default" : "destructive",
        });
      } else {
        toast({
          title: "No Changes",
          description: "No changes were made to your profile.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Create a data URI for the default avatar with the user's initial
  const defaultAvatar = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='60' fill='%2394a3b8'%3E${userInitial}%3C/text%3E%3C/svg%3E`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update your name and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileImage">Profile Image</Label>
            <div className="flex flex-col items-center space-y-4">
              {/* Current profile image or preview */}
              <div className="relative">
                <img
                  src={imageBase64 || profileImage || defaultAvatar}
                  alt="Profile Preview"
                  className="h-32 w-32 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
              
              {/* File upload button */}
              <div className="w-full">
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: Square image, at least 300x300 pixels
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
