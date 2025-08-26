import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategorySection.css";

// --- image imports (unchanged) ---
import cloth1 from "../Assets/cloths/clothimg1.jpg";
import cloth2 from "../Assets/cloths/clothimg2.jpg";
import cloth3 from "../Assets/cloths/clothimg3.jpg";
import cloth4 from "../Assets/cloths/clothimg4.jpg";
import cloth5 from "../Assets/cloths/clothimg5.jpg";
import cloth6 from "../Assets/cloths/clothimg6.jpg";

import clothsec21 from "../Assets/cloths/clothsec2-1.jpg";
import clothsec22 from "../Assets/cloths/clothsec2-2.jpg";
import clothsec23 from "../Assets/cloths/clothsec2-3.jpg";
import clothsec24 from "../Assets/cloths/clothsec2-4.jpg";
import clothsec25 from "../Assets/cloths/clothsec2-5.jpg";
import clothsec26 from "../Assets/cloths/clothsec2-6.jpg";

import sec31 from "../Assets/electronics/sec3-1.jpg";
import sec32 from "../Assets/electronics/sec3-2.jpg";
import sec33 from "../Assets/electronics/sec3-3.jpg";
import sec34 from "../Assets/electronics/sec3-4.jpg";
import sec35 from "../Assets/electronics/sec3-5.jpg";
import sec36 from "../Assets/electronics/sec3-6.jpg";

import sec41 from "../Assets/electronics/sec4-1.jpg";
import sec42 from "../Assets/electronics/sec4-2.jpg";
import sec43 from "../Assets/electronics/sec4-3.jpg";
import sec44 from "../Assets/electronics/sec4-4.jpg";
import sec45 from "../Assets/electronics/sec4-5.jpg";
import sec46 from "../Assets/electronics/sec4-6.jpg";

import sec51 from "../Assets/food/sec5-1.jpg";
import sec52 from "../Assets/food/sec5-2.jpg";
import sec53 from "../Assets/food/sec5-3.jpg";
import sec54 from "../Assets/food/sec5-4.jpg";
import sec55 from "../Assets/food/sec5-5.jpg";

import sec61 from "../Assets/food/sec6-1.jpg";
import sec62 from "../Assets/food/sec6-2.jpg";
import sec63 from "../Assets/food/sec6-3.jpg";
import sec64 from "../Assets/food/sec6-4.jpg";
import sec65 from "../Assets/food/sec6-5.jpg";
import sec66 from "../Assets/food/sec6-6.jpg";

// Reusable row component
const ProductRow = ({ title, subtitle, products }) => {
  const navigate = useNavigate();

  const handleCardClick = (product) => {
    navigate(`/product/${encodeURIComponent(product.name)}`, { state: { product } });
  };

  return (
    <section className="category-section">
      {title && <h2 className="category-title">{title}</h2>}
      {subtitle && <h3 className="category-subtitle">{subtitle}</h3>}
      <div className="category-grid">
        {products.map((item, index) => (
          <div
            className="product-card"
            key={index}
            onClick={() => handleCardClick(item)}
            style={{ cursor: "pointer" }}
          >
            <div style={{ position: "relative" }}>
              <img src={item.image} alt={item.name} className="product-image" />
              <div className="rating-badge">
                ★ {item.rating} <span>({item.reviews})</span>
              </div>
            </div>
            <div className="product-info">
              <h3 className="product-name">{item.brand}</h3>
              <p className="product-subtext">{item.name}</p>
              <div className="price-row">
                <span className="current-price">Rs. {item.price}</span>
                <span className="old-price">Rs. {item.oldPrice}</span>
                <span className="discount">(Rs. {item.discount} OFF)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const CategorySection = () => {
  const section1 = [
    { image: cloth1, brand: "Bewakoof", name: "Men Oversized Lounge Pants", price: 699, oldPrice: 1449, discount: 750, rating: 4, reviews: 331 },
    { image: cloth2, brand: "H&M", name: "Women's Summer Floral Dress", price: 1299, oldPrice: 1999, discount: 700, rating: 4.5, reviews: 420 },
    { image: cloth3, brand: "Levi's", name: "Classic Cotton T-Shirt", price: 899, oldPrice: 1299, discount: 400, rating: 4.2, reviews: 210 },
    { image: cloth4, brand: "Raymond", name: "Men's Slim Fit Suit", price: 2999, oldPrice: 4999, discount: 2000, rating: 4.8, reviews: 1200 },
    { image: cloth5, brand: "Zara", name: "Women's Denim Jacket", price: 1499, oldPrice: 2499, discount: 1000, rating: 4.9, reviews: 1500 },
    { image: cloth6, brand: "Puma", name: "Men's Sports Shoes", price: 999, oldPrice: 1499, discount: 500, rating: 4.6, reviews: 800 }
  ];

  const section2 = [
    { image: clothsec21, brand: "Nike", name: "Air Zoom Pegasus", price: 3999, oldPrice: 4999, discount: 1000, rating: 4.7, reviews: 980 },
    { image: clothsec22, brand: "Adidas", name: "Men's Hoodie", price: 1999, oldPrice: 2999, discount: 1000, rating: 4.5, reviews: 420 },
    { image: clothsec23, brand: "Allen Solly", name: "Formal Shirt", price: 1199, oldPrice: 1799, discount: 600, rating: 4.3, reviews: 150 },
    { image: clothsec24, brand: "Van Heusen", name: "Blazer", price: 3499, oldPrice: 4999, discount: 1500, rating: 4.6, reviews: 300 },
    { image: clothsec25, brand: "Under Armour", name: "Running Shorts", price: 999, oldPrice: 1499, discount: 500, rating: 4.4, reviews: 210 },
    { image: clothsec26, brand: "Reebok", name: "Track Pants", price: 1299, oldPrice: 1799, discount: 500, rating: 4.5, reviews: 250 }
  ];

  const section3 = [
    { image: sec31, brand: "Sony", name: "Wireless Headphones", price: 7999, oldPrice: 9999, discount: 2000, rating: 4.7, reviews: 980 },
    { image: sec32, brand: "Samsung", name: "Smartphone Galaxy S21", price: 69999, oldPrice: 74999, discount: 5000, rating: 4.5, reviews: 420 },
    { image: sec33, brand: "HP", name: "Pavilion Laptop", price: 55999, oldPrice: 59999, discount: 4000, rating: 4.3, reviews: 150 },
    { image: sec34, brand: "Dell", name: "Inspiron Laptop", price: 49999, oldPrice: 52999, discount: 3000, rating: 4.6, reviews: 300 },
    { image: sec35, brand: "Canon", name: "DSLR Camera", price: 45999, oldPrice: 49999, discount: 4000, rating: 4.4, reviews: 210 },
    { image: sec36, brand: "Apple", name: "iPad Air", price: 54999, oldPrice: 59999, discount: 5000, rating: 4.5, reviews: 250 }
  ];

  const section4 = [
    { image: sec41, brand: "LG", name: "Smart TV 55 inch", price: 64999, oldPrice: 69999, discount: 5000, rating: 4.7, reviews: 980 },
    { image: sec42, brand: "Bose", name: "SoundLink Speaker", price: 15999, oldPrice: 17999, discount: 2000, rating: 4.5, reviews: 420 },
    { image: sec43, brand: "Philips", name: "Air Fryer", price: 9999, oldPrice: 11999, discount: 2000, rating: 4.3, reviews: 150 },
    { image: sec44, brand: "Samsung", name: "Microwave Oven", price: 13999, oldPrice: 15999, discount: 2000, rating: 4.6, reviews: 300 },
    { image: sec45, brand: "Whirlpool", name: "Refrigerator", price: 29999, oldPrice: 34999, discount: 5000, rating: 4.4, reviews: 210 },
    { image: sec46, brand: "Dyson", name: "Vacuum Cleaner", price: 35999, oldPrice: 39999, discount: 4000, rating: 4.5, reviews: 250 }
  ];

  const section5 = [
    { image: sec51, brand: "StreetEats", name: "Pani Puri", price: 50, oldPrice: 70, discount: 20, rating: 4.7, reviews: 980 },
    { image: sec52, brand: "FoodieHub", name: "Pav Bhaji", price: 120, oldPrice: 150, discount: 30, rating: 4.5, reviews: 420 },
    { image: sec53, brand: "DesiTaste", name: "Bhel Puri", price: 60, oldPrice: 80, discount: 20, rating: 4.3, reviews: 150 },
    { image: sec54, brand: "SpiceKing", name: "Samosa", price: 15, oldPrice: 20, discount: 5, rating: 4.6, reviews: 300 },
    { image: sec55, brand: "ChatoriGalli", name: "Vada Pav", price: 25, oldPrice: 30, discount: 5, rating: 4.4, reviews: 210 }
  ];

  const section6 = [
    { image: sec61, brand: "Hotel Royal", name: "Paneer Butter Masala", price: 250, oldPrice: 300, discount: 50, rating: 4.7, reviews: 980 },
    { image: sec62, brand: "Hotel Plaza", name: "Chicken Biryani", price: 300, oldPrice: 350, discount: 50, rating: 4.5, reviews: 420 },
    { image: sec63, brand: "Hotel Treat", name: "Dal Makhani", price: 200, oldPrice: 250, discount: 50, rating: 4.3, reviews: 150 },
    { image: sec64, brand: "Hotel Saffron", name: "Butter Naan", price: 50, oldPrice: 60, discount: 10, rating: 4.6, reviews: 300 },
    { image: sec65, brand: "Hotel Rasoi", name: "Paneer Tikka", price: 220, oldPrice: 270, discount: 50, rating: 4.4, reviews: 210 },
    { image: sec66, brand: "Hotel Rasoi", name: "Chicken Curry", price: 280, oldPrice: 330, discount: 50, rating: 4.4, reviews: 210 }
  ];

  return (
    <>
      <ProductRow title="Shop by Category - Clothing" subtitle="Outfits" products={section1} />
      <ProductRow subtitle="Shirts" products={section2} />
      <ProductRow title="Shop by Category - Electronics" subtitle="Mobiles" products={section3} />
      <ProductRow subtitle="Laptops" products={section4} />
      <ProductRow title="Shop by Category - Food" subtitle="Street Food" products={section5} />
      <ProductRow subtitle="Hotel Food" products={section6} />
    </>
  );
};

export default CategorySection;
