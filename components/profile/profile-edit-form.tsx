'use client';

import React, { useState } from 'react';
import { Button, Input, Card } from '@/components/duolingo-ui';
import { Loader2, X } from 'lucide-react';
import { User } from '@/lib/generated/prisma/client';

interface ProfileEditFormProps {
  user: User;
  onClose: () => void;
  onSuccess: (updatedUser: User) => void;
}

export function ProfileEditForm({ user, onClose, onSuccess }: ProfileEditFormProps) {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email || '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validation
      if (!formData.username.trim()) {
        throw new Error('Username is required');
      }

      if (formData.username.length < 3 || formData.username.length > 30) {
        throw new Error('Username must be between 3 and 30 characters');
      }

      const updatePayload: any = {
        username: formData.username.trim(),
      };

      // For guest users, email and password are required
      if (user.isGuest) {
        if (!formData.email.trim()) {
          throw new Error('Email is required to convert to a full account');
        }

        if (!formData.password) {
          throw new Error('Password is required to convert to a full account');
        }

        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        updatePayload.email = formData.email.trim();
        updatePayload.password = formData.password;
      } else {
        // For regular users, allow optional email update
        if (formData.email.trim() && formData.email !== user.email) {
          updatePayload.email = formData.email.trim();
        }
      }

      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      onSuccess(data.result);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <h2 className="text-2xl font-bold text-gray-700 mb-6">
          {user.isGuest ? 'Complete Your Account' : 'Edit Profile'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Username
            </label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username (3-30 characters)"
              disabled={loading}
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.username.length}/30 characters
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email
              {user.isGuest && <span className="text-red-500">*</span>}
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={user.isGuest ? 'Enter email' : 'Enter email (optional)'}
              disabled={loading}
              className="w-full"
            />
          </div>

          {/* Password (only for guest users) */}
          {user.isGuest && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password (min 6 characters)"
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  disabled={loading}
                  className="rounded"
                />
                Show passwords
              </label>
            </>
          )}

          {/* Help text */}
          {user.isGuest && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              <p className="font-medium">Complete your account setup</p>
              <p className="text-xs mt-1">Add your email and password to secure your account and enable login.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                user.isGuest ? 'Complete Account' : 'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
