import React, { useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Utensils, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/PrimaryButton';
import { toast } from 'react-toastify';
import { forgotPassword } from '../../utils/auth';

function ForgotPassword() {
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await forgotPassword(values);
            if (response.status) {
                toast.success(response.data?.message);
                navigate("/verify-otp", {
                    state: { email: values.email, type: "reset-pass-otp" },
                });
            }
        } catch (e) {
            toast.error(e.response?.data?.message || e.response?.data?.error || "Something went wrong!");
        }
        finally {
            setSubmitting(false);
        }

    }

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

        // Create particles
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

            particles.forEach((particle, i) => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                const pulse = Math.sin(frame * 0.02 + i) * 0.5 + 1;
                particle.radius = particle.initialRadius * pulse;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(30, 58, 138, 0.4)';
                ctx.fill();

                particles.forEach((particle2, j) => {
                    if (i === j) return;
                    const dx = particle.x - particle2.x;
                    const dy = particle.y - particle2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(30, 58, 138, ${0.15 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(particle2.x, particle2.y);
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
            {/* Left Section with Animation */}
            <div className="hidden bg-gradient-to-br from-blue-900 to-blue-950 lg:flex lg:w-[45%] relative overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                <div className="relative z-10 flex flex-col items-start justify-center w-full h-full px-16">
                    <div className="flex items-center gap-3 mb-12">
                        <Utensils className="w-12 h-12 text-white" />
                        <span className="text-3xl font-bold text-white">WMS</span>
                    </div>

                    <h2 className="text-5xl font-bold text-white mb-8 leading-tight">
                        Streamline Your Restaurant Operations
                    </h2>

                    <div className="space-y-6">
                        {[{ icon: Lock, text: 'Secure Your Account' }].map((feature, index) => (
                            <div key={index} className="flex items-center gap-4 text-white/90">
                                <feature.icon className="w-6 h-6 text-blue-300" />
                                <span className="text-lg">{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Section with Form */}
            <div className="w-full lg:w-[55%] flex items-center md:justify-start justify-center px-6 lg:px-20 py-7 bg-white">
                <div className="w-full max-w-xl">
                    <div className="mb-12">
                        <h3 className="text-4xl font-bold text-gray-900 mb-3">Forgot Password</h3>
                        <p className="text-gray-600 text-lg">Enter your email to reset your password</p>
                    </div>

                    <Formik
                        initialValues={{
                            email: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    {[{ name: 'email', label: 'Work Email', type: 'email' }].map((field) => (
                                        <div key={field.name}>
                                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                                                {field.label}
                                            </label>
                                            <Field
                                                type={field.type}
                                                name={field.name}
                                                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg outline-none transition-all duration-200"
                                                placeholder={`Enter your ${field.label.toLowerCase()}`}
                                            />
                                            <ErrorMessage name={field.name} component="div" className="mt-1 text-sm text-red-600" />
                                        </div>
                                    ))}
                                </div>

                                <PrimaryButton
                                    type="submit"
                                    disabled={isSubmitting}
                                    text={isSubmitting ? 'Sending Reset OTP...' : 'Send Reset OTP'}
                                />
                            </Form>
                        )}
                    </Formik>

                    <p className="text-gray-600 mt-8">
                        Remember your password?{' '}
                        <Link to="/" className="text-blue-900 hover:text-blue-700 font-medium">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
