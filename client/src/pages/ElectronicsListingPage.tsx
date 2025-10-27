import { useState } from "react";
import { Link } from "react-router-dom";
import "./ProductListingPage.css"; // Reuse the same CSS

// Import electronics images from assets
import elec1 from "../Assets/electronics/sec3-1.jpg";
import elec2 from "../Assets/electronics/sec3-2.jpg";
import elec3 from "../Assets/electronics/sec3-3.jpg";
import elec4 from "../Assets/electronics/sec3-4.jpg";
import elec5 from "../Assets/electronics/sec3-5.jpg";
import elec6 from "../Assets/electronics/sec3-6.jpg";

// ✅ Product type
interface Product {
  id: number;
  category: string;
  image: string;
  brand: string;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  description: string;
}

// ✅ Sort options type
type SortOption = "default" | "priceLowHigh" | "priceHighLow" | "ratingHighLow";

const ElectronicsListingPage: React.FC = () => {
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const products: Product[] = [
    {
      id: 1,
      category: "electronics",
      image: elec1,
      brand: "Samsung",
      name: "Galaxy S24 Ultra",
      price: 99999,
      oldPrice: 109999,
      discount: 10000,
      rating: 4.8,
      reviews: 1250,
      description: "Latest Samsung flagship with pro camera system."
    },
    {
      id: 2,
      category: "electronics",
      image: elec2,
      brand: "Apple",
      name: "MacBook Air M3",
      price: 124999,
      oldPrice: 139999,
      discount: 15000,
      rating: 4.9,
      reviews: 980,
      description: "Ultra-thin MacBook Air with M3 chip performance."
    },
    {
      id: 3,
      category: "electronics",
      image: elec3,
      brand: "Sony",
      name: "Noise Cancelling Headphones",
      price: 29999,
      oldPrice: 34999,
      discount: 5000,
      rating: 4.7,
      reviews: 2100,
      description: "Industry-leading noise cancelling headphones."
    },
    {
      id: 4,
      category: "electronics",
      image: elec4,
      brand: "Canon",
      name: "EOS M50 Camera",
      price: 54999,
      oldPrice: 59999,
      discount: 5000,
      rating: 4.6,
      reviews: 800,
      description: "Compact mirrorless camera with 4K video recording."
    },
    {
      id: 5,
      category: "electronics",
      image: elec5,
      brand: "LG",
      name: "4K UHD Smart TV 55\"",
      price: 79999,
      oldPrice: 89999,
      discount: 10000,
      rating: 4.5,
      reviews: 650,
      description: "55-inch LG Smart TV with UHD and HDR support."
    },
    {
      id: 6,
      category: "electronics",
      image: elec6,
      brand: "JBL",
      name: "Bluetooth Party Speaker",
      price: 19999,
      oldPrice: 24999,
      discount: 5000,
      rating: 4.4,
      reviews: 500,
      description: "Powerful JBL speaker with deep bass and portability."
    }
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
        <h2>Electronics</h2>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
        >
          <option value="default">Sort By</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="ratingHighLow">Rating: High to Low</option>
        </select>
      </div>

      <div className="product-grid">
        {sortedProducts.map((item: Product) => (
         <Link
            key={item.id}
            to={`/product/${item.id}`}
            state={{ product: item }}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="product-card">
              <div style={{ position: "relative" }}>
                <img src={item.image} alt={item.name} className="product-image" />
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

export default ElectronicsListingPage;
