from flask import Flask
from flask_pymongo import PyMongo
from user_routes import user_bp, set_db  
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/userRegistration"
mongo = PyMongo(app)

# Set the DB connection in the blueprint
set_db(mongo)

# ✅ Register blueprint with prefix
app.register_blueprint(user_bp, url_prefix="/api/users")

@app.route("/")
def home():
    return "Welcome to User Registration API!"

if __name__ == "__main__":
    app.run(debug=True, port=5000)
