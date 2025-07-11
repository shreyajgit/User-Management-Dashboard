import uuid
from datetime import datetime
from flask import Blueprint, request
from flask_pymongo import PyMongo
from pytz import timezone, utc

# Blueprint for roles
role_bp = Blueprint("role_routes", __name__)
mongo = None  # To be set via set_db function

IST = timezone("Asia/Kolkata")

def set_db(db):
    global mongo
    mongo = db

# CREATE ROLE
@role_bp.route("/create/role", methods=["POST"])
def create_role():
    data = request.json

    # Required fields
    required_fields = ["role_name", "role_display_name", "permissions", "created_by", "updated_by"]

    for field in required_fields:
        if field not in data:
            return f"Missing required field: {field}", 400

    if not isinstance(data["permissions"], list):
        return "Permissions must be an array of objects", 400

    role = {
        "_id": uuid.uuid4().hex,
        "role_name": data["role_name"],
        "role_display_name": data["role_display_name"].strip().replace(" ", "_").upper(),
        "permissions": data["permissions"],  # Array of objects
        "created_on": datetime.utcnow(),
        "created_by": data["created_by"],
        "updated_on": datetime.utcnow(),
        "updated_by": data["updated_by"],
        "status": "active"
    }

    # Check if role already exists
    duplicate_role = mongo.db.roles.find_one({
        "role_name": role["role_name"].strip(),
        "status": {"$ne": "inactive"}  # Only block if existing role is NOT inactive
    })
    if duplicate_role:
        return {"message": f"Role '{role['role_name']}' already exists"}, 409
    
    duplicate_display = mongo.db.roles.find_one({
        "role_display_name": role["role_display_name"],
        "status": {"$ne": "inactive"}  # Only block if existing role is NOT inactive
    })
    if duplicate_display:
        return {"message": f"Role '{role['role_display_name']}' already exists"}, 409

    mongo.db.roles.insert_one(role)
    return {"message": "Role created successfully"}, 201

# UPDATE ROLE
@role_bp.route("/update/role/<role_id>", methods=["PUT"])
def update_role(role_id):
    data = request.json

    # Fields that can be updated
    updatable_fields = ["role_name", "role_display_name", "permissions", "updated_by"]

    update_data = {}
    for field in updatable_fields:
        if field in data:
            if field == "role_display_name":
                update_data[field] = data[field].strip().replace(" ", "_").upper()
            else:
                update_data[field] = data[field]

    if "permissions" in update_data and not isinstance(update_data["permissions"], list):
        return {"message": "Permissions must be an array of objects"}, 400

    # Prevent duplicate role_display_name
    if "role_display_name" in update_data:
        cleaned_display_name = update_data["role_display_name"].strip()
        if not cleaned_display_name:
           return {"message": "Role display name cannot be empty"}, 400

        cleaned_display_name = cleaned_display_name.replace(" ", "_").upper()
        update_data["role_display_name"] = cleaned_display_name

        existing = mongo.db.roles.find_one({
            "role_display_name": cleaned_display_name,
            "status": {"$ne": "inactive"},
            "_id": {"$ne": role_id}
        })
        if existing:
              return {"message": f"Role '{cleaned_display_name}' already exists"}, 409


    update_data["updated_on"] = datetime.utcnow()

    result = mongo.db.roles.update_one({"_id": role_id}, {"$set": update_data})

    if result.matched_count == 0:
        return {"message": "Role not found"}, 404

    return {"message": "Role updated successfully"}, 200

# READ ROLES
@role_bp.route("/get/roles", methods=["GET"])
def get_all_roles():
    # Only fetch roles that are not marked as inactive
    roles_cursor = mongo.db.roles.find({
        "$or": [
            {"status": {"$ne": "inactive"}},  # Not inactive
            {"status": {"$exists": False}}    # Or status doesn't exist (for old data)
        ]
    })

    roles = []
    for role in roles_cursor:
        role["_id"] = str(role["_id"])  # Convert ObjectId/UUID to string
        
        # Convert UTC to IST
        created_utc = role["created_on"].replace(tzinfo=utc)
        updated_utc = role["updated_on"].replace(tzinfo=utc)

        created_ist = created_utc.astimezone(IST)
        updated_ist = updated_utc.astimezone(IST)
        
        # Format the IST times (not UTC times)
        role["created_on"] = created_ist.strftime("%Y-%m-%d %H:%M:%S")
        role["updated_on"] = updated_ist.strftime("%Y-%m-%d %H:%M:%S")
        
        roles.append(role)

    return {"roles": roles}, 200


# DELETE (Soft) ROLE
@role_bp.route("/delete/role/<role_id>", methods=["DELETE"])
def soft_delete_role(role_id):
    # Mark status as 'inactive' instead of deleting the document
    result = mongo.db.roles.update_one(
        {"_id": role_id},
        {"$set": {
            "status": "inactive",
            "updated_on": datetime.utcnow()
        }}
    )

    if result.matched_count == 0:
        return {"message": "Role not found"}, 404

    return {"message": "Role marked as inactive"}, 200
