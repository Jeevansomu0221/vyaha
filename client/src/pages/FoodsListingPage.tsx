import { useState } from "react";
import { Link } from "react-router-dom";
import "./ProductListingPage.css"; // reuse same styles

// Import food images
import f1 from "../Assets/food/sec5-1.jpg";
import f2 from "../Assets/food/sec5-2.jpg";
import f3 from "../Assets/food/sec5-3.jpg";
import f4 from "../Assets/food/sec5-4.jpg";
import f5 from "../Assets/food/sec5-5.jpg";
import f6 from "../Assets/food/sec6-1.jpg";
import f7 from "../Assets/food/sec6-2.jpg";
import f8 from "../Assets/food/sec6-3.jpg";
import f9 from "../Assets/food/sec6-4.jpg";
import f10 from "../Assets/food/sec6-5.jpg";
import f11 from "../Assets/food/sec6-6.jpg";

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

const FoodsListingPage: React.FC = () => {
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const products: Product[] = [
    {
      id: 1,
      category: "foods",
      image: f1,
      brand: "Fresh Farm",
      name: "Organic Apples (1kg)",
      price: 150,
      oldPrice: 200,
      discount: 50,
      rating: 4.7,
      reviews: 320,
      description: "Fresh and organic apples sourced directly from farms."
    },
    {
      id: 2,
      category: "foods",
      image: f2,
      brand: "Golden Harvest",
      name: "Basmati Rice (5kg)",
      price: 850,
      oldPrice: 950,
      discount: 100,
      rating: 4.8,
      reviews: 150,
      description: "Premium long-grain basmati rice, perfect for biryanis."
    },
    {
      id: 3,
      category: "foods",
      image: f3,
      brand: "Amul",
      name: "Butter 500g",
      price: 250,
      oldPrice: 280,
      discount: 30,
      rating: 4.9,
      reviews: 500,
      description: "Rich and creamy Amul butter for all your cooking needs."
    },
    {
      id: 4,
      category: "foods",
      image: f4,
      brand: "Nescafé",
      name: "Instant Coffee 200g",
      price: 550,
      oldPrice: 600,
      discount: 50,
      rating: 4.6,
      reviews: 400,
      description: "Strong and aromatic instant coffee by Nescafé."
    },
    {
      id: 5,
      category: "foods",
      image: f5,
      brand: "Hershey's",
      name: "Chocolate Syrup 650g",
      price: 300,
      oldPrice: 350,
      discount: 50,
      rating: 4.5,
      reviews: 220,
      description: "Delicious chocolate syrup for milk, desserts, and more."
    },
    {
      id: 6,
      category: "foods",
      image: f6,
      brand: "Nestlé",
      name: "Cornflakes 1kg",
      price: 400,
      oldPrice: 450,
      discount: 50,
      rating: 4.4,
      reviews: 180,
      description: "Crispy and healthy breakfast cereal from Nestlé."
    },
    {
      id: 7,
      category: "foods",
      image: f7,
      brand: "Britannia",
      name: "Whole Wheat Bread",
      price: 50,
      oldPrice: 60,
      discount: 10,
      rating: 4.3,
      reviews: 90,
      description: "Soft and fresh whole wheat bread from Britannia."
    },
    {
      id: 8,
      category: "foods",
      image: f8,
      brand: "Maggi",
      name: "2-Minute Noodles (Pack of 12)",
      price: 150,
      oldPrice: 180,
      discount: 30,
      rating: 4.8,
      reviews: 600,
      description: "Quick and tasty Maggi noodles loved by everyone."
    },
    {
      id: 9,
      category: "foods",
      image: f9,
      brand: "Lay's",
      name: "Classic Salted Chips",
      price: 30,
      oldPrice: 40,
      discount: 10,
      rating: 4.2,
      reviews: 250,
      description: "Crispy potato chips with classic salted flavor."
    },
    {
      id: 10,
      category: "foods",
      image: f10,
      brand: "Pepsi",
      name: "Soft Drink 2L",
      price: 90,
      oldPrice: 110,
      discount: 20,
      rating: 4.5,
      reviews: 300,
      description: "Refreshing 2L bottle of Pepsi."
    },
    {
      id: 11,
      category: "foods",
      image: f11,
      brand: "Mother Dairy",
      name: "Paneer 200g",
      price: 80,
      oldPrice: 100,
      discount: 20,
      rating: 4.6,
      reviews: 170,
      description: "Fresh and soft paneer from Mother Dairy."
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
        <h2>Food & Groceries</h2>
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

export default FoodsListingPage;
