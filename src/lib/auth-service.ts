import { supabase } from './supabase';

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  marketing_opt_in: boolean;
  created_at: string;
  updated_at: string;
};

export type Organization = {
  id: string;
  name: string;
  company_email?: string;
  company_phone?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type RegistrationData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  marketingOptIn: boolean;
  organizationName: string;
  companyEmail?: string;
  companyPhone?: string;
};

/**
 * Generate NIST-compliant random password
 * Minimum 12 characters with letters, numbers, and special characters
 */
export function generateNISTPassword(length: number = 16): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()-_=+';

  const allChars = uppercase + lowercase + numbers + specialChars;

  let password = '';

  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Validate password meets NIST standards
 * - Minimum 12 characters
 * - Contains uppercase, lowercase, number, and special character
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 12) {
    return { valid: false, error: 'Password must be at least 12 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }

  if (!/[!@#$%^&*()\-_=+]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character (!@#$%^&*()-_=+)' };
  }

  return { valid: true };
}

/**
 * Sanitize input to prevent injection attacks
 */
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Register a new user with organization creation
 */
export async function registerUser(data: RegistrationData): Promise<{ success: boolean; error?: string; userId?: string; organizationId?: string }> {
  try {
    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error };
    }

    // Sanitize inputs
    const sanitizedData = {
      email: sanitizeInput(data.email.toLowerCase()),
      password: data.password, // Don't sanitize password
      firstName: sanitizeInput(data.firstName),
      lastName: sanitizeInput(data.lastName),
      phone: data.phone ? sanitizeInput(data.phone) : undefined,
      marketingOptIn: Boolean(data.marketingOptIn),
      organizationName: sanitizeInput(data.organizationName),
      companyEmail: data.companyEmail ? sanitizeInput(data.companyEmail.toLowerCase()) : undefined,
      companyPhone: data.companyPhone ? sanitizeInput(data.companyPhone) : undefined,
    };

    // Call the API route to register (server-side with admin privileges to bypass RLS)
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanitizedData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return { success: false, error: result.error || 'Registration failed' };
    }

    return {
      success: true,
      userId: result.userId,
      organizationId: result.organizationId
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'An unexpected error occurred during registration' };
  }
}

/**
 * Sign in user
 */
export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const sanitizedEmail = sanitizeInput(email.toLowerCase());

    const { error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: 'An unexpected error occurred during sign in' };
  }
}

/**
 * Sign out user
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: 'An unexpected error occurred during sign out' };
  }
}

/**
 * Get current user's profile
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      console.error('Failed to get user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
}

/**
 * Get user's organizations
 */
export async function getUserOrganizations(): Promise<Organization[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from('organization_members')
      .select('organization_id, organizations(*)')
      .eq('user_id', user.id);

    if (error || !data) {
      console.error('Failed to get organizations:', error);
      return [];
    }

    return data.map((item: any) => item.organizations) as Organization[];
  } catch (error) {
    console.error('Get organizations error:', error);
    return [];
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const sanitizedEmail = sanitizeInput(email.toLowerCase());

    const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Password reset request error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Update password (after reset)
 */
export async function updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Update password error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Check if a user exists by email (LOCALHOST ONLY - FOR DEVELOPMENT)
 */
export async function checkUserExists(email: string): Promise<{ exists: boolean; userId?: string }> {
  try {
    const sanitizedEmail = sanitizeInput(email.toLowerCase());

    // Call the API route to check user existence (server-side with service role key)
    const response = await fetch('/api/check-user-exists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: sanitizedEmail,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('Failed to check user existence:', data.error);
      return { exists: false };
    }

    return {
      exists: data.exists,
      userId: data.userId
    };
  } catch (error: any) {
    console.error('Check user exists error:', error);
    return { exists: false };
  }
}

/**
 * Delete a test user and all related data (LOCALHOST ONLY - FOR DEVELOPMENT)
 * This deletes: user auth, user_profile, organizations created by user, organization_members, and pages
 */
export async function deleteTestUser(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const sanitizedEmail = sanitizeInput(email.toLowerCase());

    // Call the API route to delete the user (server-side with service role key)
    const response = await fetch('/api/delete-test-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: sanitizedEmail,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to delete user' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Delete test user error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred during deletion' };
  }
}
