import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/events');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/50">Start booking premium events</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`} placeholder="John Doe" />
            {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className={`input-field ${errors.email ? 'border-red-500' : ''}`} placeholder="you@example.com" />
            {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              className={`input-field ${errors.password ? 'border-red-500' : ''}`} placeholder="••••••••" />
            {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
              className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`} placeholder="••••••••" />
            {errors.confirmPassword && <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>}
          </div>

          {errors.submit && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{errors.submit}</p>
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3 text-base">
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/40">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-purple-400 font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;