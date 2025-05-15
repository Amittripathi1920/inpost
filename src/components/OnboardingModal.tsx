// src/components/OnboardingModal.tsx

import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  userId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Designation {
  designation_id: number;
  designation_name: string;
}

interface Experience {
  exp_level_id: number;
  exp_name: string;
}

const OnboardingModal = ({ userId, onClose, onSuccess }: Props) => {
  const { toast } = useToast();

  const [designations, setDesignations] = useState<Designation[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredDesignations, setFilteredDesignations] = useState<Designation[]>([]);
  const [selectedExp, setSelectedExp] = useState("");
  const [designationInput, setDesignationInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: desigData } = await supabase
        .from("designation")
        .select("designation_id, designation_name");

      const { data: expData } = await supabase
        .from("experience_level")
        .select("exp_level_id, exp_name");

      if (desigData) {
        setDesignations(desigData);
        setFilteredDesignations(desigData);
      }
      if (expData) setExperiences(expData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setShowDropdown(false);
        }
      });
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInputChange = (value: string) => {
    setDesignationInput(value);
    setShowDropdown(true);
    const filtered = designations.filter((d) =>
      d.designation_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDesignations(filtered);
  };

  const handleSelect = (name: string) => {
    setDesignationInput(name);
    setShowDropdown(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageBase64(reader.result as string);
        };
        reader.readAsDataURL(file);
        setImageError("");
      } else {
        setImageError("Please upload a valid image file.");
      }
    }
  };

  const handleSubmit = async () => {
    const trimmedInput = designationInput.trim();
    const normalizedInput = trimmedInput.toLowerCase();

    if (!selectedExp) {
      toast({
        variant: "destructive",
        title: "Missing Experience Level",
        description: "Please select your experience level.",
      });
      return;
    }

    if (!trimmedInput) {
      toast({
        variant: "destructive",
        title: "Missing Designation",
        description: "Please select or type your designation.",
      });
      return;
    }

    setLoading(true);

    try {
      const existing = designations.find(
        (d) => d.designation_name.toLowerCase() === normalizedInput
      );

      if (!existing) {
        const { error: insertError } = await supabase
          .from("designation")
          .insert({ designation_name: trimmedInput, is_manual: 1 });

        if (insertError) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to insert new designation.",
          });
          return;
        }
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({
          exp_level: selectedExp,
          user_designation: trimmedInput,
          isfirsttimeuser: 1,
          profile_image: imageBase64,
        })
        .eq("user_id", userId);

      if (updateError) {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "Could not update your profile.",
        });
        return;
      }

      const { data: topicNamesData, error: topicNameErr } = await supabase
        .from("designation_topics")
        .select("topic_name")
        .ilike("designation", trimmedInput);

      if (topicNameErr) {
        toast({
          variant: "destructive",
          title: "Topic Error",
          description: "Failed to fetch topics for your designation.",
        });
        return;
      }

      const topicNames = topicNamesData?.map((row) => row.topic_name) || [];

      if (topicNames.length > 0) {
        const { data: topicIdsData, error: topicIdErr } = await supabase
          .from("topics")
          .select("topic_id, topic_name")
          .in("topic_name", topicNames);

        if (topicIdErr) {
          toast({
            variant: "destructive",
            title: "Topic ID Error",
            description: "Failed to retrieve topic IDs.",
          });
          return;
        }

        const insertData = topicIdsData.map((t) => ({
          user_id: userId,
          topic_id: t.topic_id,
        }));

        const { error: prefInsertErr } = await supabase
          .from("user_topic_preference")
          .insert(insertData);

        if (prefInsertErr) {
          toast({
            variant: "destructive",
            title: "Preference Error",
            description: "Could not save your topic preferences.",
          });
          return;
        }
      }

      toast({ title: "Success", description: "Profile updated." });

      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Unexpected Error",
        description: "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome! Let’s personalize your experience</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative" ref={dropdownRef}>
            <Label htmlFor="designation">Your Designation</Label>
            <input
              id="designation"
              type="text"
              className="w-full border p-2 rounded"
              value={designationInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              placeholder="Type or select your designation"
              disabled={loading}
            />
            {showDropdown && filteredDesignations.length > 0 && (
              <div className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                {filteredDesignations.map((item) => (
                  <div
                    key={item.designation_id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect(item.designation_name)}
                  >
                    {item.designation_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="experience">Experience Level</Label>
            <select
              id="experience"
              className="w-full mt-1 rounded border p-2"
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
              disabled={loading}
            >
              <option value="">-- Select --</option>
              {experiences.map((e) => (
                <option key={e.exp_level_id} value={e.exp_name}>
                  {e.exp_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="profile-image">Profile Image</Label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              className="w-full mt-1 rounded border p-2"
              onChange={handleImageChange}
              disabled={loading}
            />
            {imageError && <p className="text-red-600">{imageError}</p>}
            {imageBase64 && (
              <img
                src={imageBase64}
                alt="Profile Preview"
                className="mt-2 w-20 h-20 object-cover rounded-full"
              />
            )}
          </div>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
