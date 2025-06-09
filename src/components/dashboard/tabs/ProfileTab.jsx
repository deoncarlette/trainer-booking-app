import React, { useState } from 'react';
import { Edit3, X } from 'lucide-react';
import { dashboard, components } from '../../../utils';
import ProfilePhotoUploader from "../../ProfilePhotoUploader";

export default function ProfileTab({ coach, editingProfile, setEditingProfile, onProfileUpdate, loading }) {
  const [formData, setFormData] = useState({
    name: coach.name || '',
    email: coach.email || '',
    phone: coach.phone || '',
    specialties: coach.specialties || [],
    bio: coach.bio || '',
    experience: coach.experience || ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecialtiesChange = (value) => {
    const specialties = value.split(',').map(s => s.trim()).filter(s => s);
    setFormData(prev => ({
      ...prev,
      specialties
    }));
  };

  const handleSave = async () => {
    if (onProfileUpdate) {
      await onProfileUpdate(formData);
    }
    setEditingProfile(false);
  };

  const handleCancel = () => {
    // Reset form data to original coach data
    setFormData({
      name: coach.name || '',
      email: coach.email || '',
      phone: coach.phone || '',
      specialties: coach.specialties || [],
      bio: coach.bio || '',
      experience: coach.experience || ''
    });
    setEditingProfile(false);
  };

  return (
    <div className={dashboard.section.container}>
      <div className={dashboard.section.header}>
        <h3 className={dashboard.section.title}>Profile Information</h3>
        <button
          onClick={() => setEditingProfile(!editingProfile)}
          className={`${dashboard.form.primaryButton} flex items-center space-x-1`}
        >
          {editingProfile ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          <span>{editingProfile ? 'Cancel' : 'Edit'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="text-center">
            <img
              src={coach.photoURL || coach.image || coach.avatar || '/default-avatar.png'}
              alt={coach.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200 dark:border-gray-600"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            {editingProfile && (
              <div className="mt-4">
                <ProfilePhotoUploader
                  coachId={coach.id}
                  currentPhoto={coach.photoURL || coach.image || coach.avatar}
                />
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className={dashboard.form.group}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={dashboard.form.label}>
                  Full Name
                </label>
                {editingProfile ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={dashboard.form.input}
                  />
                ) : (
                  <p className="dark:text-white">{coach.name || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className={dashboard.form.label}>
                  Email
                </label>
                {editingProfile ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={dashboard.form.input}
                  />
                ) : (
                  <p className="dark:text-white">{coach.email || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className={dashboard.form.label}>
                  Phone
                </label>
                {editingProfile ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={dashboard.form.input}
                  />
                ) : (
                  <p className="dark:text-white">{coach.phone || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className={dashboard.form.label}>
                  Experience (years)
                </label>
                {editingProfile ? (
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className={dashboard.form.input}
                  />
                ) : (
                  <p className="dark:text-white">{coach.experience || 'Not set'} years</p>
                )}
              </div>
            </div>

            <div>
              <label className={dashboard.form.label}>
                Specialties
              </label>
              {editingProfile ? (
                <input
                  type="text"
                  value={formData.specialties.join(', ')}
                  onChange={(e) => handleSpecialtiesChange(e.target.value)}
                  placeholder="Weight Training, HIIT, Nutrition"
                  className={dashboard.form.input}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {coach.specialties && coach.specialties.length > 0 ? (
                    coach.specialties.map(specialty => (
                      <span key={specialty} className={`${components.badge} bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200`}>
                        {specialty}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No specialties set</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className={dashboard.form.label}>
                Bio
              </label>
              {editingProfile ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                  placeholder="Tell clients about yourself..."
                  className={dashboard.form.textarea}
                />
              ) : (
                <p className="dark:text-white">{coach.bio || 'No bio available'}</p>
              )}
            </div>

            {editingProfile && (
              <div className={dashboard.form.buttonGroup}>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed ${
                    loading ? 'cursor-wait' : ''
                  }`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className={`${dashboard.form.secondaryButton} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}