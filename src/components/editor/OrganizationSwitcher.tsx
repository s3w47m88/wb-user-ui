"use client";

import React, { useEffect, useEffectEvent, useState } from "react";
import {
  deleteOrganization,
  getCurrentUserProfile,
  updateOrganization,
} from "@/lib/auth-service";
import {
  Building2,
  Check,
  ChevronDown,
  Loader2,
  LogOut,
  Pencil,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  canManageOrganization,
  getNextSelectedOrganizationId,
  normalizeOrganizationName,
} from "@/lib/organization-management";

type OrganizationSwitcherProps = {
  isOpen: boolean;
  onClose: () => void;
  onOrganizationChange: (organizationId: string | null) => void;
};

export const OrganizationSwitcher: React.FC<OrganizationSwitcherProps> = ({
  isOpen,
  onClose,
  onOrganizationChange,
}) => {
  const router = useRouter();
  const {
    organizations,
    profile,
    selectedOrganizationId,
    refreshOrganizations,
    selectOrganization,
    signOut,
  } = useAuth();
  const [loading, setLoading] = useState(true);
  const [expandedOrganizationId, setExpandedOrganizationId] = useState<
    string | null
  >(null);
  const [editingOrganizationId, setEditingOrganizationId] = useState<
    string | null
  >(null);
  const [deleteConfirmOrganizationId, setDeleteConfirmOrganizationId] =
    useState<string | null>(null);
  const [draftOrganizationName, setDraftOrganizationName] = useState("");
  const [actionOrganizationId, setActionOrganizationId] = useState<
    string | null
  >(null);
  const [actionError, setActionError] = useState("");
  const [userEmail, setUserEmail] = useState(profile?.email || "");

  useEffect(() => {
    if (isOpen) {
      void loadData();
      return;
    }

    setExpandedOrganizationId(null);
    setEditingOrganizationId(null);
    setDeleteConfirmOrganizationId(null);
    setDraftOrganizationName("");
    setActionOrganizationId(null);
    setActionError("");
  }, [isOpen]);

  useEffect(() => {
    if (profile?.email) {
      setUserEmail(profile.email);
    }
  }, [profile?.email]);

  const loadData = useEffectEvent(async () => {
    setLoading(true);
    setActionError("");

    try {
      await refreshOrganizations();

      if (!profile?.email) {
        const currentProfile = await getCurrentUserProfile();
        if (currentProfile?.email) {
          setUserEmail(currentProfile.email);
        }
      }
    } catch (error) {
      console.error("Failed to load organization data:", error);
      setActionError("Failed to load organizations.");
    } finally {
      setLoading(false);
    }
  });

  const effectiveSelectedOrganizationId =
    selectedOrganizationId ||
    (typeof window !== "undefined"
      ? localStorage.getItem("selectedOrganizationId")
      : null);

  const handleSelectOrganization = (organizationId: string) => {
    selectOrganization(organizationId);
    onOrganizationChange(organizationId);
    onClose();
  };

  const handleToggleActions = (organizationId: string) => {
    const isClosingCurrentOrganization =
      expandedOrganizationId === organizationId;

    setActionError("");
    setEditingOrganizationId(null);
    setDeleteConfirmOrganizationId(null);
    setDraftOrganizationName("");
    setExpandedOrganizationId((currentOrganizationId) =>
      currentOrganizationId === organizationId ? null : organizationId,
    );

    if (isClosingCurrentOrganization) {
      return;
    }
  };

  const handleStartEdit = (organizationId: string, organizationName: string) => {
    setExpandedOrganizationId(organizationId);
    setEditingOrganizationId(organizationId);
    setDeleteConfirmOrganizationId(null);
    setDraftOrganizationName(organizationName);
    setActionError("");
  };

  const handleCancelActions = () => {
    setEditingOrganizationId(null);
    setDeleteConfirmOrganizationId(null);
    setDraftOrganizationName("");
    setActionError("");
  };

  const handleSaveOrganization = async (organizationId: string) => {
    const trimmedName = normalizeOrganizationName(draftOrganizationName);

    if (!trimmedName) {
      setActionError("Organization name is required.");
      return;
    }

    setActionOrganizationId(organizationId);
    setActionError("");

    const result = await updateOrganization(organizationId, trimmedName);

    if (!result.success) {
      setActionError(result.error || "Failed to update organization.");
      setActionOrganizationId(null);
      return;
    }

    await refreshOrganizations();
    setEditingOrganizationId(null);
    setExpandedOrganizationId(null);
    setDraftOrganizationName("");
    setActionOrganizationId(null);
  };

  const handleDeleteOrganization = async (organizationId: string) => {
    setActionOrganizationId(organizationId);
    setActionError("");

    const result = await deleteOrganization(organizationId);

    if (!result.success) {
      setActionError(result.error || "Failed to delete organization.");
      setActionOrganizationId(null);
      return;
    }

    const nextOrganizationId = getNextSelectedOrganizationId(
      organizations,
      organizationId,
      effectiveSelectedOrganizationId,
    );

    selectOrganization(nextOrganizationId);

    if (typeof window !== "undefined" && !nextOrganizationId) {
      localStorage.removeItem("currentPageId");
    }

    await refreshOrganizations();
    onOrganizationChange(nextOrganizationId);

    setExpandedOrganizationId(null);
    setEditingOrganizationId(null);
    setDeleteConfirmOrganizationId(null);
    setDraftOrganizationName("");
    setActionOrganizationId(null);

    if (!nextOrganizationId) {
      onClose();
      router.push("/auth");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50">
        <div className="h-full flex flex-col">
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

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                {profile && (
                  <p className="font-semibold text-gray-900 truncate">
                    {profile.first_name} {profile.last_name}
                  </p>
                )}
                <p className="text-sm text-gray-500 truncate">
                  {userEmail || "No email loaded"}
                </p>
              </div>
            </div>
          </div>

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

                <div className="space-y-3">
                  {organizations.map((organization) => {
                    const isSelected =
                      effectiveSelectedOrganizationId === organization.id;
                    const isExpanded =
                      expandedOrganizationId === organization.id;
                    const isEditing =
                      editingOrganizationId === organization.id;
                    const isConfirmingDelete =
                      deleteConfirmOrganizationId === organization.id;
                    const isSubmitting =
                      actionOrganizationId === organization.id;
                    const canManage = canManageOrganization(organization);

                    return (
                      <div
                        key={organization.id}
                        className={`w-full border-2 rounded-lg transition-all ${
                          isSelected
                            ? "border-red-600 bg-red-50"
                            : "border-gray-200 hover:border-red-300"
                        }`}
                      >
                        <div className="p-4 flex items-start justify-between gap-3">
                          <button
                            onClick={() =>
                              handleSelectOrganization(organization.id)
                            }
                            className="flex items-start flex-1 min-w-0 text-left group"
                          >
                            <div
                              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                                isSelected
                                  ? "bg-red-100"
                                  : "bg-gray-100 group-hover:bg-red-50"
                              }`}
                            >
                              <Building2
                                size={20}
                                className={
                                  isSelected
                                    ? "text-red-600"
                                    : "text-gray-600 group-hover:text-red-600"
                                }
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 truncate">
                                  {organization.name}
                                </h4>
                                {organization.role && (
                                  <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                                    {organization.role}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isSelected && (
                              <Check size={20} className="text-red-600" />
                            )}
                            {canManage && (
                              <button
                                onClick={() =>
                                  handleToggleActions(organization.id)
                                }
                                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-white/70 transition-colors"
                                title="Manage organization"
                              >
                                <ChevronDown
                                  size={18}
                                  className={`transition-transform ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                            )}
                          </div>
                        </div>

                        {isExpanded && canManage && (
                          <div className="border-t border-red-100 px-4 py-3 bg-white/80">
                            {actionError && (
                              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {actionError}
                              </div>
                            )}

                            {isEditing ? (
                              <div className="space-y-3">
                                <label className="block">
                                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Organization name
                                  </span>
                                  <input
                                    value={draftOrganizationName}
                                    onChange={(event) =>
                                      setDraftOrganizationName(
                                        event.target.value,
                                      )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                                    placeholder="Organization name"
                                    disabled={isSubmitting}
                                  />
                                </label>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleSaveOrganization(organization.id)
                                    }
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {isSubmitting ? (
                                      <Loader2
                                        size={16}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Save size={16} />
                                    )}
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancelActions}
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    <X size={16} />
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : isConfirmingDelete ? (
                              <div className="space-y-3">
                                <p className="text-sm text-gray-700">
                                  Delete <strong>{organization.name}</strong>?
                                  This also removes its sites and pages.
                                </p>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleDeleteOrganization(organization.id)
                                    }
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {isSubmitting ? (
                                      <Loader2
                                        size={16}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Trash2 size={16} />
                                    )}
                                    Delete
                                  </button>
                                  <button
                                    onClick={handleCancelActions}
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    <X size={16} />
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleStartEdit(
                                      organization.id,
                                      organization.name,
                                    )
                                  }
                                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                  <Pencil size={16} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteConfirmOrganizationId(
                                      organization.id,
                                    );
                                    setEditingOrganizationId(null);
                                    setActionError("");
                                  }}
                                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                                >
                                  <Trash2 size={16} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {organizations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Building2
                      size={48}
                      className="mx-auto mb-3 text-gray-400"
                    />
                    <p>No organizations found</p>
                  </div>
                )}
              </>
            )}
          </div>

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
