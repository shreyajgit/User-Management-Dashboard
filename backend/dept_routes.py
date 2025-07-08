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
    existing = mongo.db.departments.find_one({
        "display_name": department["display_name"],
        "status": {"$ne": "inactive"}
    })
    if existing:
        return {"message": f"Department '{department['display_name']}' already exists"}, 409

    mongo.db.departments.insert_one(department)
    return {"message": "Department created successfully"}, 201
