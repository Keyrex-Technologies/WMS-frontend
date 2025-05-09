import React, { useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { addNewEmployee } from '../../utils/employees';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

const AddEmployee = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        employeeId: '',
        cnic: '',
        phone: '',
        wagePerHour: '',
        dailyWorkingHours: '',
        weeklyWorkingDays: '',
        role: 'Employee',
        joiningDate: '',
        address: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        } else if (!/[a-z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one lowercase letter';
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        }
        if (!formData.employeeId.trim()) newErrors.employeeId = 'EmployeeId is required';
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
        if (!formData.wagePerHour) newErrors.wagePerHour = 'Wage per hour is required';
        if (!formData.dailyWorkingHours) newErrors.dailyWorkingHours = 'Daily working hours is required';
        if (!formData.weeklyWorkingDays) newErrors.weeklyWorkingDays = 'Weekly working days is required';
        if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';

        // Validate working hours constraints
        if (formData.dailyWorkingHours && (formData.dailyWorkingHours < 1 || formData.dailyWorkingHours > 24)) {
            newErrors.dailyWorkingHours = 'Must be between 1-24 hours';
        }
        if (formData.weeklyWorkingDays && (formData.weeklyWorkingDays < 1 || formData.weeklyWorkingDays > 7)) {
            newErrors.weeklyWorkingDays = 'Must be between 1-7 days';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            if (validateForm()) {
                setIsSubmitting(true);

                const employeeData = {
                    employeeId: formData.employeeId,
                    name: formData.name,
                    status: 'active',
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phone,
                    cnic: formData.cnic,
                    role: formData.role,
                    wagePerHour: formData.wagePerHour,
                    weeklyWorkingDays: formData.weeklyWorkingDays,
                    joiningDate: formData.joiningDate,
                    address: formData.address,
                    dailyWorkingHours: formData.dailyWorkingHours,
                };

                const response = await addNewEmployee(employeeData);
                if (response.status) {
                    console.log(response.data.message)
                    setIsSubmitting(false);
                    toast.success(response.data.message);
                    setFormData({
                        name: '',
                        email: '',
                        cnic: '',
                        phone: '',
                        wagePerHour: '',
                        dailyWorkingHours: '',
                        weeklyWorkingDays: '',
                        role: 'Employee',
                        joiningDate: '',
                        address: ''
                    });
                    navigate(-1);
                }
            }
        } catch (e) {
            toast.error(e.response?.data?.message || e.response?.data?.error || "Something went wrong!");
        }
        finally {
            setIsSubmitting(false);
        }
    };

    // const monthlySalary = calculateMonthlySalary(
    //     formData.wagePerHour,
    //     formData.dailyWorkingHours,
    //     formData.weeklyWorkingDays
    // );

    // const calculateMonthlySalary = (wagePerHour, dailyHours, weeklyDays) => {
    //     const weeklyHours = dailyHours * weeklyDays;
    //     const monthlyHours = weeklyHours * 4;
    //     return wagePerHour * monthlyHours;
    // };

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

                        {/* Employee Id */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="employeeId">
                                Employee Id <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="employeeId"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.employeeId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="EMP-001"
                            />
                            {errors.employeeId && <p className="mt-1 text-sm text-red-500">{errors.employeeId}</p>}
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

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="******"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
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

                        {/* Wage Per Hour */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="wagePerHour">
                                Wage Per Hour (£) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="wagePerHour"
                                name="wagePerHour"
                                value={formData.wagePerHour}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.wagePerHour ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="500"
                                min="0"
                                step="0.01"
                            />
                            {errors.wagePerHour && <p className="mt-1 text-sm text-red-500">{errors.wagePerHour}</p>}
                        </div>

                        {/* Daily Working Hours */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dailyWorkingHours">
                                Daily Working Hours <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="dailyWorkingHours"
                                name="dailyWorkingHours"
                                value={formData.dailyWorkingHours}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dailyWorkingHours ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="8"
                                min="1"
                                max="24"
                            />
                            {errors.dailyWorkingHours && <p className="mt-1 text-sm text-red-500">{errors.dailyWorkingHours}</p>}
                        </div>

                        {/* Weekly Working Days */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="weeklyWorkingDays">
                                Weekly Working Days <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="weeklyWorkingDays"
                                name="weeklyWorkingDays"
                                value={formData.weeklyWorkingDays}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.weeklyWorkingDays ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="5"
                                min="1"
                                max="7"
                            />
                            {errors.weeklyWorkingDays && <p className="mt-1 text-sm text-red-500">{errors.weeklyWorkingDays}</p>}
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
                                <option value="employee">Employee</option>
                                <option value="manager">Manager</option>
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
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 border border-gray-300 cursor-pointer rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 rounded-lg cursor-pointer text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
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