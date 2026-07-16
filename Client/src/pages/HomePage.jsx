import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getCompanies,
} from "../services/companyService";

import {
  getFeaturedProducts,
} from "../services/productService";

import HomeBanner from "../components/HomeBanner";

import {
  HiOutlineOfficeBuilding,
  // HiOutlineStar,
  HiOutlineArrowRight,
  // HiOutlineSparkles,
} from "react-icons/hi";

import { RiBusLine } from "react-icons/ri";

import "./HomePage.css";

const HomePage = () => {

  const [companies, setCompanies] =
    useState([]);

  const [
    featuredProducts,
    setFeaturedProducts,
  ] = useState([]);

  // FETCH COMPANIES
  useEffect(() => {

    const fetchCompanies =
      async () => {

        try {

          const data =
            await getCompanies();

          setCompanies(data);

        } catch (error) {

          console.log(error);
        }
      };

    fetchCompanies();

  }, []);

  // FETCH FEATURED PRODUCTS
  useEffect(() => {

    const fetchFeaturedProducts =
      async () => {

        try {

          const data =
            await getFeaturedProducts();

          setFeaturedProducts(
            data
          );

        } catch (error) {

          console.log(error);
        }
      };

    fetchFeaturedProducts();

  }, []);

  return (

    <div className="bb-home">

      {/* ========== HERO SECTION ========== */}

      <section className="bb-hero">
        <div className="bb-hero__orb bb-hero__orb--1" />
        <div className="bb-hero__orb bb-hero__orb--2" />

        <div className="bb-hero__content">
          <div className="bb-hero__badge">
            <RiBusLine />
            Welcome to BLUEEBOARD
          </div>

          <h1 className="bb-hero__title">
            Discover Premium Products
          </h1>

          <p className="bb-hero__subtitle">
            Explore top brands and find the best deals across
            our curated collection of quality products.
          </p>
        </div>
      </section>

      {/* ========== BANNER CAROUSEL ========== */}

      <HomeBanner />

      {/* ========== COMPANIES ========== */}

      <div className="bb-section">

        <div className="bb-section-header">
          <div className="bb-section-header__icon">
            <HiOutlineOfficeBuilding />
          </div>
          <div className="bb-section-header__text">
            <h2 className="bb-section-header__title">
              Companies
            </h2>
            <span className="bb-section-header__subtitle">
              Browse products by brand
            </span>
          </div>
        </div>

        <div className="bb-companies-grid">

          {
            companies.map(
              (company) => (

                <Link
                  key={
                    company._id
                  }

                  to={`/company/${company._id}`}

                  className="bb-company-card"
                >

                  {
                    company.logo ? (

                      <img
                        src={
                          company.logo?.url
                        }

                        alt={
                          company.name
                        }

                        onError={(
                          e
                        ) => {

                          e.target.style.display =
                            "none";
                        }}

                        className="bb-company-card__logo"
                      />

                    ) : (

                      <div
                        className="bb-company-card__placeholder"
                      >
                        <HiOutlineOfficeBuilding />
                      </div>
                    )
                  }

                  <h3
                    className="bb-company-card__name"
                  >
                    {
                      company.name
                    }
                  </h3>

                </Link>
              )
            )
          }

        </div>

      </div>

      {/* LATEST PRODUCTS */}

      {
        featuredProducts
          .length > 0 && (

          <div className="bb-section bb-featured">

            <div>
              <div className="bb-section-header__text">
                <h2 className="bb-section-header__title">
                  {/* Latest Products */}
                </h2>

              </div>
            </div>

            <div className="bb-products-grid">

              {
                featuredProducts.map(
                  (product) => (

                    <Link
                      key={
                        product._id
                      }

                      to={`/product/${product._id}`}

                      className="bb-product-card"
                    >

                      <div className="bb-product-card__image-wrap">
                        
                        <img
                          src={
                            product.images?.[0]?.url ||
                            "https://dummyimage.com/300x200/cccccc/000000&text=No+Image"
                          }

                          alt={
                            product.name
                          }

                          onError={(
                            e
                          ) => {

                            e.target.src =
                              "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
                          }}

                          className="bb-product-card__image"
                        />
                      </div>

                      <div className="bb-product-card__body">

                        <h3 className="bb-product-card__name">
                          {
                            product.name
                          }
                        </h3>

                        <p className="bb-product-card__company">
                          {
                            product
                              .company
                              ?.name
                          }
                        </p>

                        <div className="bb-product-card__footer">
                          <span className="bb-product-card__price">
                            {
                              product.price
                            }
                            <span className="bb-product-card__currency">
                              {" "}EGP
                            </span>
                          </span>

                          <span className="bb-product-card__arrow">
                            <HiOutlineArrowRight />
                          </span>
                        </div>

                      </div>

                    </Link>
                  )
                )
              }

            </div>

          </div>
        )
      }

    </div>
  );
};

export default HomePage;