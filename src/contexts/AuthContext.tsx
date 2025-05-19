import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

interface UserProfile {
  user_id: string;
  full_name: string;
  user_email: string;
  profile_image?: string;
  user_designation?: string;
  exp_level?: string;
  isFirstTimeUser?: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  signup: async () => false,
  updateProfile: async () => false,
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const loadUserProfile = async (userId: string, email: string) => {
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (userData) {
      const profile: UserProfile = {
        user_id: userId,
        full_name: userData.full_name || "User",
        user_email: email,
        profile_image: userData.profile_image,
        user_designation: userData.user_designation,
        exp_level: userData.exp_level,
        isFirstTimeUser: userData.isFirstTimeUser,
      };
      setUser(profile);
      setIsAuthenticated(true);
    } else {
      setUser({ user_id: userId, full_name: "User", user_email: email });
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    const initSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setSession(session);
          loadUserProfile(session.user.id, session.user.email || "");
        }
      } catch (error) {
        console.error("Error initializing session:", error);
        // Handle gracefully - user will need to log in again
      }
    };

    let subscription: { subscription: { unsubscribe: () => void } } = {
      subscription: { unsubscribe: () => {} }
    };

    try {
      const { data: subscriptionData } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          try {
            if (event === "SIGNED_IN" && session) {
              setSession(session);
              loadUserProfile(session.user.id, session.user.email || "");
            } else if (event === "SIGNED_OUT") {
              setUser(null);
              setIsAuthenticated(false);
              setSession(null);
            }
          } catch (error) {
            console.error("Error in auth state change handler:", error);
          }
        }
      );
      
      if (subscriptionData) {
        subscription = subscriptionData;
      }
    } catch (error) {
      console.error("Error setting up auth subscription:", error);
    }

    initSession();

    return () => {
      try {
        subscription.subscription.unsubscribe();
      } catch (error) {
        console.error("Error unsubscribing from auth changes:", error);
      }
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        toast({
          title: "Login Failed",
          description: error?.message || "An unexpected error occurred.",
          variant: "destructive",
        });
        return false;
      }

      await loadUserProfile(data.user.id, email);
      toast({ title: "Login Successful", description: "Welcome back!" });
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (
    full_name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name },
        },
      });

      if (authError || !authData.user) {
        toast({
          title: "Signup Failed",
          description: authError?.message || "Account creation failed.",
          variant: "destructive",
        });
        return false;
      }

      await supabase.from("users").insert([
        {
          user_id: authData.user.id,
          full_name,
          user_email: email,
        },
      ]);

      toast({
        title: "Signup Successful",
        description:
          authData.session === null
            ? "A confirmation email has been sent to your email address."
            : "Your account has been created!",
      });

      if (authData.user) {
        await loadUserProfile(authData.user.id, email);
      }

      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProfile = async (
    userData: Partial<UserProfile>
  ): Promise<boolean> => {
    if (!user || !user.user_id) return false;

    try {
      const updateData: Partial<UserProfile> = {};
      if (userData.full_name) updateData.full_name = userData.full_name;
      if (userData.profile_image) updateData.profile_image = userData.profile_image;
      if (userData.user_designation) updateData.user_designation = userData.user_designation;
      if (userData.exp_level) updateData.exp_level = userData.exp_level;
      if (typeof userData.isFirstTimeUser === "number")
        updateData.isFirstTimeUser = userData.isFirstTimeUser;

      const { error } = await supabase
        .from("users")
        .update(updateData)
        .eq("user_id", user.user_id);

      if (error) {
        console.error("Profile update error:", error);
        return false;
      }

      setUser((prev) => (prev ? { ...prev, ...updateData } : prev));
      return true;
    } catch (error) {
      console.error("Profile update exception:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear the local state even if the API call fails
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
