import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";

function Users() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    bio: '',
    password: '',
    confirmPassword: '',
    gender: '',
    country: '',
    agree: false,
  });

  const navigate = useNavigate();

  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const dobRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      fullName,
      email,
      phone,
      dob,
      password,
      confirmPassword,
      gender,
      country,
      agree,
    } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{7,}$/;

    // DOB Validation with specific error messages
    if (!dob) {
      alert("Please enter your date of birth.");
      dobRef.current.focus();
      return;
    }

    const dobDate = new Date(dob);
    const currentDate = new Date();
    const dobYear = dobDate.getFullYear();

    if (isNaN(dobDate.getTime())) {
      alert("Please enter a valid date of birth.");
      dobRef.current.focus();
      return;
    }

    if (dobYear < 1900) {
      alert("Please enter a valid year. Year must be 1900 or later.");
      dobRef.current.focus();
      return;
    }

    if (dobDate > currentDate) {
      alert("Date of birth cannot be in the future.");
      dobRef.current.focus();
      return;
    }

    if (
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !gender ||
      !country ||
      !agree
    ) {
      alert("Please fill all mandatory fields and accept terms.");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      emailRef.current.focus();
      return;
    }

    if (["test@example.com", "user@gmail.com"].includes(email)) {
      alert("This email is already registered.");
      emailRef.current.focus();
      return;
    }

    if (!phoneRegex.test(phone)) {
      alert("Phone number must be 10 digits.");
      phoneRef.current.focus();
      return;
    }

    if (!passwordRegex.test(password)) {
      alert("Password must be stronger.");
      passwordRef.current.focus();
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      confirmPasswordRef.current.focus();
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([formData]),
      });

      if (response.status === 409) {
        const message = await response.text();
        alert(message);
        if (message.toLowerCase().includes("email")) {
          emailRef.current.focus();
        } else if (message.toLowerCase().includes("phone")) {
          phoneRef.current.focus();
        }
        return;
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.text();
      alert(data);
      navigate("/login");

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        dob: '',
        address: '',
        bio: '',
        password: '',
        confirmPassword: '',
        gender: '',
        country: '',
        agree: false,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to register user.");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4 text-primary">User Registration</h2>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <form onSubmit={handleSubmit} className="border p-4 rounded shadow bg-light">
            <div className="mb-3">
              <label className="form-label">Full Name <span className="text-danger">*</span></label>
              <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Email address <span className="text-danger">*</span></label>
              <input ref={emailRef} type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number <span className="text-danger">*</span></label>
              <input ref={phoneRef} type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Date of Birth <span className="text-danger">*</span></label>
              <input
                ref={dobRef}
                type="date"
                className="form-control"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                min="1900-01-01"
                max={new Date().toISOString().split("T")[0]}
                style={{ cursor: 'pointer' }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Bio</label>
              <textarea className="form-control" name="bio" rows="3" value={formData.bio} onChange={handleChange}></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Address</label>
              <textarea className="form-control" name="address" rows="2" value={formData.address} onChange={handleChange}></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Password <span className="text-danger">*</span></label>
              <input ref={passwordRef} type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
              <input ref={confirmPasswordRef} type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label me-3">Gender <span className="text-danger">*</span></label>
              <label className="form-check form-check-inline" style={{ cursor: 'pointer' }}>
                <input className="form-check-input me-1" type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} required /> Male
              </label>
              <label className="form-check form-check-inline" style={{ cursor: 'pointer' }}>
                <input className="form-check-input me-1" type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} /> Female
              </label>
            </div>

            <div className="mb-3">
              <label className="form-label">Country <span className="text-danger">*</span></label>
              <select className="form-select" name="country" value={formData.country} onChange={handleChange} required>
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Italy">Italy</option>
                <option value="Spain">Spain</option>
                <option value="Brazil">Brazil</option>
                <option value="China">China</option>
                <option value="Japan">Japan</option>
                <option value="Russia">Russia</option>
                <option value="South Africa">South Africa</option>
                <option value="Singapore">Singapore</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Mexico">Mexico</option>
                <option value="UAE">United Arab Emirates</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="mb-3 form-check">
              <label className="form-check-label w-100">
                <input className="form-check-input me-2" type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} required />
                I agree to the terms and conditions <span className="text-danger">*</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100">Register</button>
            <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={() => navigate("/login")}>Already registered? Go to Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Users;