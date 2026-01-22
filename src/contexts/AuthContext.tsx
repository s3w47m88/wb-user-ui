'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCurrentUserProfile, getUserOrganizations, Organization } from '@/lib/auth-service';
import type { User } from '@supabase/supabase-js';

type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  marketing_opt_in: boolean;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  organizations: Organization[];
  selectedOrganizationId: string | null;
  loading: boolean;
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
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData();
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData();
      } else {
        setProfile(null);
        setOrganizations([]);
        setSelectedOrganizationId(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Load selected organization from localStorage
    if (typeof window !== 'undefined') {
      const storedOrgId = localStorage.getItem('selectedOrganizationId');
      if (storedOrgId) {
        setSelectedOrganizationId(storedOrgId);
      }
    }
  }, []);

  const loadUserData = async () => {
    try {
      // Check if user email is confirmed
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // If email is not confirmed, don't try to load profile/orgs (RLS will block)
      if (!user.email_confirmed_at) {
        console.log('Email not confirmed yet, skipping data load');
        setLoading(false);
        return;
      }

      const [userProfile, userOrgs] = await Promise.all([
        getCurrentUserProfile(),
        getUserOrganizations(),
      ]);

      setProfile(userProfile);
      setOrganizations(userOrgs);

      // Auto-select organization if only one exists and none is selected
      if (userOrgs.length === 1 && !selectedOrganizationId) {
        const orgId = userOrgs[0].id;
        setSelectedOrganizationId(orgId);
        if (typeof window !== 'undefined') {
          localStorage.setItem('selectedOrganizationId', orgId);
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setOrganizations([]);
    setSelectedOrganizationId(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('selectedOrganizationId');
      localStorage.removeItem('currentPageId');
    }

    router.push('/auth');
  };

  const selectOrganization = (organizationId: string) => {
    setSelectedOrganizationId(organizationId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedOrganizationId', organizationId);
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
    signOut: handleSignOut,
    selectOrganization,
    refreshOrganizations,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
