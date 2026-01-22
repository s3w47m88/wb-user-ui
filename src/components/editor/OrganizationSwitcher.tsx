'use client';

import React, { useEffect, useState } from 'react';
import { getUserOrganizations, Organization, getCurrentUserProfile, signOut } from '@/lib/auth-service';
import { Building2, Check, Loader2, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

type OrganizationSwitcherProps = {
  isOpen: boolean;
  onClose: () => void;
  onOrganizationChange: (organizationId: string) => void;
};

export const OrganizationSwitcher: React.FC<OrganizationSwitcherProps> = ({
  isOpen,
  onClose,
  onOrganizationChange,
}) => {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);

    try {
      // Get current selected organization from localStorage
      const storedOrgId = typeof window !== 'undefined' ? localStorage.getItem('selectedOrganizationId') : null;
      setSelectedOrgId(storedOrgId);

      // Load organizations and user profile
      const [orgs, profile] = await Promise.all([
        getUserOrganizations(),
        getCurrentUserProfile()
      ]);

      setOrganizations(orgs);
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load organization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrganization = (organizationId: string) => {
    setSelectedOrgId(organizationId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedOrganizationId', organizationId);
    }
    onOrganizationChange(organizationId);
    onClose();
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selectedOrganizationId');
        localStorage.removeItem('currentPageId');
      }
      router.push('/auth');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Account</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* User Profile */}
            {userProfile && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {userProfile.first_name} {userProfile.last_name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {userProfile.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-red-600" />
              </div>
            ) : (
              <>
                <h3 className="text-sm font-semibold uppercase text-gray-500 mb-3">
                  Your Organizations
                </h3>

                <div className="space-y-2">
                  {organizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => handleSelectOrganization(org.id)}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all group ${
                        selectedOrgId === org.id
                          ? 'border-red-600 bg-red-50'
                          : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start flex-1 min-w-0 mr-2">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                            selectedOrgId === org.id
                              ? 'bg-red-100'
                              : 'bg-gray-100 group-hover:bg-red-50'
                          }`}>
                            <Building2 size={20} className={
                              selectedOrgId === org.id
                                ? 'text-red-600'
                                : 'text-gray-600 group-hover:text-red-600'
                            } />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1 truncate">
                              {org.name}
                            </h4>
                            {org.company_email && (
                              <p className="text-xs text-gray-600 truncate">
                                {org.company_email}
                              </p>
                            )}
                            {org.company_phone && (
                              <p className="text-xs text-gray-600 truncate">
                                {org.company_phone}
                              </p>
                            )}
                          </div>
                        </div>
                        {selectedOrgId === org.id && (
                          <Check size={20} className="text-red-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {organizations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 size={48} className="mx-auto mb-3 text-gray-400" />
                    <p>No organizations found</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
