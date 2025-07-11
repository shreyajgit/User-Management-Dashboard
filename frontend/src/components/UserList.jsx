import React, { useEffect, useState } from "react";
import { FaUsers, FaEye, FaSpinner, FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";

const UserData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [availableRoles, setAvailableRoles] = useState([]);
  const [showEditPage, setShowEditPage] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");

  const requiredFieldStyle = { position: "relative" };
  const requiredLabelStyle = { color: "#374151", fontSize: "0.875rem", fontWeight: "600", marginBottom: "6px", display: "block" };
  const requiredAsteriskStyle = { color: "#dc2626", marginLeft: "4px", fontWeight: "bold" };
  const inputStyle = (hasValue, hasError = false) => ({ padding: "12px 16px", fontSize: "0.875rem", borderRadius: "8px", width: "100%", transition: "all 0.2s ease", outline: "none", border: hasError ? "2px solid #dc2626" : hasValue ? "2px solid #e5e7eb" : "2px solid #dc2626", backgroundColor: hasError ? "#fef2f2" : hasValue ? "white" : "#fef2f2" });
  const errorMessageStyle = { color: "#dc2626", fontSize: "0.75rem", marginTop: "4px", fontWeight: "500" };
  const tableHeaderStyle = { padding: "16px 20px", color: "#374151", fontWeight: 600, fontSize: "0.875rem", textTransform: "uppercase", minWidth: 140, backgroundColor: "#f8fafc", boxShadow: "inset -4px 0 0 rgba(59, 130, 246, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.05)" };
  const tableCellStyle = { padding: "16px 20px", boxShadow: "inset -3px 0 0 rgba(59, 130, 246, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04), inset 0 -1px 0 rgba(0, 0, 0, 0.02)" };

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

  const formatDateTime = (dateStr) => {
    if (!dateStr) return { date: "N/A", time: "N/A" };
    const date = new Date(dateStr);
    const dateOnly = date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    const timeOnly = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
    return { date: dateOnly, time: timeOnly };
  };

  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
  const handlePhoneChange = (e, userId) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    setEditedUser({ ...editedUser, phone: value });
    if (value && !validatePhone(value)) {
      setValidationErrors((prev) => ({ ...prev, [`phone_${userId}`]: "Phone number must be exactly 10 digits" }));
    } else {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`phone_${userId}`];
        return newErrors;
      });
    }
  };

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setEditedUser({ fullName: user.fullName || "", phone: user.phone || "", dob: user.dob ? user.dob.split("T")[0] : "", role: user.role || "", address: user.address || "", bio: user.bio || "", gender: user.gender || "", country: user.country || "" });
    setValidationErrors({});
    setSelectedUser(user);
    setShowEditPage(true);
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    setEditedUser({});
    setValidationErrors({});
    setShowEditPage(false);
  };

  const handleSaveEdit = async (userId) => {
    const requiredFields = ["fullName", "phone", "dob", "role", "gender", "country", "address"];
    const fieldLabels = { fullName: "Full Name", phone: "Phone", dob: "Date of Birth", role: "Role", gender: "Gender", country: "Country", address: "Address" };
    const emptyFields = requiredFields.filter((field) => !editedUser[field]?.toString().trim());
    if (emptyFields.length > 0) {
      const missingLabels = emptyFields.map((field) => fieldLabels[field]);
      alert(`Please fill all required fields: ${missingLabels.join(", ")}`);
      return;
    }
    const dobDate = new Date(editedUser.dob);
    if (isNaN(dobDate.getTime()) || dobDate.getFullYear() < 1900 || dobDate > new Date()) {
      alert("Please enter a valid date of birth.");
      return;
    }
    if (validationErrors[`phone_${userId}`] || !validatePhone(editedUser.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }
    setActionLoading(true);
    try {
      const updateData = { _id: userId, fullName: editedUser.fullName, phone: editedUser.phone, dob: editedUser.dob, role: editedUser.role, address: editedUser.address || "", bio: editedUser.bio || "", gender: editedUser.gender, country: editedUser.country };
      const res = await fetch("http://localhost:5000/api/users/update", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updateData) });
      if (!res.ok) {
        const errorText = await res.text();
        if (errorText.toLowerCase().includes("no changes")) {
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
      const res = await fetch("http://localhost:5000/api/users/delete", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _id: userId }) });
      if (!res.ok) throw new Error(await res.text());
      await getData();
    } catch (err) {
      console.error("Delete failed:", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(searchEmail.toLowerCase()));

  return (
    <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <div className="mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: 48, height: 48, backgroundColor: "#3b82f6", borderRadius: 12, color: "white" }} className="d-flex align-items-center justify-content-center">
            <FaUsers size={24} />
          </div>
          <div>
            <h2 className="mb-1" style={{ color: "#1f2937", fontWeight: 700 }}>User Management</h2>
            <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>View and manage all registered users</p>
          </div>
        </div>
        <input type="email" placeholder="Search by email..." value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} className="form-control" style={{ maxWidth: 360, borderRadius: "10px", padding: "10px 14px", fontSize: "0.9rem", border: "2px solid #e5e7eb", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }} />
      </div>

      {showEditPage ? (
        <div className="p-4 bg-white rounded shadow-sm border" 
          style={{ maxWidth: "900px", margin: "0 auto", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
          <div className="mb-4 pb-3" style={{ borderBottom: "2px solid #f3f4f6" }}>
            <h3 style={{ fontWeight: 700, color: "#1f2937", marginBottom: "8px", fontSize: "1.5rem" }}>Edit User Profile</h3>
            <p style={{ color: "#6b7280", fontSize: "0.95rem", marginBottom: 0 }}>Update user information and account details</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <div style={requiredFieldStyle}>
              <label style={requiredLabelStyle}>Full Name <span style={requiredAsteriskStyle}>*</span></label>
              <input value={editedUser.fullName} onChange={(e) => setEditedUser({ ...editedUser, fullName: e.target.value })} 
                style={inputStyle(editedUser.fullName)} placeholder="Enter full name" required />
            </div>
            <div style={requiredFieldStyle}>
              <label style={requiredLabelStyle}>Phone <span style={requiredAsteriskStyle}>*</span></label>
              <input type="text" value={editedUser.phone} onChange={(e) => handlePhoneChange(e, editUserId)} 
                placeholder="Enter 10-digit phone number" style={inputStyle(editedUser.phone, validationErrors[`phone_${editUserId}`])} required />
              {validationErrors[`phone_${editUserId}`] && <div style={errorMessageStyle}>{validationErrors[`phone_${editUserId}`]}</div>}
            </div>
            <div style={requiredFieldStyle}>
              <label style={requiredLabelStyle}>Date of Birth <span style={requiredAsteriskStyle}>*</span></label>
              <input type="date" value={editedUser.dob} onChange={(e) => setEditedUser({ ...editedUser, dob: e.target.value })} 
                min="1900-01-01" max={new Date().toISOString().split("T")[0]} style={inputStyle(editedUser.dob)} required />
            </div>
            <div style={requiredFieldStyle}>
              <label style={requiredLabelStyle}>Role <span style={requiredAsteriskStyle}>*</span></label>
              <select value={editedUser.role} onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })} 
                style={inputStyle(editedUser.role)} required>
                <option value="">Select Role</option>
                {availableRoles.map((role) => <option key={role._id} value={role.role_display_name}>{role.role_display_name}</option>)}
              </select>
            </div>
            <div style={requiredFieldStyle}>
              <label style={requiredLabelStyle}>Gender <span style={requiredAsteriskStyle}>*</span></label>
              <select value={editedUser.gender} onChange={(e) => setEditedUser({ ...editedUser, gender: e.target.value })} 
                style={inputStyle(editedUser.gender)} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={requiredFieldStyle}>
              <label style={requiredLabelStyle}>Country <span style={requiredAsteriskStyle}>*</span></label>
              <select value={editedUser.country} onChange={(e) => setEditedUser({ ...editedUser, country: e.target.value })} 
                style={inputStyle(editedUser.country)} required>
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
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={requiredLabelStyle}>Address <span style={requiredAsteriskStyle}>*</span></label>
            <textarea value={editedUser.address} onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })} 
              style={{ ...inputStyle(true), overflow: "hidden", resize: "none", minHeight: "38px", fontFamily: "inherit" }} 
              placeholder="Enter address" required />
          </div>
          <div style={{ marginBottom: "32px" }}>
            <label style={requiredLabelStyle}>Bio</label>
            <textarea value={editedUser.bio} onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })} 
              style={{ ...inputStyle(true), minHeight: "100px", resize: "vertical", fontFamily: "inherit" }} 
              placeholder="Enter bio (optional)" />
          </div>
          <div className="d-flex gap-3 justify-content-end pt-3" style={{ borderTop: "1px solid #f3f4f6" }}>
            <button onClick={handleCancelEdit} className="btn" disabled={actionLoading} 
              style={{ backgroundColor: "#f8fafc", color: "#374151", border: "2px solid #e5e7eb", padding: "12px 24px", fontWeight: 600, borderRadius: "8px", fontSize: "0.9rem", transition: "all 0.2s ease" }}>
              Cancel
            </button>
            <button onClick={() => handleSaveEdit(editUserId)} className="btn" disabled={actionLoading} 
              style={{ backgroundColor: "#10b981", color: "white", border: "2px solid #10b981", padding: "12px 32px", fontWeight: 600, borderRadius: "8px", fontSize: "0.9rem", boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)", transition: "all 0.2s ease" }}>
              {actionLoading ? <><FaSpinner className="spinner-border spinner-border-sm me-2" />Saving...</> : "Save Changes"}
            </button>
          </div>
        </div>
      ) :  (
        <div>
          <div style={{ backgroundColor: "white", borderRadius: 16, boxShadow: "0 10px 30px -5px rgba(0,0,0,0.15), 0 8px 20px -5px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", overflowX: "auto" }}>
            <table className="table table-hover mb-0" style={{ minWidth: 1320 }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "3px solid #e2e8f0" }}>
                  {["Actions", "Full Name", "Email", "Phone", "Date of Birth", "Role", "Gender", "Country", "Address", "Bio", "Registered On"].map((head, i) => (
                    <th key={i} style={tableHeaderStyle}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan="5" className="text-center text-muted p-4">No users found with email containing "{searchEmail}"</td></tr>
                ) : (
                  filteredUsers.map((u, i) => {
                    const registeredDateTime = formatDateTime(u.registered_on);

                  return (
                    <tr key={u._id} 
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc", e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent", e.currentTarget.style.boxShadow = "none")}
                      style={{ transition: "all 0.2s ease", borderBottom: "1px solid #f1f5f9" }}>
                      
                      <td style={{ ...tableCellStyle, backgroundColor: "#fafbfc" }}>
                        <div className="d-flex gap-2">
                          <button style={{ borderRadius: "8px", padding: "8px 12px", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#ecfdf5", color: "#059669", border: "1px solid #d1fae5", boxShadow: "0 2px 6px rgba(5, 150, 105, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)", transition: "all 0.2s ease" }}
                            onClick={() => handleEditClick(u)} title="Edit User">
                            <FaEdit size={14} />
                          </button>
                          <button style={{ borderRadius: "8px", padding: "8px 12px", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", boxShadow: "0 2px 6px rgba(220, 38, 38, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)", transition: "all 0.2s ease" }}
                            onClick={() => handleDelete(u._id)} title="Delete User">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                      
                      <td style={{ ...tableCellStyle, fontWeight: 500 }}>
                        <div className="d-flex align-items-center gap-3">
                          <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: `hsl(${(i * 137.5) % 360}, 70%, 90%)`, color: `hsl(${(i * 137.5) % 360}, 70%, 40%)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, boxShadow: "0 3px 8px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.3)" }}>
                            {u.fullName?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span>{u.fullName || "N/A"}</span>
                        </div>
                      </td>
                      
                      <td style={tableCellStyle}>{u.email || "N/A"}</td>
                      <td style={tableCellStyle}>{u.phone || "N/A"}</td>
                      <td style={{ ...tableCellStyle, minWidth: 140 }}>{formatDateTime(u.dob).date}</td>
                      
                      <td style={tableCellStyle}>
                        <span className="px-3 py-1 rounded-pill" 
                          style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.8rem', fontWeight: 500, boxShadow: '0 2px 6px rgba(3, 105, 161, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4)' }}>
                          {u.role || 'N/A'}
                        </span>
                      </td>
                      
                      <td style={tableCellStyle}>
                        <span className="px-3 py-1 rounded-pill" style={{ 
                          backgroundColor: u.gender === "Male" ? "#dbeafe" : u.gender === "Female" ? "#fce7f3" : "#f3f4f6",
                          color: u.gender === "Male" ? "#1d4ed8" : u.gender === "Female" ? "#be185d" : "#374151",
                          fontSize: "0.8rem", fontWeight: 500, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                        }}>
                          {u.gender || "N/A"}
                        </span>
                      </td>
                      
                      <td style={tableCellStyle}>{u.country || "N/A"}</td>
                      
                      <td style={{ ...tableCellStyle, maxWidth: 200 }}>
                        <div style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }} title={u.address}>
                          {u.address || "N/A"}
                        </div>
                      </td>
                      
                      <td style={{ ...tableCellStyle, maxWidth: 200 }}>
                        <div style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }} title={u.bio}>
                          {u.bio || "N/A"}
                        </div>
                      </td>
                      
                      <td style={{ padding: "16px 20px", boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04), inset 0 -1px 0 rgba(0, 0, 0, 0.02)" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{registeredDateTime.date}</span>
                          <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>{registeredDateTime.time}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserData;