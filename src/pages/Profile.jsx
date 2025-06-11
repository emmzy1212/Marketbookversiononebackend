import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { HiUser, HiMail, HiPhone, HiLocationMarker, HiPencil, HiCamera } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

function Profile() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
    avatar: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
        avatar: user.avatar || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return toast.error('New passwords do not match');
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters');
    }

    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        phone: formData.phone,
        location: formData.location,
        avatar: formData.avatar,
      };

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      const response = await api.updateUserProfile(updateData);
      login(response.data);
      setEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, avatar: url }));
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 px-6 py-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt={formData.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-4 border-white">
                    <HiUser className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                {editing && (
                  <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700">
                    <HiCamera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{formData.name}</h1>
                <p className="text-primary-100">{formData.email}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-primary-600 mt-2">
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </span>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => setEditing(!editing)}
                  className="bg-white text-primary-600 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2"
                >
                  <HiPencil className="h-4 w-4" />
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                  
                  <div>
                    <label className="form-label">
                      <HiUser className="inline h-4 w-4 mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!editing}
                      className="form-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      <HiMail className="inline h-4 w-4 mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!editing}
                      className="form-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      <HiPhone className="inline h-4 w-4 mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!editing}
                      className="form-input"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      <HiLocationMarker className="inline h-4 w-4 mr-2" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!editing}
                      className="form-input"
                      placeholder="City, State"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Additional Information</h3>
                  
                  <div>
                    <label className="form-label">Avatar URL</label>
                    <input
                      type="url"
                      value={formData.avatar}
                      onChange={handleAvatarChange}
                      disabled={!editing}
                      className="form-input"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div>
                    <label className="form-label">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!editing}
                      className="form-input"
                      rows="4"
                      maxLength="500"
                      placeholder="Tell us about yourself..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>

                  {editing && (
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium text-gray-800">Change Password (Optional)</h4>
                      
                      <div>
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          value={formData.newPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="form-input"
                          placeholder="Leave blank to keep current password"
                        />
                      </div>

                      <div>
                        <label className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="form-input"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {editing && (
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {loading && <LoadingSpinner />}
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;