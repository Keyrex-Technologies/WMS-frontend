import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Utensils, Lock } from 'lucide-react';
import PrimaryButton from '../../components/PrimaryButton';

function VerifyOTP() {
    const canvasRef = useRef(null);
    const inputRefs = useRef([]);
    const [otp, setOtp] = useState(Array(6).fill(''));

    const validationSchema = Yup.object({
        otp: Yup.string()
            .matches(/^\d{6}$/, 'OTP must be a 6-digit number')
            .required('OTP is required'),
    });

    const handleChange = (e, index) => {
        const { value } = e.target;
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value !== '' && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (otp[index] === '') {
                if (index > 0) {
                    const newOtp = [...otp];
                    newOtp[index - 1] = '';
                    setOtp(newOtp);
                    inputRefs.current[index - 1]?.focus();
                }
            } else {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }
    };

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
            {/* Left Section */}
            <div className="hidden bg-gradient-to-br from-blue-900 to-blue-950 lg:flex lg:w-[45%] relative overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                <div className="relative z-10 flex flex-col items-start justify-center w-full h-full px-16">
                    <div className="flex items-center gap-3 mb-12">
                        <Utensils className="w-12 h-12 text-white" />
                        <span className="text-3xl font-bold text-white">RestaurantPro</span>
                    </div>
                    <h2 className="text-5xl font-bold text-white mb-8 leading-tight">
                        Verify Your Identity
                    </h2>
                    <div className="space-y-6">
                        {[{ icon: Lock, text: 'OTP Verification' }].map((feature, index) => (
                            <div key={index} className="flex items-center gap-4 text-white/90">
                                <feature.icon className="w-6 h-6 text-blue-300" />
                                <span className="text-lg">{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-[55%] flex items-center md:justify-start justify-center px-6 lg:px-20 py-7 bg-white">
                <div className="w-full max-w-xl">
                    <div className="mb-12">
                        <h3 className="text-4xl font-bold text-gray-900 mb-3">Verify OTP</h3>
                        <p className="text-gray-600 text-lg">Enter the 6-digit code sent to your email</p>
                    </div>

                    <Formik
                        initialValues={{ otp: otp.join('') }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            console.log('OTP Entered:', otp.join(''));
                            setTimeout(() => {
                                alert('OTP Verified!');
                                setSubmitting(false);
                            }, 500);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-6">
                                <div className="flex gap-3">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            className="w-12 h-12 border border-gray-300 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            value={digit}
                                            onChange={(e) => handleChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            id={`otp-${index}`}
                                        />
                                    ))}
                                </div>
                                {otp.join('').length !== 6 && (
                                    <div className="text-sm text-red-600">OTP must be a 6-digit number</div>
                                )}

                                <PrimaryButton
                                    type="submit"
                                    disabled={isSubmitting || otp.join('').length !== 6}
                                    text={isSubmitting ? 'Verifying...' : 'Verify OTP'}
                                />
                            </Form>
                        )}
                    </Formik>

                    <p className="text-gray-600 mt-8">
                        Didn’t receive the code?{' '}
                        <span className="text-blue-900 hover:text-blue-700 font-medium cursor-pointer">
                            Resend
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default VerifyOTP;
