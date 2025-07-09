// Role.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaSpinner,
  FaEye,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaShieldAlt,
} from "react-icons/fa";

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editedData, setEditedData] = useState({});

  const navigate = useNavigate();

  const getRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/get/roles");
      const json = await res.json();
      setRoles(json.roles || []);
    } catch (err) {
      console.error("Fetch roles failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (roleId) => {
    const roleToEdit = roles.find((r) => r._id === roleId);
    setEditingRoleId(roleId);
    setEditedData({
      role_name: roleToEdit.role_name,
      role_display_name: roleToEdit.role_display_name,
      permissions: JSON.parse(JSON.stringify(roleToEdit.permissions)),
    });
  };

  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setEditedData({});
  };

  const handleSaveEdit = async (roleId) => {
    try {
      const currentUser = localStorage.getItem("fullname");
      const res = await fetch(`http://localhost:5000/api/update/role/${roleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_name: editedData.role_name,
          role_display_name: editedData.role_display_name,
          permissions: editedData.permissions,
          updated_by: currentUser,
        }),
      });

      if (res.ok) {
        await getRoles();
        alert("Role updated successfully!");
      } else {
        const error = await res.json();
        alert(error.message || "Update failed");
      }
    } catch (err) {
      console.error("Update role failed:", err);
      alert("Failed to update role");
    } finally {
      handleCancelEdit();
    }
  };

  const handleDelete = async (roleId, roleName) => {
    if (window.confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
      setDeleting(roleId);
      try {
        const res = await fetch(`http://localhost:5000/api/delete/role/${roleId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setRoles(roles.filter((role) => role._id !== roleId));
          alert("Role deleted successfully!");
        } else {
          const errorData = await res.json();
          alert(`Failed to delete role: ${errorData.message || "Unknown error"}`);
        }
      } catch (err) {
        console.error("Delete role failed:", err.message);
        alert("Failed to delete role. Please try again.");
      } finally {
        setDeleting(null);
      }
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
    border: "none",
  };

  useEffect(() => {
    getRoles();
  }, []);

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

  return (
    <div style={{ maxWidth: "100%", overflowX: "auto" }}>
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
            className="d-flex align-items-center justify-content-center"
          >
            <FaUserShield size={24} />
          </div>
          <div>
            <h2 className="mb-1" style={{ color: "#1f2937", fontWeight: 700 }}>
              Role Management
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
              View and manage all roles in the system
            </p>
          </div>
        </div>
        <button
          className="btn d-flex align-items-center gap-2"
          onClick={getRoles}
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
            <>
              <FaSpinner className="spinner-border spinner-border-sm" />
              Loading...
            </>
          ) : (
            <>
              <FaEye size={16} /> Load Roles
            </>
          )}
        </button>
      </div>

      {/* Role Summary */}
      {roles.length > 0 && (
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
            <FaShieldAlt size={18} />
          </div>
          <div>
            <h6 className="mb-0" style={{ color: "#0c4a6e", fontWeight: 600 }}>
              Total Roles
            </h6>
            <p
              className="mb-0"
              style={{ color: "#075985", fontSize: "1.25rem", fontWeight: 700 }}
            >
              {roles.length}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          border: "1px solid #e5e7eb",
          overflowX: "auto",
        }}
      >
        <table className="table table-hover mb-0" style={{ minWidth: 1150 }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
              <th>Actions</th>
              <th>Role Display Name</th>
              <th>Permissions</th>
              <th>Created By</th>
              <th>Created On</th>
              <th>Updated By</th>
              <th>Updated On</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => {
              const isEditing = editingRoleId === r._id;
              const createdDateTime = formatDateTime(r.created_on);
              const updatedDateTime = formatDateTime(r.updated_on);

              return (
                <tr key={r._id}>
                  <td style={{ padding: "16px 20px" }}>
                    <div className="d-flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(r._id)}
                            style={{
                              ...actionBtnStyle,
                              backgroundColor: "#ecfdf5",
                              color: "#047857",
                              border: "1px solid #a7f3d0",
                              gap: 6,
                            }}
                            title="Save"
                          >
                            <FaSave size={14} />
                            <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>Save</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            style={{
                              ...actionBtnStyle,
                              backgroundColor: "#fef2f2",
                              color: "#dc2626",
                              border: "1px solid #fecaca",
                            }}
                            title="Cancel"
                          >
                            <FaTimes size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(r._id)}
                            style={{
                              ...actionBtnStyle,
                              backgroundColor: "#f8fafc",
                              color: "#059669",
                              border: "1px solid #d1fae5",
                            }}
                            title="Edit Role"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(r._id, r.role_name)}
                            disabled={deleting === r._id}
                            style={{
                              ...actionBtnStyle,
                              backgroundColor: "#fef2f2",
                              color: "#dc2626",
                              border: "1px solid #fecaca",
                              cursor: deleting === r._id ? "not-allowed" : "pointer",
                              opacity: deleting === r._id ? 0.6 : 1,
                            }}
                            title="Delete Role"
                          >
                            {deleting === r._id ? (
                              <FaSpinner
                                className="spinner-border spinner-border-sm"
                                style={{ width: 14, height: 14 }}
                              />
                            ) : (
                              <FaTrash size={14} />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </td>

                  {/* ✅ Updated field */}
                  <td style={{ padding: "16px 20px" }}>
  {isEditing ? (
    <input
      type="text"
      className="form-control form-control-sm"
      value={editedData.role_display_name}
      onChange={(e) =>
        setEditedData({ ...editedData, role_display_name: e.target.value })
      }
    />
  ) : (
    r.role_display_name
  )}
</td>




                  <td style={{ padding: "16px 20px", maxWidth: 300 }}>
                    {isEditing ? (
                      <div style={{ display: "grid", rowGap: "6px", fontSize: "0.85rem" }}>
                        {editedData.permissions.map((perm, i) => (
                          <div key={i}>
                            {Object.entries(perm).map(([key, value], j) => (
                              <div key={j} style={{ display: "flex", gap: "10px", marginBottom: 6 }}>
                                <input
                                  type="text"
                                  value={key}
                                  className="form-control form-control-sm"
                                  onChange={(e) => {
                                    const newPermissions = [...editedData.permissions];
                                    const val = newPermissions[i][key];
                                    delete newPermissions[i][key];
                                    newPermissions[i][e.target.value] = val;
                                    setEditedData({
                                      ...editedData,
                                      permissions: newPermissions,
                                    });
                                  }}
                                  style={{ flex: 1 }}
                                />
                                <input
                                  type="text"
                                  value={value ? "true" : "false"}
                                  className="form-control form-control-sm"
                                  onChange={(e) => {
                                    const newPermissions = [...editedData.permissions];
                                    newPermissions[i][key] =
                                      e.target.value.toLowerCase() === "true";
                                    setEditedData({
                                      ...editedData,
                                      permissions: newPermissions,
                                    });
                                  }}
                                  style={{ flex: 1 }}
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : r.permissions.length === 0 ? (
                      <span style={{ color: "#9ca3af" }}>No Permissions</span>
                    ) : (
                      <div style={{ display: "grid", rowGap: "6px", fontSize: "0.85rem" }}>
                        {r.permissions.map((perm, i) => (
                          <div key={i}>
                            {Object.entries(perm).map(([key, value], j) => (
                              <div
                                key={j}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  borderBottom: "1px dotted #e5e7eb",
                                  paddingBottom: 2,
                                  marginBottom: 4,
                                }}
                              >
                                <span style={{ fontWeight: 500 }}>{key}</span>
                                <span style={{ fontWeight: 600 }}>
                                  {value ? "✓" : "✗"}
                                </span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: "16px 20px" }}>{r.created_by}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                        {createdDateTime.date}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                        {createdDateTime.time}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>{r.updated_by}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                        {updatedDateTime.date}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                        {updatedDateTime.time}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate("/userManagement/roles/createRoles")}
        title="Create New Role"
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "#3b82f6",
          color: "white",
          fontSize: "2rem",
          fontWeight: "bold",
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
          zIndex: 999,
          transition: "all 0.2s ease-in-out",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        +
      </button>
    </div>
  );
};

export default Role;
