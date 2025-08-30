import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/food-ordering-app/api/user/register', {
        fullname: data.fullname,
        email: data.email,
        password: btoa(data.password),
        phone: data.phone,
        confirmPassword: btoa(data.confirm_password),
      });

      toast.success('Registration successful!');
      reset();
      setTimeout(() => navigate('/LoginForm'), 1500);
    } catch (error) {
      console.error('Registration error:', error);
      const msg = error?.response?.data?.error || 'Something went wrong.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>User Register</h1>

        <div className="input-group">
          <div className="input-field">
            <input
              type="text"
              placeholder="Full Name"
              autoComplete="name"
              {...register('fullname', {
                required: 'Full name is required',
                pattern: {
                  value: /^[a-zA-Z]+(?: [a-zA-Z]+)+$/,
                  message: 'Enter at least first and last name',
                },
              })}
            />
            {errors.fullname && <p className="error">{errors.fullname.message}</p>}
          </div>

          <div className="input-field">
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Invalid email format',
                },
              })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          <div className="input-field">
            <input
              type="text"
              placeholder="Phone Number"
              autoComplete="tel"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: 'Enter a valid phone number (10–15 digits)',
                },
              })}
            />
            {errors.phone && <p className="error">{errors.phone.message}</p>}
          </div>

          <div className="input-field">
            <input
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && <p className="error">{errors.password.message}</p>}
          </div>

          <div className="input-field">
            <input
              type="password"
              placeholder="Confirm Password"
              autoComplete="new-password"
              {...register('confirm_password', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />
            {errors.confirm_password && (
              <p className="error">{errors.confirm_password.message}</p>
            )}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <span className="spinner"></span> : 'Register'}
        </button>

        <p>
          Already have an account? <Link to="/LoginForm">Login here</Link>
        </p>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
