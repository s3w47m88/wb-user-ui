"use client";

import React, { useEffect, useEffectEvent, useState } from "react";
import { supabaseControl } from "@/lib/supabase-control";
import { getUserOrganizations, Organization } from "@/lib/auth-service";
import { formatSupabaseClientError } from "@/lib/supabase-errors";
import { Loader2, Building2 } from "lucide-react";

type OrganizationSelectorProps = {
  onSelect: (organizationId: string) => void;
};

export const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({
  onSelect,
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orgName, setOrgName] = useState("");
  const [creatingOrg, setCreatingOrg] = useState(false);

  const loadOrganizations = useEffectEvent(async () => {
    setLoading(true);
    setError("");

    try {
      // Check if user email is confirmed first
      const {
        data: { user },
      } = await supabaseControl.auth.getUser();

      if (!user) {
        setError("No user found. Please sign in.");
        setLoading(false);
        return;
      }

      if (!user.email_confirmed_at) {
        setError("Please confirm your email address before continuing.");
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
      setError(formatSupabaseClientError(err, "Failed to load organizations"));
      console.error("Load organizations error:", err);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    void loadOrganizations();
  }, []);

  const handleCreateOrganization = async () => {
    if (!orgName.trim()) {
      setError("Organization name is required.");
      return;
    }

    setCreatingOrg(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabaseControl.auth.getSession();

      if (!session?.user || !session.access_token) {
        setError("No user found. Please sign in.");
        return;
      }

      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: orgName.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.organization) {
        throw new Error(result.error || "Failed to create organization.");
      }

      onSelect(result.organization.id);
    } catch (err) {
      console.error("Create organization error:", err);
      setError(
        formatSupabaseClientError(
          err,
          "Failed to create organization. Please try again.",
        ),
      );
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
            <h2 className="text-xl font-bold text-gray-900">
              Create Your First Organization
            </h2>
            <p className="text-sm text-gray-600">
              Set up your organization to get started.
            </p>
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
          <button
            onClick={handleCreateOrganization}
            disabled={creatingOrg}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-md transition-colors"
          >
            {creatingOrg ? "Creating Organization..." : "Create Organization"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Select Organization
      </h2>
      <p className="text-gray-600 mb-6">
        Choose which organization you&apos;d like to work with.
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
                <Building2
                  size={24}
                  className="text-gray-600 group-hover:text-red-600"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {org.name}
                </h3>
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
