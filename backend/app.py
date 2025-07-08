from flask import Flask
from flask_pymongo import PyMongo
from user_routes import user_bp, set_db as set_user_db
from role_routes import role_bp, set_db as set_role_db
from dept_routes import dept_bp, set_db as set_dept_db
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/userRegistration"
mongo = PyMongo(app)

# Set DB instance in both blueprints
set_user_db(mongo)
set_role_db(mongo)
set_dept_db(mongo)

# Register blueprints
app.register_blueprint(user_bp, url_prefix="/api/users")
app.register_blueprint(role_bp, url_prefix="/api")
app.register_blueprint(dept_bp, url_prefix="/api")


@app.route("/")
def home():
    return "Welcome to User Registration API!"

if __name__ == "__main__":
    app.run(debug=True, port=5000)
