import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiSave, FiMail, FiPhone, FiMapPin, FiCalendar, FiUser, FiLock } from 'react-icons/fi';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Sarah Johnson',
    position: 'Operations Manager', // Admin-assigned (non-editable)
    department: 'Human Resources', // Admin-assigned (non-editable)
    email: 's.johnson@company.com',
    phone: '+92 300 1234567',
    address: '123 Business Ave, Islamabad, Pakistan',
    hireDate: '2020-05-15', // Admin-assigned (non-editable)
    bio: 'Experienced HR professional with 8+ years in talent management and employee relations.'
  });

  const nonEditableFields = ['position', 'department', 'hireDate'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Prevent editing of admin-assigned fields
    if (!nonEditableFields.includes(name)) {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // API call to save editable fields would go here
  };

  const renderField = (name, value) => {
    if (nonEditableFields.includes(name)) {
      return (
        <div className="flex items-center gap-2">
          <p className="font-medium">{value}</p>
          <FiLock className="text-gray-400" size={14} />
        </div>
      );
    }
    
    return isEditing ? (
      <input
        type={name === 'email' ? 'email' : name === 'hireDate' ? 'date' : 'text'}
        name={name}
        value={value}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    ) : (
      <p className="font-medium">{value}</p>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl sm:px-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <motion.h1 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl md:text-3xl font-bold text-gray-800"
        >
          My Profile
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isEditing ? 'bg-green-600' : 'bg-blue-600'} text-white`}
        >
          {isEditing ? <FiSave /> : <FiEdit />}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </motion.button>
      </div>

      {/* Admin Notice */}
      {isEditing && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6"
        >
          <div className="flex items-center">
            <FiLock className="text-yellow-500 mr-2" />
            <p className="text-yellow-700">
              Some fields are managed by admin and cannot be edited
            </p>
          </div>
        </motion.div>
      )}

      {/* Profile Card */}
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="md:flex">
          {/* Profile Picture */}
          <motion.div 
            whileHover={isEditing ? { scale: 1.02 } : {}}
            className="bg-blue-50 p-6 md:p-8 flex flex-col items-center justify-center md:w-1/3 relative"
          >
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-5xl font-bold mb-4">
                {profile.name.charAt(0)}
              </div>
            </div>
            
            <motion.h2 
              className="text-xl font-bold text-gray-800 mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="text-center p-1 border border-gray-300 rounded-md"
                />
              ) : (
                profile.name
              )}
            </motion.h2>
            <div className="flex items-center gap-1">
              <p className="text-blue-600 font-medium text-center">{profile.position}</p>
              {isEditing && <FiLock className="text-gray-400" size={14} />}
            </div>
          </motion.div>

          {/* Profile Details */}
          <div className="p-6 md:p-8 md:w-2/3">
            <div className="space-y-4">
              {/* Department */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <FiUser />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Department</p>
                  <div className="flex items-center gap-2">
                    {renderField('department', profile.department)}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <FiMail />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Email</p>
                  {renderField('email', profile.email)}
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <FiPhone />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Phone</p>
                  {renderField('phone', profile.phone)}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <FiMapPin />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Address</p>
                  {renderField('address', profile.address)}
                </div>
              </div>

              {/* Hire Date */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <FiCalendar />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Hire Date</p>
                  <div className="flex items-center gap-2">
                    {renderField('hireDate', new Date(profile.hireDate).toLocaleDateString())}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2">About</p>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="text-gray-700">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;