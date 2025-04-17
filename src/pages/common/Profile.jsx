import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiEdit,
  FiSave,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock
} from 'react-icons/fi';
import Cookies from 'js-cookie';
import { getProfile, updateProfile } from '../../utils/profile';
import { MdPermIdentity } from 'react-icons/md';
import { toast } from 'react-toastify';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  const [profile, setProfile] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    address: '',
    hireDate: '',
    cnic: '',
  });

  const nonEditableFields = ['position', 'hireDate'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (!nonEditableFields.includes(name)) {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        name: profile.name,
        phoneNumber: profile.phone,
        address: profile.address,
        cnic: profile.cnic,
      };

      const response = await updateProfile(user._id, updatedData);
      if (response.status) {
        toast.success(response.data.message);
        fetchProfile();
        setIsEditing(false);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Something went wrong!");
    }
  };

  const renderField = (name, value) => {
    const isLocked = nonEditableFields.includes(name);
    const isEmail = name === 'email';

    if (isLocked) {
      return (
        <div className="flex items-center gap-2">
          <p className="font-medium">{value}</p>
          <FiLock className="text-gray-400" size={14} />
        </div>
      );
    }

    return isEditing ? (
      <input
        type={isEmail ? 'email' : 'text'}
        name={name}
        value={value}
        disabled={isEmail}
        onChange={handleInputChange}
        className={`w-full p-2 border border-gray-300 rounded-md ${isEmail ? 'opacity-50' : ''}`}
      />
    ) : (
      <p className="font-medium">{value}</p>
    );
  };

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const response = await getProfile(user._id);
      if (response.status) {
        const data = response.data;
        setProfile({
          name: data.name || '',
          position: data.role || '',
          email: data.email || '',
          phone: data.phoneNumber || '',
          address: data.address || '',
          hireDate: data.joiningDate || '',
          cnic: data.cnic || '',
        });
      }
    } catch (error) {
      toast.error("Failed to load profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl sm:px-6"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Profile</h1>
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

      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="md:flex">
          <div className="bg-blue-50 p-6 md:p-8 flex flex-col items-center justify-center md:w-1/3">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-5xl font-bold mb-4">
              {profile.name.charAt(0)}
            </div>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="text-center p-1 border border-gray-300 rounded-md font-bold"
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-800 text-center">
                {profile.name}
              </h2>
            )}
            <div className="flex items-center gap-1">
              <p className="text-blue-600 font-medium text-center capitalize">{profile.position}</p>
              {isEditing && <FiLock className="text-gray-400" size={14} />}
            </div>
          </div>

          <div className="p-6 md:p-8 md:w-2/3 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FiMail /></div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                {renderField('email', profile.email)}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FiPhone /></div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Phone</p>
                {renderField('phone', profile.phone)}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><MdPermIdentity /></div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">CNIC</p>
                {renderField('cnic', profile.cnic)}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FiMapPin /></div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Address</p>
                {renderField('address', profile.address)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
