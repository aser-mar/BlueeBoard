import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";

import { useDebounce } from "../hooks/useDebounce";

const CompanyProductsPage = () => {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const [loading, setLoading] = useState(false);

  // LOAD CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  // LOAD PRODUCTS (SEARCH + FILTER)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getProducts({
          companyId: id,
          categoryId: category,
          search: debouncedSearch,
        });

        setProducts(data || []);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id, category, debouncedSearch]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Products</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      />

      {/* CATEGORY FILTER */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <option value="">All Categories</option>

        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* LOADING */}
      {loading && <h3>Loading...</h3>}

      {/* PRODUCTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            style={{
              textDecoration: "none",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "10px",
              color: "#000",
            }}
          >
            <h3>{product.name}</h3>
            <p>{product.price} EGP</p>
          </Link>
        ))}
      </div>

      {!loading && products.length === 0 && (
        <h3>No products found</h3>
      )}
    </div>
  );
};

export default CompanyProductsPage;