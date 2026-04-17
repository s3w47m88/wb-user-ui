type OrganizationRoleLike = {
  role?: string | null;
};

type OrganizationIdLike = {
  id: string;
};

export function normalizeOrganizationName(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function canManageOrganization(organization: OrganizationRoleLike) {
  return organization.role === "owner";
}

export function getNextSelectedOrganizationId(
  organizations: OrganizationIdLike[],
  deletedOrganizationId: string,
  selectedOrganizationId: string | null,
) {
  if (selectedOrganizationId !== deletedOrganizationId) {
    return selectedOrganizationId;
  }

  const remainingOrganizations = organizations.filter(
    (organization) => organization.id !== deletedOrganizationId,
  );

  return remainingOrganizations[0]?.id ?? null;
}
