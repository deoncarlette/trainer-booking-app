// components/ProfilePhotoUploader.jsx
import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // your Firestore instance
import { storage } from "../firebase"; // your Storage instance (exported from firebase.js)
import { dashboard } from "../utils/classnames";

export default function ProfilePhotoUploader({ coachId, currentPhoto, onPhotoUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !coachId) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}.${fileExtension}`;

      const storageRef = ref(storage, `profile-photos/${coachId}/${fileName}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update the coach document in Firestore
      await updateDoc(doc(db, "trainers", `coach_${coachId}`), {
        photoURL: downloadURL,
      });

      // Call the callback if provided (for immediate UI updates)
      if (onPhotoUpdate) {
        onPhotoUpdate(downloadURL);
      }

      console.log('Photo uploaded successfully:', downloadURL);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`photo-upload-${coachId}`}
            disabled={uploading}
          />
          <label
            htmlFor={`photo-upload-${coachId}`}
            className={`${dashboard.form.secondaryButton} cursor-pointer ${
              uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {uploading ? 'Uploading...' : 'Change Photo'}
          </label>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {uploading && (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 text-sm">Uploading photo...</p>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Supported formats: JPG, PNG, GIF (max 5MB)
      </p>
    </div>
  );
}