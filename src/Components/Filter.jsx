// src/pages/Filter.jsx
import React from "react";

const Filter = ({ foodItems = [] }) => {
  const safeItems = Array.isArray(foodItems) ? foodItems : [];

  return (
    <div className="mb-4 px-4">
      <h5>Filtered Items</h5>
      <div className="row g-3">
        {safeItems.length > 0 ? (
          safeItems
            .filter(item => item.price > 100) // example filter
            .map(item => (
              <div className="col-md-3" key={item._id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="card-img-top"
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h6 className="fw-semibold">{item.name}</h6>
                    <p className="small text-muted">{item.description}</p>
                    <p className="fw-bold text-success">₹{item.price}</p>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <p>No items found.</p>
        )}
      </div>
    </div>
  );
};

export default Filter;
