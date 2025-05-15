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
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState(user?.profile_image || "");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
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
    } else {
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
      const updatedProfileImage = imageBase64 || profileImage;
      const success = await updateProfile({
        name,
        email,
        profile_image: updatedProfileImage,
      });

      toast({
        title: success ? "Profile Updated" : "Update Failed",
        description: success
          ? "Your profile has been successfully updated."
          : "Failed to update your profile. Please try again.",
        variant: success ? "default" : "destructive",
      });
    } catch {
      toast({
        title: "Update Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update your account information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileImage">Profile Image</Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mt-1 rounded border p-2"
            />
            {imageBase64 && (
              <div className="mt-2 flex justify-center">
                <img
                  src={imageBase64}
                  alt="Profile Preview"
                  className="h-20 w-20 rounded-full object-cover"
                />
              </div>
            )}
            {!imageBase64 && profileImage && (
              <div className="mt-2 flex justify-center">
                <img
                  src={profileImage}
                  alt="Profile Preview"
                  className="h-20 w-20 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/150";
                  }}
                />
              </div>
            )}
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
