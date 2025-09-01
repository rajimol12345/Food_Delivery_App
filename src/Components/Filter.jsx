// src/pages/Filter.jsx
import React from "react";

const Filter = ({ foodItems = [] }) => {
  // Ensure foodItems is always an array
  const safeItems = Array.isArray(foodItems) ? foodItems : [];

  // Example filter: show only items above ₹100
  const filteredItems = safeItems.filter((item) => item.price > 100);

  return (
    <div className="mb-4 px-4">
      <h5 className="mb-3">Filtered Items</h5>

      <div className="row g-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={item._id}>
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
          <p className="text-muted">No items found.</p>
        )}
      </div>
    </div>
  );
};

export default Filter;
