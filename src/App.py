from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  


USER_CREDENTIALS = {
    "alice": "password123",
    "bob": "secure456",
    "charlie": "qwerty789",
    "diana": "hunter2",
    "eve": "passpass",
    "frank": "letmein",
    "grace": "trustno1",
    "heidi": "admin123",
    "ivan": "welcome1",
    "judy": "password1",
}

@app.route("/validate_login", methods=["POST"])
def validate_login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    if username in USER_CREDENTIALS and USER_CREDENTIALS[username] == password:
        return jsonify({"success": True, "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid username or password"}), 401


model_path = "random_forest_model.pkl"
if not os.path.exists(model_path):
    raise FileNotFoundError("Model file not found in ./src/")
model = joblib.load(model_path)

@app.route("/predict_house_price", methods=["POST"])
def predict_house_price():
    try:
        data = request.json
        
      
        required_fields = ["city", "province", "latitude", "longitude", "lease_term", "type", "beds", "baths", "sq_feet", "furnishing", "smoking", "pets"]
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "message": f"Missing field: {field}"}), 400
        
       
        cats = dogs = data["pets"]
        sample_data = [
            data["city"],
            data["province"],
            float(data["latitude"]),
            float(data["longitude"]),
            data["lease_term"],
            data["type"],
            float(data["beds"]),
            float(data["baths"]),
            float(data["sq_feet"]),
            data["furnishing"],
            data["smoking"],
            cats,
            dogs
        ]
        
        sample_df = pd.DataFrame([sample_data], columns=[
            "city", "province", "latitude", "longitude", "lease_term", "type", "beds", "baths", "sq_feet", "furnishing", "smoking", "cats", "dogs"
        ])
        
        predicted_price = model.predict(sample_df)
        return jsonify({"success": True, "predicted_rent": float(predicted_price[0])})
    
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
