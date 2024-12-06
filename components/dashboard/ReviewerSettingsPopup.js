import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadReviewerProfilePicture } from '../../services/apis';
import { toast } from 'react-toastify';
import Image from 'next/image';
import defaultProfilePicture from '/public/img/graphics/default.png';
import Popup from '../UI/PopupNormal';
import edit from '../../public/img/icons/edit.svg';
import {
  updateProfilePicture,
  updateUserDetails,
} from '../../store/reducers/user.reducer';

const ReviewerSettingsPopup = ({ show, onClose, user }) => {
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.user);

  const [file, setFile] = useState(null);

  const [activeEditField, setActiveEditField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        if (
          !event.target.closest('button') &&
          !event.target.closest('img[alt="edit"]')
        ) {
          setActiveEditField(null);
          setEditValue('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleImageUpload = async (e) => {
    const img = e.target.files[0];
    if (!img) return;

    if (img.size > 2097152) {
      toast.error('Maximum file size of 2mb allowed');
      return;
    }
    setFile(img);
    setIsUploading(true);
    try {
      const response = await uploadReviewerProfilePicture(user.uid, img);

      if (response?.data?.url) {
        dispatch(updateProfilePicture(response.data.url));
        toast.success('Profile picture updated successfully');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to update profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleEdit = (field, value) => {
    setActiveEditField(field);
    setEditValue(value || '');
  };

  const handleSubmit = (field) => {
    // Check if the value has actually changed
    if (editValue.trim() === (user[field] || '').trim()) {
      setActiveEditField(null);
      setEditValue('');
      return;
    }

    if (!editValue.trim()) {
      toast.error('Field cannot be empty');
      return;
    }

    if (field === 'email' && !validateEmail(editValue)) {
      toast.error('Please enter a valid email');
      return;
    }

    dispatch(updateUserDetails({ field, value: editValue }));
    setActiveEditField(null);
    setEditValue('');
    toast.success(`${field} updated successfully`);
  };

  const handleKeyPress = (e, field) => {
    if (e.key === 'Enter') {
      handleSubmit(field);
    }
  };

  const renderEditableField = (field, label, value) => {
    const isEditing = activeEditField === field;

    return (
      <div className="my-s4 flex flex-col items-start justify-start">
        <div className="flex w-full justify-between">
          <h3 className="w-1/3 text-lg">{label}:</h3>
          {!isEditing && (
            <Image
              src={edit}
              alt="edit"
              width={20}
              height={20}
              className="ml-2 cursor-pointer"
              onClick={() => handleEdit(field, value)}
            />
          )}
        </div>
        <div
          className="flex w-2/3 items-center justify-between"
          ref={isEditing ? inputRef : null}
        >
          {isEditing ? (
            <div className="flex flex-1 items-center gap-2">
              <input
                type={field === 'email' ? 'email' : 'text'}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, field)}
                className="border-gray-300 flex-1 rounded border px-2 py-1 text-black"
                autoFocus
              />
              <button
                onClick={() => handleSubmit(field)}
                className="bg-blue-500 hover:bg-blue-600 rounded px-3 py-1 text-white"
              >
                Save
              </button>
            </div>
          ) : (
            <p className={field === 'name' ? 'capitalize' : ''}>
              {value || 'Not set'}
            </p>
          )}
        </div>
      </div>
    );
  };

  const displayImage = () => {
    if (user.profilePicture) return user.profilePicture;
    return defaultProfilePicture;
  };

  return (
    <Popup show={show} onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto rounded-2xl bg-indigo-1 px-s4 py-s4 ">
        <div className="relative mx-auto mb-s3 h-[86px] w-[86px]">
          <Image
            src={displayImage()}
            alt="profile"
            height={86}
            width={86}
            className="rounded-full object-cover"
          />
          <label
            htmlFor="profilePicture"
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-0 opacity-0 transition duration-300 ease-in-out hover:bg-opacity-50 hover:opacity-100"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profilePicture"
            />
            <span className="font-semibold text-white">
              {isUploading ? 'Uploading...' : 'Change'}
            </span>
          </label>
        </div>

        {renderEditableField('name', 'Name', user.name)}
        {renderEditableField('email', 'Email', user.email)}
        {renderEditableField(
          'nativeLanguage',
          'Native Languages',
          user.nativeLanguage
        )}
        {renderEditableField('country', 'Country', user.country)}
      </div>
    </Popup>
  );
};

export default ReviewerSettingsPopup;
