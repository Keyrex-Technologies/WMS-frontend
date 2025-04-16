import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getAllEmployees, removeEmployee } from "../../utils/employees";
import { toast } from "react-toastify";

const EmployeeManagement = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const filteredEmployees = employees.filter((emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        setDeletingId(id)
        try {
            const response = await removeEmployee(id)
            if (response.status) {
                toast.success(response.data.message)
                fetchAllEmployees();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.response?.data?.error || "Something went wrong!");
        } finally {
            setDeletingId(null)
        }
    };

    // const handleStatusToggle = (id) => {
    //     setEmployees((prevEmployees) =>
    //         prevEmployees.map((emp) =>
    //             emp.id === id
    //                 ? { ...emp, status: emp.status === "Active" ? "Inactive" : "Active" }
    //                 : emp
    //         )
    //     );
    // };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4
            }
        },
        exit: {
            opacity: 0,
            x: -50,
            transition: {
                duration: 0.3
            }
        }
    };

    const fetchAllEmployees = async () => {
        const response = await getAllEmployees();
        if (response.status) {
            console.log(response.data)
            setEmployees(response.data);
        }
    }

    useEffect(() => {
        fetchAllEmployees()
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full px-6"
        >
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
                <p className="text-gray-600 mt-2">View and manage all employees and their roles.</p>
            </motion.div>

            {/* Search and Add Employee */}
            <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
            >
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search employees..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/admin/add-employee")}
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg shadow whitespace-nowrap"
                >
                    + Add Employee
                </motion.button>
            </motion.div>

            {/* Employee Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Emp_ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th> */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Wage per Hour
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            <AnimatePresence>
                                {filteredEmployees.map((employee) => (
                                    <motion.tr
                                        key={employee.id}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        layout
                                        className={deletingId === employee.id ? "bg-red-50" : ""}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.employeeId}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"
                                                >
                                                    <span className="text-blue-600 font-medium">
                                                        {employee.name.charAt(0)}
                                                    </span>
                                                </motion.div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {employee.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.email}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <motion.span
                                                whileHover={{ scale: 1.05 }}
                                                className={`px-2 py-1 text-xs rounded-full capitalize ${employee.role === "employee"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : employee.role === "manager" ?
                                                        "bg-green-100 text-green-800" : "bg-red-100 text-red-500"
                                                    }`}
                                            >
                                                {employee.role}
                                            </motion.span>
                                        </td>
                                        {/* 
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <motion.span
                                                whileHover={{ scale: 1.05 }}
                                                className={`px-2 py-1 text-xs rounded-full capitalize ${employee.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {employee.status}
                                            </motion.span>
                                        </td> */}

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.wagePerHour}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex items-center gap-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`px-4 py-1.5 min-w-[120px] cursor-pointer rounded-lg font-medium shadow-sm transition-colors duration-200 
                                                            ${employee.status === 'inactive'
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                                                    onClick={() => navigate(`/admin/update-employee/${employee.employeeId}`)}
                                                >
                                                    {employee.status === "inactive" ? 'Approve' : 'Edit'}
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    disabled={deletingId === employee.employeeId}
                                                    className={`px-4 py-1.5 rounded-lg cursor-pointer font-medium shadow-sm transition-colors duration-200
                                                        ${deletingId === employee.employeeId
                                                            ? 'bg-red-200 text-red-400 cursor-not-allowed'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        }
                                                      `}
                                                    onClick={() => handleDelete(employee.employeeId)}
                                                >
                                                    {deletingId === employee.employeeId ? "Deleting" : "Delete"}
                                                </motion.button>

                                                {/* Optional: Status Toggle Button */}
                                                {/* <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-1.5 rounded-lg font-medium shadow-sm transition-colors duration-200 
        ${employee.status === 'active'
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-green-500 text-white hover:bg-green-600'}`}
      onClick={() => handleStatusToggle(employee.employeeId)}
    >
      {employee.status === "active" ? "Deactivate" : "Activate"}
    </motion.button> */}
                                            </div>
                                        </td>

                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-between items-center mt-6"
            >
                <div className="text-sm text-gray-500">
                    Showing 1 to {filteredEmployees.length} of {employees.length} entries
                </div>

                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 border cursor-pointer rounded-lg bg-white text-gray-700"
                    >
                        Previous
                    </motion.button>
                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 border cursor-pointer rounded-lg bg-blue-600 text-white"
                    >
                        1
                    </motion.button>
                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 border cursor-pointer rounded-lg bg-white text-gray-700"
                    >
                        Next
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EmployeeManagement;