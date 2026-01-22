'use client';

import React, { useState, useEffect } from 'react';
import { registerUser, validatePassword, checkUserExists, deleteTestUser } from '@/lib/auth-service';
import { Eye, EyeOff, Loader2, Zap } from 'lucide-react';

type RegisterFormProps = {
  onSuccess: (email: string) => void;
  onSwitchToLogin: () => void;
};

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    marketingOptIn: false,
    organizationName: '',
    companyEmail: '',
    companyPhone: '',
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    // Check if we're on localhost
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      setIsLocalhost(hostname === 'localhost' || hostname === '127.0.0.1');
    }
  }, []);

  const handleAutoPopulate = async () => {
    const testEmail = 'agency@theportlandcompany.com';
    const testPassword = 'J9u76asecdst!';

    setLoading(true);
    setError('');
    setPasswordError('');

    try {
      // Check if user already exists
      const { exists } = await checkUserExists(testEmail);

      if (exists) {
        // User exists, prompt for deletion
        const shouldDelete = window.confirm(
          'A user with this email already exists.\n\n' +
          'Would you like to delete the existing user and re-register?\n\n' +
          'This will permanently delete:\n' +
          '• User account\n' +
          '• User profile\n' +
          '• Organizations created by this user\n' +
          '• All pages associated with those organizations\n\n' +
          'Click OK to delete and continue, or Cancel to abort.'
        );

        if (!shouldDelete) {
          setLoading(false);
          return;
        }

        // Delete the existing user
        const deleteResult = await deleteTestUser(testEmail, testPassword);

        if (!deleteResult.success) {
          setError(`Failed to delete existing user: ${deleteResult.error}`);
          setLoading(false);
          return;
        }

        // Wait a moment for database cleanup
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Populate the form
      setFormData({
        firstName: 'Spencer',
        lastName: 'Hill',
        email: testEmail,
        phone: '5036108759',
        password: testPassword,
        confirmPassword: testPassword,
        organizationName: 'The Portland Company',
        companyEmail: testEmail,
        companyPhone: '503-610-8759',
        marketingOptIn: true,
        agreeToTerms: true,
      });

      setError('');
      setPasswordError('');
    } catch (err) {
      console.error('Auto-populate error:', err);
      setError('Failed to auto-populate form');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear errors when user types
    if (error) setError('');
    if (passwordError && (name === 'password' || name === 'confirmPassword')) {
      setPasswordError('');
    }
  };

  const handlePasswordBlur = () => {
    if (formData.password) {
      const validation = validatePassword(formData.password);
      if (!validation.valid) {
        setPasswordError(validation.error || '');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPasswordError('');

    // Validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.organizationName) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms & Conditions');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.error || 'Invalid password');
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        marketingOptIn: formData.marketingOptIn,
        organizationName: formData.organizationName,
        companyEmail: formData.companyEmail || undefined,
        companyPhone: formData.companyPhone || undefined,
      });

      if (result.success) {
        onSuccess(formData.email);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Personal Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handlePasswordBlur}
                required
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Minimum 12 characters with uppercase, lowercase, number, and special character
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError && (
              <p className="mt-1 text-xs text-red-600">{passwordError}</p>
            )}
          </div>
        </div>

        {/* Organization Information */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Organization Information</h3>
          <p className="text-xs text-gray-600">
            Create an organization to manage your sites and team members.
          </p>

          <div>
            <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name *
            </label>
            <input
              type="text"
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleInputChange}
              required
              placeholder="e.g., Smith for Senate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Company Email
            </label>
            <input
              type="email"
              id="companyEmail"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleInputChange}
              placeholder="contact@organization.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Company Phone
            </label>
            <input
              type="tel"
              id="companyPhone"
              name="companyPhone"
              value={formData.companyPhone}
              onChange={handleInputChange}
              placeholder="(555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="marketingOptIn"
              name="marketingOptIn"
              checked={formData.marketingOptIn}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="marketingOptIn" className="ml-2 text-sm text-gray-700">
              I would like to receive updates, tips, and promotional emails
            </label>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              required
              className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
              I agree to the{' '}
              <a
                href="/terms"
                target="_blank"
                className="text-red-600 hover:text-red-700 underline"
              >
                Terms & Conditions
              </a>{' '}
              *
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-md transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Switch to Login */}
        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Sign In
          </button>
        </div>
      </form>

      {/* Auto-populate button for localhost only */}
      {isLocalhost && (
        <button
          type="button"
          onClick={handleAutoPopulate}
          disabled={loading}
          className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group z-50"
          title="Auto-populate with sample data"
          aria-label="Auto-populate with sample data"
        >
          {loading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <Zap size={24} className="transition-transform group-hover:scale-110" />
          )}

          {/* Tooltip */}
          {!loading && (
            <span className="absolute right-full mr-3 px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Auto-populate Sample Data
            </span>
          )}
        </button>
      )}
    </div>
  );
};
