import { createClient } from '@supabase/supabase-js';

const controlUrl = process.env.NEXT_PUBLIC_SUPABASE_CONTROL_URL;
const controlServiceKey = process.env.SUPABASE_CONTROL_SECRET_KEY;
const defaultPassword = process.env.DEFAULT_ADMIN_USER_PASSWORD;

const adminEmail = 'agency@theportlandcompany.com';
const adminFirstName = 'Agency';
const adminLastName = 'Admin';
const adminOrgName = process.env.DEFAULT_ADMIN_ORG_NAME || 'The Portland Company';

if (!controlUrl || !controlServiceKey) {
  throw new Error('Missing Control Plane env vars. Set NEXT_PUBLIC_SUPABASE_CONTROL_URL and SUPABASE_CONTROL_SECRET_KEY.');
}

if (!defaultPassword) {
  throw new Error('Missing DEFAULT_ADMIN_USER_PASSWORD. Set it in .env before running this seed.');
}

const adminClient = createClient(controlUrl, controlServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  const { data: usersData, error: usersError } = await adminClient.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  if (usersError) {
    throw usersError;
  }

  const existingUser = usersData.users.find((user) => user.email === adminEmail);
  let userId = existingUser?.id;

  if (!userId) {
    const { data: createdUser, error: createError } = await adminClient.auth.admin.createUser({
      email: adminEmail,
      password: defaultPassword,
      email_confirm: true,
    });

    if (createError || !createdUser.user) {
      throw createError || new Error('Failed to create admin user.');
    }

    userId = createdUser.user.id;
  }

  const { data: profile } = await adminClient
    .from('user_profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (!profile) {
    const { error: profileError } = await adminClient
      .from('user_profiles')
      .insert({
        id: userId,
        first_name: adminFirstName,
        last_name: adminLastName,
        marketing_opt_in: false,
      });

    if (profileError) {
      throw profileError;
    }
  }

  const { data: existingOrg } = await adminClient
    .from('organizations')
    .select('id')
    .eq('name', adminOrgName)
    .eq('created_by', userId)
    .maybeSingle();

  let orgId = existingOrg?.id;

  if (!orgId) {
    const { data: orgData, error: orgError } = await adminClient
      .from('organizations')
      .insert({
        name: adminOrgName,
        created_by: userId,
      })
      .select('id')
      .single();

    if (orgError || !orgData) {
      throw orgError || new Error('Failed to create organization.');
    }

    orgId = orgData.id;
  }

  const { data: existingMember } = await adminClient
    .from('organization_members')
    .select('id')
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .maybeSingle();

  if (!existingMember) {
    const { error: memberError } = await adminClient
      .from('organization_members')
      .insert({
        organization_id: orgId,
        user_id: userId,
      });

    if (memberError) {
      throw memberError;
    }
  }

  console.log('Seed complete:', {
    email: adminEmail,
    organization: adminOrgName,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
