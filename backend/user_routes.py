import uuid
from datetime import datetime
from flask import Blueprint, request
from flask_pymongo import PyMongo

# Create Blueprint (without url_prefix)
user_bp = Blueprint("user_routes", __name__)

mongo = None  # This will be set from app.py

# Function to set mongo from app.py
def set_db(db):
    global mongo
    mongo = db

# CREATE USER
@user_bp.route("/create", methods=["POST"])
def create_user():
    data = request.json

    if not isinstance(data, list):
        return "Expected a list of users", 400

    users_to_insert = []

    for user_data in data:
        required_fields = [
            "fullName", "email", "phone", "dob", "password", 
            "confirmPassword", "gender", "country", "agree"
        ]
        for field in required_fields:
            if field not in user_data:
                return f"Missing field '{field}' in one of the users", 400

        # 👇 Check if email already exists
        if mongo.db.users.find_one({"email": user_data["email"]}):
            return f"Email '{user_data['email']}' is already registered", 409
        
        # 👇 Check if phone number already exists
        if mongo.db.users.find_one({"phone": user_data["phone"]}):
            return f"Phone number '{user_data['phone']}' is already registered", 409

        
        user = {
            "_id": uuid.uuid4().hex,
            "fullName": user_data["fullName"],
            "email": user_data["email"], 
            "phone": user_data["phone"],
            "dob": user_data["dob"],
            "role": user_data.get("role"),  
            "address": user_data.get("address", ""),
            "bio": user_data.get("bio", ""),
            "password": user_data["password"],
            "gender": user_data["gender"],
            "country": user_data["country"],
            "agree": user_data["agree"],
            "registered_on": datetime.now()
        }
        users_to_insert.append(user)

    mongo.db.users.insert_many(users_to_insert)
    return "Registration successful", 201


# GET ALL USERS
@user_bp.route("/get/all", methods=["GET"])
def get_all_users():
    users_cursor = mongo.db.users.find()
    users = []
    for user in users_cursor:
        user["_id"] = str(user["_id"])
        user["registered_on"] = user["registered_on"].strftime("%Y-%m-%d %H:%M:%S")
        users.append(user)
    return {"users": users}

# GET USER BY ID (query param)
@user_bp.route("/get/by-id", methods=["GET"])
def get_user_by_query_param():
    user_id = request.args.get("userId")

    if not user_id:
        return "Query parameter 'userId' is required", 400

    user = mongo.db.users.find_one({"_id": user_id})
    if not user:
        return "User not found", 404

    user["_id"] = str(user["_id"])
    user["registered_on"] = user["registered_on"].strftime("%Y-%m-%d %H:%M:%S")
    return user, 200

# UPDATE USER
@user_bp.route("/update", methods=["PUT"])
def update_user():
    data = request.json
    user_id = data.get("_id")
    if not user_id:
        return "User ID (_id) is required", 400

    result = mongo.db.users.update_one(
        {"_id": user_id},
        {"$set": data}
    )

    if result.modified_count == 0:
        return "No user found or no changes made", 404

    return "User updated successfully"

# DELETE USER
@user_bp.route("/delete", methods=["DELETE"])
def delete_user():
    data = request.json
    user_id = data.get("_id")
    if not user_id:
        return "User ID (_id) is required to delete", 400

    result = mongo.db.users.delete_one({"_id": user_id})
    if result.deleted_count == 0:
        return "User not found", 404

    return "User deleted successfully"

# LOGIN USER
@user_bp.route("/login", methods=["POST"])
def login_user():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"success": False, "message": "Email and password required"}, 400

    # Search for user in MongoDB
    user = mongo.db.users.find_one({"email": email, "password": password})

    if user:
        user["_id"] = str(user["_id"])  # Make _id JSON serializable
        user["registered_on"] = user["registered_on"].strftime("%Y-%m-%d %H:%M:%S")
        return {"success": True, "data": user}, 200
    else:
        return {"success": False, "message": "Invalid credentials"}, 401
