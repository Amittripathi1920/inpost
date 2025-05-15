import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, Loader2, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

interface FeedbackModalProps {
  onClose?: () => void;
}

export default function FeedbackModal({ onClose }: FeedbackModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('feedbacks')
        .insert([{ 
          user_id: user?.user_id,
          feedback_type: feedbackType,
          user_feedback: feedback
        }]);

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Feedback submitted!",
        description: "Thank you for your valuable feedback.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFeedback("");
    setFeedbackType("suggestion");
    setIsSuccess(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset when closing dialog
      setTimeout(() => {
        if (!isOpen) {
          handleReset();
          if (onClose) onClose();
        }
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen || true} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md mx-4 w-[calc(100%-2rem)] sm:w-full sm:mx-auto" style={{
        animation: "contentShow 300ms cubic-bezier(0.16, 1, 0.3, 1)"
      }}>
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6" style={{
            animation: "fadeIn 500ms ease forwards"
          }}>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4" style={{
              animation: "scaleIn 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
            }}>
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-center" style={{
              animation: "slideUp 400ms ease forwards"
            }}>Thank you for your feedback!</h3>
            <p className="text-sm text-center text-muted-foreground mt-2" style={{
              animation: "slideUp 400ms ease forwards",
              animationDelay: "100ms"
            }}>
              We appreciate you taking the time to share your thoughts with us.
            </p>
            <Button 
              className="mt-6" 
              onClick={() => {
                handleReset();
                setIsOpen(false);
                if (onClose) onClose();
              }}
              style={{
                animation: "fadeIn 500ms ease forwards",
                animationDelay: "200ms"
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader style={{
              animation: "slideDown 400ms ease forwards"
            }}>
              <DialogTitle>We value your feedback</DialogTitle>
              <DialogDescription>
                Help us improve by sharing your thoughts, issues, or suggestions.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2" style={{
                animation: "slideIn 400ms ease forwards",
                animationDelay: "100ms"
              }}>
                <Label>Feedback type</Label>
                <RadioGroup
                  defaultValue="suggestion"
                  value={feedbackType}
                  onValueChange={setFeedbackType}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4"
                >
                  <div className="flex items-center space-x-2 transition-all duration-200 hover:bg-gray-50 p-2 rounded-md">
                    <RadioGroupItem value="suggestion" id="suggestion" />
                    <Label htmlFor="suggestion" className="cursor-pointer">Suggestion</Label>
                  </div>
                  <div className="flex items-center space-x-2 transition-all duration-200 hover:bg-gray-50 p-2 rounded-md">
                    <RadioGroupItem value="issue" id="issue" />
                    <Label htmlFor="issue" className="cursor-pointer">Issue</Label>
                  </div>
                  <div className="flex items-center space-x-2 transition-all duration-200 hover:bg-gray-50 p-2 rounded-md">
                    <RadioGroupItem value="praise" id="praise" />
                    <Label htmlFor="praise" className="cursor-pointer">Praise</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2" style={{
                animation: "slideIn 400ms ease forwards",
                animationDelay: "150ms"
              }}>
                <Label htmlFor="feedback">Your feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder={
                    feedbackType === "suggestion"
                      ? "Share your ideas for improvement..."
                      : feedbackType === "issue"
                      ? "Describe the issue you're experiencing..."
                      : "Tell us what you like about our service..."
                  }
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[120px] transition-all duration-300 focus:border-blue-400"
                />
              </div>
            </div>
            
            <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2" style={{
              animation: "slideUp 400ms ease forwards",
              animationDelay: "300ms"
            }}>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsOpen(false);
                  if (onClose) onClose();
                }}
                className="transition-all hover:bg-gray-100 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!feedback.trim() || isLoading}
                className="relative overflow-hidden transition-all w-full sm:w-auto"
              >
                <span className={`absolute inset-0 h-full w-0 bg-white bg-opacity-20 transition-all duration-300 ${!feedback.trim() || isLoading ? '' : 'group-hover:w-full'}`}></span>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
