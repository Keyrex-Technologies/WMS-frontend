import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Utensils, ShieldCheck, EyeOff, Eye } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/PrimaryButton';
import { resetPassword } from '../../utils/auth';
import { toast } from 'react-toastify';

function ResetPassword() {
    const canvasRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location?.state?.email;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prev => !prev);
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const data = {
                email: email,
                password: values.password
            }
            const response = await resetPassword(data);
            if (response.status) {
                toast.success(response.data?.message);
                navigate("/");
            }
        } catch (e) {
            toast.error(e.response?.data?.message || e.response?.data?.error || e.message || "Something went wrong!");
        }
        finally {
            setSubmitting(false);
        }
    }

    const validationSchema = Yup.object({
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = Array.from({ length: 50 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            initialRadius: Math.random() * 2 + 1,
        }));

        let animationFrameId;
        let frame = 0;

        const animate = () => {
            frame++;
            ctx.fillStyle = 'rgba(30, 58, 138, 0.03)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                const pulse = Math.sin(frame * 0.02 + i) * 0.5 + 1;
                p.radius = p.initialRadius * pulse;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(30, 58, 138, 0.4)';
                ctx.fill();

                particles.forEach((p2, j) => {
                    if (i === j) return;
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(30, 58, 138, ${0.15 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="min-h-screen flex">
            {/* Left Animation Panel */}
            <div className="hidden bg-gradient-to-br from-blue-900 to-blue-950 lg:flex lg:w-[45%] relative overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                <div className="relative z-10 flex flex-col items-start justify-center w-full h-full px-16">
                    <div className="flex items-center gap-3 mb-12">
                        <Utensils className="w-12 h-12 text-white" />
                        <span className="text-3xl font-bold text-white">WMS</span>
                    </div>
                    <h2 className="text-5xl font-bold text-white mb-8 leading-tight">
                        Secure Your Account
                    </h2>
                    <div className="space-y-6">
                        {[{ icon: ShieldCheck, text: 'Reset your password safely' }].map((feature, index) => (
                            <div key={index} className="flex items-center gap-4 text-white/90">
                                <feature.icon className="w-6 h-6 text-blue-300" />
                                <span className="text-lg">{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Reset Form */}
            <div className="w-full lg:w-[55%] flex items-center md:justify-start justify-center px-6 lg:px-20 py-7 bg-white">
                <div className="w-full max-w-xl">
                    <div className="mb-12">
                        <h3 className="text-4xl font-bold text-gray-900 mb-3">Reset Password</h3>
                        <p className="text-gray-600 text-lg">Set a new password to regain access</p>
                    </div>

                    <Formik
                        initialValues={{
                            password: '',
                            confirmPassword: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    {[
                                        { name: 'password', label: 'New Password', type: 'password' },
                                        { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
                                    ].map((field) => (
                                        <div key={field.name}>
                                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                                                {field.label}
                                            </label>

                                            <div className="relative">
                                                {field.name === "password" ? (
                                                    <>
                                                        <Field
                                                            type={showPassword ? 'text' : 'password'}
                                                            name="password"
                                                            placeholder={`Enter your ${field.label.toLowerCase()}`}
                                                            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg outline-none transition-all duration-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={togglePasswordVisibility}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                        >
                                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Field
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            name="confirmPassword"
                                                            placeholder={`Enter your ${field.label.toLowerCase()}`}
                                                            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg outline-none transition-all duration-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={toggleConfirmPasswordVisibility}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                        >
                                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            <ErrorMessage name={field.name} component="div" className="mt-1 text-sm text-red-600" />
                                        </div>
                                    ))}
                                </div>

                                <PrimaryButton
                                    type="submit"
                                    disabled={isSubmitting}
                                    text={isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                                />
                            </Form>
                        )}
                    </Formik>

                    <p className="text-gray-600 mt-8">
                        Remembered your password?{' '}
                        <Link to="/" className="text-blue-900 hover:text-blue-700 font-medium">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div >
    );
}

export default ResetPassword;
