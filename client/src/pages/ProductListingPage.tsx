import { useState } from "react";

import { Link } from "react-router-dom";
import "./ProductListingPage.css";

import cloth1 from "../Assets/cloths/clothimg1.jpg"
import cloth2 from "../Assets/cloths/clothimg2.jpg";
import cloth3 from "../Assets/cloths/clothimg3.jpg";
import cloth4 from "../Assets/cloths/clothimg4.jpg";
import cloth5 from "../Assets/cloths/clothimg5.jpg";
import cloth6 from "../Assets/cloths/clothimg6.jpg";

const ProductListingPage = () => {
  const [sortOption, setSortOption] = useState("default");

  const products = [
    {
      id: "cloth-1",  // ✅ unique id across all categories
      category: "clothing",
      image: cloth1,
      brand: "Bewakoof",
      name: "Men Oversized Lounge Pants",
      price: 699,
      oldPrice: 1449,
      discount: 750,
      rating: 4,
      reviews: 331,
      description: "Comfortable oversized lounge pants made from premium cotton.",
    },
    {
      id: "cloth-2",
      category: "clothing",
      image: cloth2,
      brand: "H&M",
      name: "Women's Summer Floral Dress",
      price: 1299,
      oldPrice: 1999,
      discount: 700,
      rating: 4.5,
      reviews: 420,
      description: "Lightweight and breezy floral dress for summer outings.",
    },
    {
      id: "cloth-3",
      category: "clothing",
      image: cloth3,
      brand: "Levi's",
      name: "Classic Cotton T-Shirt",
      price: 899,
      oldPrice: 1299,
      discount: 400,
      rating: 4.2,
      reviews: 210,
      description: "Timeless crew-neck cotton T-shirt from Levi's.",
    },
    {
      id: "cloth-4",
      category: "clothing",
      image: cloth4,
      brand: "Raymond",
      name: "Men's Slim Fit Suit",
      price: 2999,
      oldPrice: 4999,
      discount: 2000,
      rating: 4.8,
      reviews: 1200,
      description: "Elegant slim fit suit crafted with premium fabrics.",
    },
    {
      id: "cloth-5",
      category: "clothing",
      image: cloth5,
      brand: "Zara",
      name: "Women's Denim Jacket",
      price: 1499,
      oldPrice: 2499,
      discount: 1000,
      rating: 4.9,
      reviews: 1500,
      description: "Trendy denim jacket perfect for layering in all seasons.",
    },
    {
      id: "cloth-6",
      category: "clothing",
      image: cloth6,
      brand: "Puma",
      name: "Men's Sports Shoes",
      price: 999,
      oldPrice: 1499,
      discount: 500,
      rating: 4.6,
      reviews: 800,
      description: "Durable and comfortable sports shoes for active lifestyles.",
    },
  ];

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "priceLowHigh") return a.price - b.price;
    if (sortOption === "priceHighLow") return b.price - a.price;
    if (sortOption === "ratingHighLow") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="product-listing-page">
      <div className="filter-bar">
        <h2>All Clothing</h2>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="default">Sort By</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="ratingHighLow">Rating: High to Low</option>
        </select>
      </div>

      <div className="product-grid">
        {sortedProducts.map((item) => (
          <Link
            key={item.id}
            to={`/product/${item.id}`}
            state={{ product: item }}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="product-card">
              <div style={{ position: "relative" }}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="product-image"
                />
                <div className="rating-badge">
                  ★ {item.rating} <span>({item.reviews})</span>
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-brand">{item.brand}</h3>
                <p className="product-subtext">{item.name}</p>
                <div className="price-row">
                  <span className="current-price">Rs. {item.price}</span>
                  <span className="old-price">Rs. {item.oldPrice}</span>
                  <span className="discount">(Rs. {item.discount} OFF)</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductListingPage;
