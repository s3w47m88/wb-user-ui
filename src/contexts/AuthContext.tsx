"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { supabaseControl } from "@/lib/supabase-control";
import {
  getCurrentUserProfile,
  getUserOrganizations,
  Organization,
  UserProfile,
} from "@/lib/auth-service";
import { formatSupabaseClientError } from "@/lib/supabase-errors";
import type { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  organizations: Organization[];
  selectedOrganizationId: string | null;
  loading: boolean;
  authError: string | null;
  signOut: () => Promise<void>;
  selectOrganization: (organizationId: string) => void;
  refreshOrganizations: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const loadUserData = useEffectEvent(async () => {
    try {
      // Check if user email is confirmed
      const {
        data: { user },
      } = await supabaseControl.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // If email is not confirmed, don't try to load profile/orgs (RLS will block)
      if (!user.email_confirmed_at) {
        console.log("Email not confirmed yet, skipping data load");
        setLoading(false);
        return;
      }

      const [userProfile, userOrgs] = await Promise.all([
        getCurrentUserProfile(),
        getUserOrganizations(),
      ]);

      setAuthError(null);
      setProfile(userProfile);
      setOrganizations(userOrgs);

      // Auto-select organization if only one exists and none is selected
      if (userOrgs.length === 1 && !selectedOrganizationId) {
        const orgId = userOrgs[0].id;
        setSelectedOrganizationId(orgId);
        if (typeof window !== "undefined") {
          localStorage.setItem("selectedOrganizationId", orgId);
        }
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      setAuthError(
        formatSupabaseClientError(error, "Failed to load user data."),
      );
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabaseControl.auth.getSession();

        if (!mounted) {
          return;
        }

        setAuthError(null);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadUserData();
        } else {
          setLoading(false);
        }
      } catch (error) {
        if (!mounted) {
          return;
        }

        console.error("Failed to initialize auth session:", error);
        setAuthError(
          formatSupabaseClientError(
            error,
            "Failed to initialize auth session.",
          ),
        );
        setUser(null);
        setProfile(null);
        setOrganizations([]);
        setSelectedOrganizationId(null);
        setLoading(false);
      }
    };

    void initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseControl.auth.onAuthStateChange((_event, session) => {
      setAuthError(null);
      setUser(session?.user ?? null);
      if (session?.user) {
        void loadUserData();
      } else {
        setProfile(null);
        setOrganizations([]);
        setSelectedOrganizationId(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Load selected organization from localStorage
    if (typeof window !== "undefined") {
      const storedOrgId = localStorage.getItem("selectedOrganizationId");
      if (storedOrgId) {
        setSelectedOrganizationId(storedOrgId);
      }
    }
  }, []);

  const handleSignOut = async () => {
    await supabaseControl.auth.signOut();
    setUser(null);
    setProfile(null);
    setOrganizations([]);
    setSelectedOrganizationId(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("selectedOrganizationId");
      localStorage.removeItem("currentPageId");
    }

    router.push("/auth");
  };

  const selectOrganization = (organizationId: string) => {
    setSelectedOrganizationId(organizationId);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedOrganizationId", organizationId);
    }
  };

  const refreshOrganizations = async () => {
    const orgs = await getUserOrganizations();
    setOrganizations(orgs);
  };

  const value = {
    user,
    profile,
    organizations,
    selectedOrganizationId,
    loading,
    authError,
    signOut: handleSignOut,
    selectOrganization,
    refreshOrganizations,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
