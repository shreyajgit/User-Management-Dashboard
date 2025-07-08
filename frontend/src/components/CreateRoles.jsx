// components/CreateRoles.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateRoles = () => {
  const [roleData, setRoleData] = useState({
    role_name: "",
    display_name: "",
    permissions: [{ read: false, write: false }],
    created_by: "",
    updated_by: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fullName = localStorage.getItem("fullname");
    if (fullName) {
      setRoleData((prev) => ({
        ...prev,
        created_by: fullName,
        updated_by: fullName,
      }));
    }
  }, []);

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "role_name") {
    const generatedDisplayName = value.trim().replace(/\s+/g, "_").toLowerCase();

    setRoleData((prev) => ({
      ...prev,
      role_name: value,
      display_name: generatedDisplayName, // auto-set display_name
    }));
  } else {
    setRoleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  if (error) setError("");
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const cleanPermissions = roleData.permissions?.[0] || {};
      const nonEmptyPermissions = Object.values(cleanPermissions).some(
        (v) => v === true || v === false
      )
        ? [cleanPermissions]
        : [];

      const res = await fetch("http://localhost:5000/api/create/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...roleData,
          permissions: nonEmptyPermissions,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Role created successfully!");
        setTimeout(() => navigate("/userManagement/roles"), 1500);
      } else if (res.status === 409) {
        setError("Role already exists.");
      } else {
        setError(
          data.message ||
            "Failed to create role. Please check your input and try again."
        );
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Role creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/userManagement/roles");
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontWeight: "600",
            fontSize: "1.875rem",
            color: "#111827",
            marginBottom: "0.5rem",
          }}
        >
          Create New Role
        </h2>
        <p
          style={{
            color: "#6b7280",
            fontSize: "1rem",
            margin: 0,
          }}
        >
          Define a new role with specific permissions and access levels
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {/* Role Name */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Role Name *
            </label>
            <input
              type="text"
              name="role_name"
              value={roleData.role_name}
              onChange={handleChange}
              required
              placeholder="Enter role name (e.g., admin, editor, viewer)"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "1rem",
                transition: "border-color 0.2s ease",
                outline: "none",
                backgroundColor: "#ffffff",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          {/* Display Name */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Display Name *
            </label>
            <input
              type="text"
              name="display_name"
              value={roleData.display_name}
              readOnly
              onChange={handleChange}
              required
              placeholder="Enter display name (e.g., Administrator, Content Editor)"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "1rem",
                transition: "border-color 0.2s ease",
                outline: "none",
                backgroundColor: "#ffffff",
              }}
              // onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              // onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          {/* Permissions */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Permissions
            </label>
            <textarea
              name="permissions"
              value={roleData.permissions}
              onChange={handleChange}
              placeholder="Describe the permissions and access levels for this role (optional)"
              rows="4"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "1rem",
                transition: "border-color 0.2s ease",
                outline: "none",
                backgroundColor: "#ffffff",
                resize: "vertical",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              backgroundColor: "#d1fae5",
              border: "1px solid #a7f3d0",
              borderRadius: "8px",
              color: "#065f46",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            ✅ {message}
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              backgroundColor: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              color: "#991b1b",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            ❌ {error}
          </div>
        )}

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "flex-end",
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <button
            type="button"
            onClick={handleCancel}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#ffffff",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f9fafb";
              e.target.style.borderColor = "#9ca3af";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.borderColor = "#d1d5db";
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: isLoading ? "#9ca3af" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: "500",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              outline: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = "#2563eb";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = "#3b82f6";
              }
            }}
          >
            {isLoading ? (
              <>
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid transparent",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                ></span>
                Creating...
              </>
            ) : (
              "Create Role"
            )}
          </button>
        </div>
      </form>

      {/* Add spinning animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default CreateRoles;
