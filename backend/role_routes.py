import uuid
from datetime import datetime
from flask import Blueprint, request
from flask_pymongo import PyMongo

# Blueprint for roles
role_bp = Blueprint("role_routes", __name__)
mongo = None  # To be set via set_db function

def set_db(db):
    global mongo
    mongo = db

# CREATE ROLE
@role_bp.route("/create/role", methods=["POST"])
def create_role():
    data = request.json

    # Required fields
    required_fields = ["role_name", "display_name", "permissions", "created_by", "updated_by"]

    for field in required_fields:
        if field not in data:
            return f"Missing required field: {field}", 400

    if not isinstance(data["permissions"], list):
        return "Permissions must be an array of objects", 400

    role = {
        "_id": uuid.uuid4().hex,
        "role_name": data["role_name"],
        "display_name": data["display_name"].strip().replace(" ", "_").lower(),
        "permissions": data["permissions"],  # Array of objects
        "created_on": datetime.utcnow(),
        "created_by": data["created_by"],
        "updated_on": datetime.utcnow(),
        "updated_by": data["updated_by"],
        "status": "active"
    }

    # Check if role already exists
    existing = mongo.db.roles.find_one({
        "display_name": role["display_name"],
         "status": {"$ne": "inactive"}  # Only block if existing role is NOT inactive
   })
    if existing:
        return {"message": f"Role '{role['display_name']}' already exists"}, 409


    mongo.db.roles.insert_one(role)
    return {"message": "Role created successfully"}, 201


# UPDATE ROLE
@role_bp.route("/update/role/<role_id>", methods=["PUT"])
def update_role(role_id):
    data = request.json

    # Fields that can be updated
    updatable_fields = ["role_name", "display_name", "permissions", "updated_by"]

    update_data = {}
    for field in updatable_fields:
        if field in data:
            if field == "display_name":
                update_data[field] = data[field].strip().replace(" ", "_").lower()
            else:
                update_data[field] = data[field]

    if "permissions" in update_data and not isinstance(update_data["permissions"], list):
        return {"message": "Permissions must be an array of objects"}, 400

    # Prevent duplicate display_name
    if "display_name" in update_data:
        existing = mongo.db.roles.find_one({
            "display_name": update_data["display_name"],
            "_id": {"$ne": role_id}  # Exclude the current role from duplicate check
        })
        if existing:
            return {"message": f"Role '{update_data['display_name']}' already exists"}, 409

    update_data["updated_on"] = datetime.utcnow()

    result = mongo.db.roles.update_one({"_id": role_id}, {"$set": update_data})

    if result.matched_count == 0:
        return {"message": "Role not found"}, 404

    return {"message": "Role updated successfully"}, 200


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
        role["created_on"] = role["created_on"].strftime("%Y-%m-%d %H:%M:%S")
        role["updated_on"] = role["updated_on"].strftime("%Y-%m-%d %H:%M:%S")
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
