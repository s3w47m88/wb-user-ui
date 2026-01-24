'use client';

import React, { useEffect, useState } from 'react';
import { supabaseControl } from '@/lib/supabase-control';
import { getUserOrganizations, Organization } from '@/lib/auth-service';
import { Loader2, Building2 } from 'lucide-react';

type OrganizationSelectorProps = {
  onSelect: (organizationId: string) => void;
};

export const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({ onSelect }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  const [creatingOrg, setCreatingOrg] = useState(false);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    setLoading(true);
    setError('');

    try {
      // Check if user email is confirmed first
      const { data: { user } } = await supabaseControl.auth.getUser();

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
        setOrganizations([]);
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

  const handleCreateOrganization = async () => {
    if (!orgName.trim()) {
      setError('Organization name is required.');
      return;
    }

    setCreatingOrg(true);
    setError('');

    try {
      const { data: { user } } = await supabaseControl.auth.getUser();

      if (!user) {
        setError('No user found. Please sign in.');
        return;
      }

      const { data: orgData, error: orgError } = await supabaseControl
        .from('organizations')
        .insert({
          name: orgName.trim(),
          company_email: orgEmail.trim() || null,
          company_phone: orgPhone.trim() || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (orgError || !orgData) {
        throw orgError || new Error('Failed to create organization.');
      }

      const { error: memberError } = await supabaseControl
        .from('organization_members')
        .insert({
          organization_id: orgData.id,
          user_id: user.id,
        });

      if (memberError) {
        throw memberError;
      }

      onSelect(orgData.id);
    } catch (err) {
      console.error('Create organization error:', err);
      setError('Failed to create organization. Please try again.');
    } finally {
      setCreatingOrg(false);
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

  if (error && organizations.length > 0) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <Building2 size={20} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create Your First Organization</h2>
            <p className="text-sm text-gray-600">Set up your organization to get started.</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="The Portland Company"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Email (optional)
            </label>
            <input
              type="email"
              value={orgEmail}
              onChange={(e) => setOrgEmail(e.target.value)}
              placeholder="team@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Phone (optional)
            </label>
            <input
              value={orgPhone}
              onChange={(e) => setOrgPhone(e.target.value)}
              placeholder="(555) 555-1234"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleCreateOrganization}
            disabled={creatingOrg}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-md transition-colors"
          >
            {creatingOrg ? 'Creating Organization...' : 'Create Organization'}
          </button>
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
