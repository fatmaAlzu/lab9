import { useState } from "react";
import "./HousePricePredictor.css";

const HousePricePredictor = () => {
  const [formData, setFormData] = useState({
    city: "",
    province: "",
    latitude: "",
    longitude: "",
    lease_term: "",
    type: "",
    beds: "",
    baths: "",
    sq_feet: "",
    furnishing: "Unfurnished",
    smoking: "No",
    pets: false,
  });
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPredictedPrice(null);

    const response = await fetch("/predict_house_price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      setPredictedPrice(data.predicted_rent);
    } else {
      setError(data.message || "Error fetching prediction");
    }
  };

  return (
    <div className="predictor-container">
      <h2>House Price Predictor</h2>
      <form onSubmit={handleSubmit} className="predictor-form">
        {Object.keys(formData).map((key) => (
          key === "pets" ? (
            <label key={key}>
              <input
                type="checkbox"
                name={key}
                checked={formData[key]}
                onChange={handleChange}
              /> Pets Allowed
            </label>
          ) : key === "furnishing" ? (
            <label key={key}>
              Furnishing:
              <select name={key} value={formData[key]} onChange={handleChange}>
                <option value="Unfurnished">Unfurnished</option>
                <option value="Partially Furnished">Partially Furnished</option>
                <option value="Fully Furnished">Fully Furnished</option>
              </select>
            </label>
          ) : (
            <label key={key}>
              {key.replace("_", " ").toUpperCase()}:
              <input
                type={key === "beds" || key === "baths" || key === "sq_feet" ? "number" : "text"}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
              />
            </label>
          )
        ))}
        <button type="submit">Predict Rent</button>
      </form>
      {predictedPrice && <p className="prediction-result">Predicted Rent: ${predictedPrice}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default HousePricePredictor;
