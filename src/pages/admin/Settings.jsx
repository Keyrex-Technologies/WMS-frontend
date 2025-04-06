import React, { useState } from 'react';
import { FiSave, FiLock, FiMapPin, FiClock, FiUsers, FiDollarSign, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const [settings, setSettings] = useState({
    business: {
      name: "Restaurant Delight",
      address: "123 Main Street, Food City",
      contact: "03001234567",
      currency: "PKR",
      fiscalYearStart: "2023-07-01",
      timezone: "Asia/Karachi"
    },
    attendance: {
      geofenceRadius: 100,
      workHours: 8,
      lateThreshold: 15,
      overtimeRate: 1.5
    },
    payroll: {
      payday: 5,
      taxRate: 10,
      defaultPaymentMethod: "Bank Transfer"
    },
    security: {
      passwordExpiry: 90,
      failedAttempts: 5,
      twoFactorAuth: true
    }
  });

  const [activeTab, setActiveTab] = useState('business');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Settings saved:", settings);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure your workforce management system
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
            {[
              { id: 'business', icon: <FiUsers />, label: 'Business' },
              { id: 'attendance', icon: <FiClock />, label: 'Attendance' },
              { id: 'payroll', icon: <FiDollarSign />, label: 'Payroll' },
              { id: 'security', icon: <FiLock />, label: 'Security' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span className="whitespace-nowrap">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="w-1 h-1 bg-blue-500 rounded-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-6"
            >
              {/* Business Settings */}
              {activeTab === 'business' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <FiUsers size={20} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Business Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Business Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={settings.business.name}
                        onChange={(e) => handleChange(e, 'business')}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Business Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={settings.business.address}
                        onChange={(e) => handleChange(e, 'business')}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        name="contact"
                        value={settings.business.contact}
                        onChange={(e) => handleChange(e, 'business')}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Currency
                      </label>
                      <div className="relative">
                        <select
                          name="currency"
                          value={settings.business.currency}
                          onChange={(e) => handleChange(e, 'business')}
                          className="w-full p-3 appearance-none border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                        >
                          <option value="PKR">PKR (Pakistani Rupee)</option>
                          <option value="USD">USD (US Dollar)</option>
                          <option value="EUR">EUR (Euro)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          <FiChevronRight className="transform rotate-90" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Fiscal Year Start
                      </label>
                      <input
                        type="date"
                        name="fiscalYearStart"
                        value={settings.business.fiscalYearStart}
                        onChange={(e) => handleChange(e, 'business')}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Timezone
                      </label>
                      <div className="relative">
                        <select
                          name="timezone"
                          value={settings.business.timezone}
                          onChange={(e) => handleChange(e, 'business')}
                          className="w-full p-3 appearance-none border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                        >
                          <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">America/New York (EST)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          <FiChevronRight className="transform rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Attendance Settings */}
              {activeTab === 'attendance' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <FiClock size={20} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Attendance Settings</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Geofence Radius: {settings.attendance.geofenceRadius}m
                      </label>
                      <input
                        type="range"
                        name="geofenceRadius"
                        min="50"
                        max="500"
                        value={settings.attendance.geofenceRadius}
                        onChange={(e) => handleChange(e, 'attendance')}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Employees must be within this radius to check-in
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Standard Work Hours (per day)
                      </label>
                      <input
                        type="number"
                        name="workHours"
                        min="1"
                        max="24"
                        value={settings.attendance.workHours}
                        onChange={(e) => handleChange(e, 'attendance')}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Late Threshold (minutes)
                      </label>
                      <input
                        type="number"
                        name="lateThreshold"
                        min="1"
                        max="120"
                        value={settings.attendance.lateThreshold}
                        onChange={(e) => handleChange(e, 'attendance')}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        After this many minutes, employee is marked late
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Overtime Rate (multiplier)
                      </label>
                      <input
                        type="number"
                        name="overtimeRate"
                        min="1"
                        max="3"
                        step="0.1"
                        value={settings.attendance.overtimeRate}
                        onChange={(e) => handleChange(e, 'attendance')}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Standard salary × this rate for overtime hours
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payroll Settings */}
              {activeTab === 'payroll' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <FiDollarSign size={20} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Payroll Settings</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Payday (day of month)
                      </label>
                      <input
                        type="number"
                        name="payday"
                        min="1"
                        max="31"
                        value={settings.payroll.payday}
                        onChange={(e) => handleChange(e, 'payroll')}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        name="taxRate"
                        min="0"
                        max="30"
                        value={settings.payroll.taxRate}
                        onChange={(e) => handleChange(e, 'payroll')}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Default Payment Method
                      </label>
                      <div className="relative">
                        <select
                          name="defaultPaymentMethod"
                          value={settings.payroll.defaultPaymentMethod}
                          onChange={(e) => handleChange(e, 'payroll')}
                          className="w-full p-3 appearance-none border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                        >
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Cash">Cash</option>
                          <option value="Check">Check</option>
                          <option value="Mobile Payment">Mobile Payment</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          <FiChevronRight className="transform rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <FiLock size={20} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Security Settings</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Password Expiry (days)
                      </label>
                      <input
                        type="number"
                        name="passwordExpiry"
                        min="30"
                        max="365"
                        value={settings.security.passwordExpiry}
                        onChange={(e) => handleChange(e, 'security')}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Users must change password after this period
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Failed Login Attempts Before Lockout
                      </label>
                      <input
                        type="number"
                        name="failedAttempts"
                        min="1"
                        max="10"
                        value={settings.security.failedAttempts}
                        onChange={(e) => handleChange(e, 'security')}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <input
                        type="checkbox"
                        name="twoFactorAuth"
                        id="twoFactorAuth"
                        checked={settings.security.twoFactorAuth}
                        onChange={(e) => handleChange(e, 'security')}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all"
                      />
                      <label htmlFor="twoFactorAuth" className="block text-sm text-gray-700">
                        Require Two-Factor Authentication
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Save Button & Status */}
          <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-between items-center">
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm"
                >
                  Settings saved successfully!
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button
              type="submit"
              disabled={isSaving}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white shadow-sm ${
                isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } transition-all`}
            >
              <FiSave />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;