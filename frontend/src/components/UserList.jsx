import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaEye,
  FaSpinner,
  FaUserPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const UserData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [availableRoles, setAvailableRoles] = useState([]);

  // Styles for required fields
  const requiredFieldStyle = {
    position: 'relative',
  };

  const requiredLabelStyle = {
    color: '#374151',
    fontSize: '0.75rem',
    fontWeight: '600',
    marginBottom: '4px',
    display: 'block'
  };

  const requiredAsteriskStyle = {
    color: '#dc2626',
    marginLeft: '4px',
    fontWeight: 'bold'
  };

  const inputStyle = (hasValue, hasError = false) => ({
    padding: '8px 12px',
    fontSize: '0.875rem',
    borderRadius: '4px',
    border: hasError ? '1px solid #dc2626' : hasValue ? '1px solid #d1d5db' : '1px solid #dc2626',
    backgroundColor: hasError ? '#fef2f2' : hasValue ? 'white' : '#fef2f2',
    minWidth: '160px',
    width: '100%'
  });

  const errorMessageStyle = {
    color: '#dc2626',
    fontSize: '0.75rem',
    marginTop: '4px',
    fontWeight: '500'
  };

  const getData = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/get/all");
      const json = await res.json();
      setUsers(json.users || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRoles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/get/roles");
      const json = await res.json();
      setAvailableRoles(json.roles || []);
    } catch (err) {
      console.error("Fetch roles error:", err.message);
      setAvailableRoles([]);
    }
  };

  useEffect(() => {
    getData();
    getRoles();
  }, []);

  // Updated formatDateTime function to return separate date and time (same as Role component)
  const formatDateTime = (dateStr) => {
    if (!dateStr) return { date: "N/A", time: "N/A" };
    const date = new Date(dateStr);
    
    const dateOnly = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    
    const timeOnly = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    
    return { date: dateOnly, time: timeOnly };
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e, userId) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);

    setEditedUser({ ...editedUser, phone: numericValue });

    if (numericValue && !validatePhone(numericValue)) {
      setValidationErrors((prev) => ({
        ...prev,
        [`phone_${userId}`]: "Phone number must be exactly 10 digits",
      }));
    } else {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`phone_${userId}`];
        return newErrors;
      });
    }
  };

  const actionBtnStyle = {
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "0.75rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  };

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setEditedUser({
      fullName: user.fullName || "",
      phone: user.phone || "",
      dob: user.dob ? user.dob.split("T")[0] : "",
      role: user.role || '',
      address: user.address || "",
      bio: user.bio || "",
      gender: user.gender || "",
      country: user.country || "",
    });
    setValidationErrors({});
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    setEditedUser({});
    setValidationErrors({});
  };

  const handleSaveEdit = async (userId) => {
    const requiredFields = ["fullName", "phone", "dob", "role", "gender", "country"];
    const fieldLabels = {
      fullName: "Full Name",
      phone: "Phone",
      dob: "Date of Birth", 
      role: "Role",
      gender: "Gender",
      country: "Country"
    };
    
    const emptyFields = requiredFields.filter(
      (field) => !editedUser[field]?.toString().trim()
    );
    
    if (emptyFields.length > 0) {
      const missingLabels = emptyFields.map(field => fieldLabels[field]);
      alert(`Please fill all required fields: ${missingLabels.join(", ")}`);
      return;
    }

    // Validate DOB
    const dobValue = editedUser.dob;
    const dobDate = new Date(dobValue);
    const currentDate = new Date();
    const dobYear = dobDate.getFullYear();

    if (isNaN(dobDate.getTime())) {
      alert("Please enter a valid date of birth.");
      return;
    }

    if (dobYear < 1900) {
      alert("Year must be 1900 or later.");
      return;
    }

    if (dobDate > currentDate) {
      alert("Date of birth cannot be in the future.");
      return;
    }

    const phoneError = validationErrors[`phone_${userId}`];
    if (phoneError) {
      alert("Please fix validation errors before saving.");
      return;
    }

    if (editedUser.phone && !validatePhone(editedUser.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    setActionLoading(true);
    try {
      const updateData = {
        _id: userId,
        fullName: editedUser.fullName,
        phone: editedUser.phone,
        dob: editedUser.dob,
        role: editedUser.role,
        address: editedUser.address || "",
        bio: editedUser.bio || "",
        gender: editedUser.gender,
        country: editedUser.country,
      };

      const res = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) {
        const errorText = await res.text();
        if (
          errorText.toLowerCase().includes("no changes") ||
          errorText.toLowerCase().includes("not modified")
        ) {
          handleCancelEdit();
          return;
        }
        throw new Error(errorText);
      }

      await getData();
      handleCancelEdit();
      alert("User updated successfully!");
    } catch (err) {
      console.error("Update failed:", err.message);
      alert(`Update failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setActionLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: userId }),
      });
      if (!res.ok) throw new Error(await res.text());
      await getData();
    } catch (err) {
      console.error("Delete failed:", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
      {/* Header */}
      <div className="mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              width: 48,
              height: 48,
              backgroundColor: "#3b82f6",
              borderRadius: 12,
              color: "white",
            }}
            className="d-flex align-items-center justify-content-center">
            <FaUsers size={24} />
          </div>
          <div>
            <h2 className="mb-1" style={{ color: "#1f2937", fontWeight: 700 }}>
              User Management
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
              View and manage all registered users
            </p>
          </div>
        </div>
        <button
          className="btn d-flex align-items-center gap-2"
          onClick={getData}
          disabled={loading}
          style={{
            backgroundColor: "#10b981",
            color: "white",
            borderRadius: 10,
            padding: "12px 24px",
            fontWeight: 600,
            fontSize: "0.9rem",
            boxShadow: "0 2px 4px rgba(16,185,129,0.2)",
          }}
        >
          {loading ? (
            <><FaSpinner className="spinner-border spinner-border-sm" />{" "}
              Loading...</>
          ) : (
            <><FaEye size={16} /> Load Users</>
          )}
        </button>
      </div>

      {/* Total Users Card */}
      {users.length > 0 && (
        <div
          className="mb-4 p-3 d-flex align-items-center gap-3"
          style={{
            backgroundColor: "#f0f9ff",
            border: "1px solid #bae6fd",
            borderRadius: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#0ea5e9",
              borderRadius: 8,
              color: "white",
            }}
            className="d-flex align-items-center justify-content-center"
          >
            <FaUserPlus size={18} />
          </div>
          <div>
            <h6 className="mb-0" style={{ color: "#0c4a6e", fontWeight: 600 }}>
              Total Registered Users
            </h6>
            <p
              className="mb-0"
              style={{ color: "#075985", fontSize: "1.25rem", fontWeight: 700 }}
            >
              {users.length}
            </p>
          </div>
        </div>
      )}

      {/* Table or Empty State */}
      {users.length > 0 ? (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
            overflowX: "auto",
          }}
        >
          <table className="table table-hover mb-0" style={{ minWidth: 1320 }}>
            <thead>
              <tr
                style={{
                  backgroundColor: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                {[
                  "Actions",
                  "Full Name",
                  "Email",
                  "Phone",
                  "Date of Birth",
                  "Role",
                  "Gender",
                  "Country",
                  "Address",
                  "Bio",
                  "Registered On",
                ].map((head, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "16px 20px",
                      color: "#374151",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const registeredDateTime = formatDateTime(u.registered_on);
                
                return (
                  <tr
                    key={u._id}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f8fafc")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td style={{ padding: "16px 20px" }}>
                      <div className="d-flex gap-2">
                        {editUserId === u._id ? (
                          <>
                            <button
                              disabled={actionLoading}
                              onClick={() => handleSaveEdit(u._id)}
                              style={{
                                ...actionBtnStyle,
                                backgroundColor: "#d1fae5",
                                color: "#047857",
                                border: "1px solid #a7f3d0",
                              }}
                              title="Save"
                            >
                              {actionLoading ? "Saving..." : "Save"}
                            </button>
                            <button
                              disabled={actionLoading}
                              onClick={handleCancelEdit}
                              style={{
                                ...actionBtnStyle,
                                backgroundColor: "#f3f4f6",
                                color: "#374151",
                                border: "1px solid #d1d5db",
                              }}
                              title="Cancel"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              style={{
                                ...actionBtnStyle,
                                backgroundColor: "#f8fafc",
                                color: "#059669",
                                border: "1px solid #d1fae5",
                              }}
                              onClick={() => handleEditClick(u)}
                              title="Edit User"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              style={{
                                ...actionBtnStyle,
                                backgroundColor: "#fef2f2",
                                color: "#dc2626",
                                border: "1px solid #fecaca",
                              }}
                              onClick={() => handleDelete(u._id)}
                              title="Delete User"
                            >
                              <FaTrash size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Full Name */}
                    <td style={{ padding: "16px 20px", fontWeight: 500 }}>
                      {editUserId === u._id ? (
                        <div style={requiredFieldStyle}>
                          <label style={requiredLabelStyle}>
                            Full Name <span style={requiredAsteriskStyle}>*</span>
                          </label>
                          <input
                            value={editedUser.fullName}
                            onChange={(e) =>
                              setEditedUser({
                                ...editedUser,
                                fullName: e.target.value,
                              })
                            }
                            style={inputStyle(editedUser.fullName)}
                            placeholder="Enter full name"
                            required
                          />
                          {!editedUser.fullName && (
                            <div style={errorMessageStyle}>
                              Full name is required
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="d-flex align-items-center gap-3">
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              backgroundColor: `hsl(${
                                (i * 137.5) % 360
                              }, 70%, 90%)`,
                              color: `hsl(${(i * 137.5) % 360}, 70%, 40%)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 600,
                            }}
                          >
                            {u.fullName?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span>{u.fullName || "N/A"}</span>
                        </div>
                      )}
                    </td>

                    {/* Email */}
                    <td style={{ padding: "16px 20px" }}>{u.email || "N/A"}</td>

                    {/* Phone */}
                    <td style={{ padding: "16px 20px" }}>
                      {editUserId === u._id ? (
                        <div style={requiredFieldStyle}>
                          <label style={requiredLabelStyle}>
                            Phone <span style={requiredAsteriskStyle}>*</span>
                          </label>
                          <input
                            type="text"
                            value={editedUser.phone}
                            onChange={(e) => handlePhoneChange(e, u._id)}
                            placeholder="Enter 10-digit phone number"
                            style={inputStyle(editedUser.phone, validationErrors[`phone_${u._id}`])}
                            required
                          />
                          {validationErrors[`phone_${u._id}`] && (
                            <div style={errorMessageStyle}>
                              {validationErrors[`phone_${u._id}`]}
                            </div>
                          )}
                          {!editedUser.phone && !validationErrors[`phone_${u._id}`] && (
                            <div style={errorMessageStyle}>
                              Phone number is required
                            </div>
                          )}
                        </div>
                      ) : (
                        u.phone || "N/A"
                      )}
                    </td>

                    {/* Date of Birth */}
                    <td style={{ padding: "16px 20px" }}>
                      {editUserId === u._id ? (
                        <div style={requiredFieldStyle}>
                          <label style={requiredLabelStyle}>
                            Date of Birth <span style={requiredAsteriskStyle}>*</span>
                          </label>
                          <input
                            type="date"
                            value={editedUser.dob}
                            onChange={(e) =>
                              setEditedUser({ ...editedUser, dob: e.target.value })
                            }
                            min="1900-01-01"
                            max={new Date().toISOString().split("T")[0]}
                            style={inputStyle(editedUser.dob)}
                            required
                          />
                          {!editedUser.dob && (
                            <div style={errorMessageStyle}>
                              Date of birth is required
                            </div>
                          )}
                        </div>
                      ) : (
                        formatDateTime(u.dob).date
                      )}
                    </td>

                    {/* Role */}
                    <td style={{ padding: '16px 20px' }}>
                      {editUserId === u._id ? (
                        <div style={requiredFieldStyle}>
                          <label style={requiredLabelStyle}>
                            Role <span style={requiredAsteriskStyle}>*</span>
                          </label>
                          <select 
                            value={editedUser.role} 
                            onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                            style={inputStyle(editedUser.role)}
                            required
                          >
                            <option value="">Select Role</option>
                            {availableRoles.map((role) => (
                              <option key={role._id} value={role.role_display_name}>
                                {role.role_display_name}
                              </option>
                            ))}
                          </select>
                          {!editedUser.role && (
                            <div style={errorMessageStyle}>
                              Role is required
                            </div>
                          )}
                        </div>
                      ) : (
                        <span
                          className="px-3 py-1 rounded-pill"
                          style={{
                            backgroundColor: '#e0f2fe',
                            color: '#0369a1',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                          }}
                        >
                          {u.role || 'N/A'}
                        </span>
                      )}
                    </td>

                    {/* Gender */}
                    <td style={{ padding: "16px 20px" }}>
                      {editUserId === u._id ? (
                        <div style={requiredFieldStyle}>
                          <label style={requiredLabelStyle}>
                            Gender <span style={requiredAsteriskStyle}>*</span>
                          </label>
                          <select
                            value={editedUser.gender}
                            onChange={(e) =>
                              setEditedUser({
                                ...editedUser,
                                gender: e.target.value,
                              })
                            }
                            style={inputStyle(editedUser.gender)}
                            required
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          {!editedUser.gender && (
                            <div style={errorMessageStyle}>
                              Gender is required
                            </div>
                          )}
                        </div>
                      ) : (
                        <span
                          className="px-3 py-1 rounded-pill"
                          style={{
                            backgroundColor:
                              u.gender === "Male"
                                ? "#dbeafe"
                                : u.gender === "Female"
                                ? "#fce7f3"
                                : "#f3f4f6",
                            color:
                              u.gender === "Male"
                                ? "#1d4ed8"
                                : u.gender === "Female"
                                ? "#be185d"
                                : "#374151",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                          }}
                        >
                          {u.gender || "N/A"}
                        </span>
                      )}
                    </td>

                    {/* Country */}
                    <td style={{ padding: "16px 20px" }}>
                      {editUserId === u._id ? (
                        <div style={requiredFieldStyle}>
                          <label style={requiredLabelStyle}>
                            Country <span style={requiredAsteriskStyle}>*</span>
                          </label>
                          <select
                            value={editedUser.country}
                            onChange={(e) =>
                              setEditedUser({
                                ...editedUser,
                                country: e.target.value,
                              })
                            }
                            style={inputStyle(editedUser.country)}
                            required
                          >
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
                          {!editedUser.country && (
                            <div style={errorMessageStyle}>
                              Country is required
                            </div>
                          )}
                        </div>
                      ) : (
                        u.country || "N/A"
                      )}
                    </td>

                    {/* Address */}
                    <td style={{ padding: "16px 20px", maxWidth: 200 }}>
                      {editUserId === u._id ? (
                        <div style={requiredFieldStyle}>
                          <label style={requiredLabelStyle}>
                            Address
                          </label>
                          <input
                            value={editedUser.address}
                            onChange={(e) =>
                              setEditedUser({
                                ...editedUser,
                                address: e.target.value,
                              })
                            }
                            style={inputStyle(true)}
                            placeholder="Enter address (optional)"
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                          title={u.address}
                        >
                          {u.address || "N/A"}
                        </div>
                      )}
                    </td>

                    {/* Bio */}
                    <td style={{ padding: "16px 20px", maxWidth: 200 }}>
                      {editUserId === u._id ? (
                        <div style={requiredFieldStyle}>
                          <label style={requiredLabelStyle}>
                            Bio
                          </label>
                          <input
                            value={editedUser.bio}
                            onChange={(e) =>
                              setEditedUser({ ...editedUser, bio: e.target.value })
                            }
                            style={inputStyle(true)}
                            placeholder="Enter bio (optional)"
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                          title={u.bio}
                        >
                          {u.bio || "N/A"}
                        </div>
                      )}
                    </td>

                    {/* Registered On - Updated with date and time */}
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                          {registeredDateTime.date}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                          {registeredDateTime.time}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className="text-center py-5"
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              backgroundColor: "#f3f4f6",
              borderRadius: "50%",
              margin: "0 auto",
            }}
            className="d-flex align-items-center justify-content-center mb-3"
          >
            <FaUsers size={28} style={{ color: "#9ca3af" }} />
          </div>
          <h5 style={{ fontWeight: 600 }}>No Users Found</h5>
          <p style={{ fontSize: "0.95rem", color: "#6b7280" }}>
            Click the "Load Users" button to fetch data.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserData;