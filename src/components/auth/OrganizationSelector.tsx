'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getUserOrganizations, Organization } from '@/lib/auth-service';
import { Loader2, Building2 } from 'lucide-react';

type OrganizationSelectorProps = {
  onSelect: (organizationId: string) => void;
};

export const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({ onSelect }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    setLoading(true);
    setError('');

    try {
      // Check if user email is confirmed first
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('No user found. Please sign in.');
        setLoading(false);
        return;
      }

      if (!user.email_confirmed_at) {
        setError('Please confirm your email address before continuing.');
        setLoading(false);
        return;
      }

      const orgs = await getUserOrganizations();

      if (orgs.length === 0) {
        setError('No organizations found. Please contact support.');
      } else if (orgs.length === 1) {
        // Auto-select if only one organization
        onSelect(orgs[0].id);
      } else {
        setOrganizations(orgs);
      }
    } catch (err) {
      setError('Failed to load organizations');
      console.error('Load organizations error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 size={40} className="animate-spin text-red-600 mb-4" />
          <p className="text-gray-600">Loading your organizations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Organization</h2>
      <p className="text-gray-600 mb-6">
        Choose which organization you'd like to work with.
      </p>

      <div className="space-y-3">
        {organizations.map((org) => (
          <button
            key={org.id}
            onClick={() => onSelect(org.id)}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition-colors text-left group"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 group-hover:bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <Building2 size={24} className="text-gray-600 group-hover:text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{org.name}</h3>
                {org.company_email && (
                  <p className="text-sm text-gray-600">{org.company_email}</p>
                )}
                {org.company_phone && (
                  <p className="text-sm text-gray-600">{org.company_phone}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
