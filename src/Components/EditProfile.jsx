import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditProfile() {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    profilePic: '',
    deliveryAddress: {
      line1: '',
      line2: '',
      city: '',
      pincode: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const getTokenFromCookie = () => {
    const match = document.cookie.match(/token=([^;]+)/);
    return match ? match[1] : null;
  };

  const userId = getTokenFromCookie();

  useEffect(() => {
    if (!userId) {
      toast.error('Please login first.');
      navigate('/LoginForm');
      return;
    }

    axios
      .get(`http://localhost:5000/food-ordering-app/api/user/profile/${userId}`)
      .then((res) => {
        setForm({
          ...res.data,
          deliveryAddress: res.data.deliveryAddress || {
            line1: '',
            line2: '',
            city: '',
            pincode: '',
          },
        });
        setPreview(res.data.profilePic || null);
        setLoading(false);
      })
      .catch((err) => {
        toast.error('Failed to fetch user data');
        console.error(err);
        setLoading(false);
      });
  }, [navigate, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      deliveryAddress: {
        ...prev.deliveryAddress,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, profilePic: reader.result }));
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/food-ordering-app/api/user/profile/${userId}`,
        form
      );
      toast.success('Profile updated successfully!');
      setTimeout(() => navigate('/Accounts'), 1500); // Give time for toast to show
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="account-container">
      <form onSubmit={handleSubmit} className="account-form">
        {preview && <img src={preview} alt="Profile Preview" className="profile-preview" />}
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <input
          type="text"
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
        />

        <input
          type="text"
          name="line1"
          value={form.deliveryAddress.line1}
          onChange={handleAddressChange}
          placeholder="Address Line 1"
          required
        />
        <input
          type="text"
          name="line2"
          value={form.deliveryAddress.line2}
          onChange={handleAddressChange}
          placeholder="Address Line 2"
        />
        <input
          type="text"
          name="city"
          value={form.deliveryAddress.city}
          onChange={handleAddressChange}
          placeholder="City"
          required
        />
        <input
          type="text"
          name="pincode"
          value={form.deliveryAddress.pincode}
          onChange={handleAddressChange}
          placeholder="Pincode"
          required
        />

        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate('/Accounts')}>Cancel</button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
