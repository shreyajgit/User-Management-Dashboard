import uuid
from datetime import datetime
from flask import Blueprint, request

# Blueprint for departments
dept_bp = Blueprint("department_routes", __name__)
mongo = None  # Will be set by set_db

def set_db(db):
    global mongo
    mongo = db

# CREATE DEPARTMENT
@dept_bp.route("/create/department", methods=["POST"])
def create_department():
    data = request.json

    # Required fields (excluding permissions)
    required_fields = ["department_name", "display_name", "created_by", "updated_by"]

    for field in required_fields:
        if field not in data:
            return f"Missing required field: {field}", 400

    department = {
        "_id": uuid.uuid4().hex,
        "department_name": data["department_name"],
        "display_name": data["display_name"].strip().replace(" ", "_").lower(),
        "created_on": datetime.utcnow(),
        "created_by": data["created_by"],
        "updated_on": datetime.utcnow(),
        "updated_by": data["updated_by"],
        "status": "active"
    }

# Check if department already exists
    existing_name = mongo.db.departments.find_one({
        "department_name": department["department_name"],
        "status": {"$ne": "inactive"}
    })
    if existing_name:
        return {"message": f"Department '{department['department_name']}' already exists"}, 409
   
    existing_display = mongo.db.departments.find_one({
        "display_name": department["display_name"],
        "status": {"$ne": "inactive"}
    })
    if existing_display:
        return {"message": f"Department '{department['display_name']}' already exists"}, 409

    mongo.db.departments.insert_one(department)
    return {"message": "Department created successfully"}, 201


# GET ALL ACTIVE DEPARTMENTS
@dept_bp.route("/get/department", methods=["GET"])
def get_all_departments():
    # Fetch departments that are not marked as inactive
    departments_cursor = mongo.db.departments.find({
        "$or": [
            {"status": {"$ne": "inactive"}},  # Not inactive
            {"status": {"$exists": False}}    # Or status doesn't exist
        ]
    })

    departments = []
    for dept in departments_cursor:
        dept["_id"] = str(dept["_id"])  # Convert UUID to string
        dept["created_on"] = dept["created_on"].strftime("%Y-%m-%d %H:%M:%S")
        dept["updated_on"] = dept["updated_on"].strftime("%Y-%m-%d %H:%M:%S")
        departments.append(dept)

    return {"departments": departments}, 200


# UPDATE DEPARTMENT
@dept_bp.route("/update/department/<department_id>", methods=["PUT"])
def update_department(department_id):
    data = request.json

    # Fields allowed to be updated
    updatable_fields = ["department_name", "display_name", "updated_by"]

    update_data = {}
    for field in updatable_fields:
        if field in data:
            if field == "display_name":
                update_data[field] = data[field].strip().replace(" ", "_").lower()
            else:
                update_data[field] = data[field]

    # Prevent duplicate display_name
    if "display_name" in update_data:
        existing = mongo.db.departments.find_one({
            "display_name": update_data["display_name"],
            "_id": {"$ne": department_id}  # Exclude the current department
        })
        if existing:
            return {"message": f"Department '{update_data['display_name']}' already exists"}, 409

    update_data["updated_on"] = datetime.utcnow()

    # Only match active departments
    result = mongo.db.departments.update_one(
        {"_id": department_id, "status": {"$ne": "inactive"}},
        {"$set": {
            "status": "inactive",
            "updated_on": datetime.utcnow()
        }}
    )

    if result.matched_count == 0:
        return {"message": "Department not found"}, 404

    return {"message": "Department updated successfully"}, 200


# DELETE (SOFT DELETE) DEPARTMENT
@dept_bp.route("/delete/department/<department_id>", methods=["DELETE"])
def soft_delete_department(department_id):
    # Set status to 'inactive' instead of deleting the document
    result = mongo.db.departments.update_one(
        {"_id": department_id, "status": {"$ne": "inactive"}},
        {"$set": {
            "status": "inactive",
            "updated_on": datetime.utcnow()
        }}
    )

    if result.matched_count == 0:
        return {"message": "Department not found"}, 404

    return {"message": "Department has been deleted"}, 200