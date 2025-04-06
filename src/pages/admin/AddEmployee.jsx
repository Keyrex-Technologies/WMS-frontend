import React, { useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cnic: '',
        phone: '',
        salary: '',
        role: 'Employee',
        joiningDate: '',
        address: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.cnic.trim()) {
            newErrors.cnic = 'CNIC is required';
        } else if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic)) {
            newErrors.cnic = 'CNIC must be in format 12345-1234567-1';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (!/^\d{11,15}$/.test(formData.phone)) {
            newErrors.phone = 'Phone must be 11-15 digits';
        }
        if (!formData.salary) newErrors.salary = 'Salary is required';
        if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            // Simulate API call
            setTimeout(() => {
                console.log('Employee added:', formData);
                setIsSubmitting(false);
                setSuccessMessage('Employee added successfully!');
                // Reset form after 2 seconds
                setTimeout(() => {
                    setFormData({
                        name: '',
                        email: '',
                        cnic: '',
                        phone: '',
                        salary: '',
                        role: 'Employee',
                        joiningDate: '',
                        address: ''
                    });
                    navigate(-1);
                    setSuccessMessage('');
                }, 2000);
            }, 1500);
        }
    };

    return (
        <div className="w-full px-6">
            <div className="max-w-4xl">
                <MdArrowBack className='cursor-pointer text-3xl mb-4' onClick={() => navigate(-1)} />

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Add New Employee</h1>
                    <p className="text-gray-600 mt-2">
                        Fill in the details to add a new employee to the system.
                    </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                        {successMessage}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="py-7">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="john@example.com"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        {/* CNIC */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cnic">
                                CNIC <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="cnic"
                                name="cnic"
                                value={formData.cnic}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cnic ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="12345-1234567-1"
                            />
                            {errors.cnic && <p className="mt-1 text-sm text-red-500">{errors.cnic}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="03001234567"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                        </div>

                        {/* Salary */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="salary">
                                Monthly Salary (PKR) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="salary"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.salary ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="50000"
                                min="0"
                            />
                            {errors.salary && <p className="mt-1 text-sm text-red-500">{errors.salary}</p>}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Employee">Employee</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </div>

                        {/* Joining Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="joiningDate">
                                Joining Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="joiningDate"
                                name="joiningDate"
                                value={formData.joiningDate}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.joiningDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.joiningDate && <p className="mt-1 text-sm text-red-500">{errors.joiningDate}</p>}
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
                                Address
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="House #123, Street #45, City"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-8 flex justify-end gap-4">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 rounded-lg text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;