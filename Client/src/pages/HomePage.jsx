import {
  useEffect,
  useState,
  useRef,
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
import CompanyFilters from "../components/CompanyFilters";

import {
  HiOutlineOfficeBuilding,
  // HiOutlineStar,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  // HiOutlineSparkles,
} from "react-icons/hi";

import { RiBusLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { getProductImageUrl, onImageError } from "../utils/imageHelper";

import "./HomePage.css";

const HomePage = () => {
  const { t } = useTranslation();

  const [companies, setCompanies] =
    useState([]);

  const [filters, setFilters] = useState({
    region: "All",
    governorate: "All",
    sector: "All",
    search: "",
  });

  const [
    featuredProducts,
    setFeaturedProducts,
  ] = useState([]);

  const companiesTrackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });
  const [dragMoved, setDragMoved] = useState(false);
  const [showCarouselArrows, setShowCarouselArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkCarouselOverflow = () => {
    const track = companiesTrackRef.current;
    if (!track) return;

    const hasOverflow = track.scrollWidth > track.clientWidth + 1;
    setShowCarouselArrows(hasOverflow);

    if (!hasOverflow) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const tolerance = 5;
    const atStart = track.scrollLeft <= tolerance;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - tolerance;

    setCanScrollLeft(!atStart);
    setCanScrollRight(!atEnd);
  };

  const scrollCompanies = (direction) => {
    const track = companiesTrackRef.current;
    if (!track) return;
    const scrollAmount = track.clientWidth * 0.8;
    track.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e) => {
    const track = companiesTrackRef.current;
    setIsDragging(true);
    setDragMoved(false);
    setDragStart({ x: e.pageX - track.offsetLeft, scrollLeft: track.scrollLeft });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setDragMoved(true);
    const track = companiesTrackRef.current;
    const x = e.pageX - track.offsetLeft;
    const walk = (x - dragStart.x) * 1.5;
    track.scrollLeft = dragStart.scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  // FETCH COMPANIES
  useEffect(() => {

    const fetchCompanies =
      async () => {

        try {
          const params = {};
          if (filters.region !== "All") params.region = filters.region;
          if (filters.governorate !== "All") params.governorate = filters.governorate;
          if (filters.sector !== "All") params.sector = filters.sector;
          if (filters.search) params.search = filters.search;

          const data =
            await getCompanies(params);

          setCompanies(data);

        } catch (error) {

          console.log(error);
        }
      };

    fetchCompanies();

  }, [filters]);

  useEffect(() => {
    checkCarouselOverflow();
  }, [companies]);

  useEffect(() => {
    const handleResize = () => {
      checkCarouselOverflow();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [companies]);

  useEffect(() => {
    const track = companiesTrackRef.current;
    if (!track) return;

    const handleScroll = () => {
      checkCarouselOverflow();
    };

    track.addEventListener("scroll", handleScroll);

    return () => {
      track.removeEventListener("scroll", handleScroll);
    };
  }, [companies]);

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
            {t("home.welcome")}
          </div>

          <h1 className="bb-hero__title">
            {t("home.heroTitle")}
          </h1>

          <p className="bb-hero__subtitle">
            {t("home.heroSubtitle")}
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
              {t("home.companiesTitle")}
            </h2>
            <span className="bb-section-header__subtitle">
              {t("home.companiesSubtitle")}
            </span>
          </div>
        </div>

        <CompanyFilters onFilterChange={setFilters} companies={companies} />

        <div className="bb-companies-carousel-wrap">
          {showCarouselArrows && (
            <button
              type="button"
              className={`bb-companies-carousel-arrow bb-companies-carousel-arrow--left ${!canScrollLeft ? "bb-companies-carousel-arrow--disabled" : ""}`}
              onClick={() => scrollCompanies("left")}
              aria-label="Scroll left"
              disabled={!canScrollLeft}
            >
              <HiOutlineArrowLeft />
            </button>
          )}

          <div 
            className="bb-companies-carousel-track" 
            ref={companiesTrackRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onScroll={checkCarouselOverflow}
          >

          {
            companies.map(
              (company) => (

                <Link
                  key={
                    company._id
                  }

                  to={`/company/${company._id}`}

                  className="bb-company-card"
                  onClick={(e) => {
                    if (dragMoved) e.preventDefault();
                  }}
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

          {showCarouselArrows && (
            <button
              type="button"
              className={`bb-companies-carousel-arrow bb-companies-carousel-arrow--right ${!canScrollRight ? "bb-companies-carousel-arrow--disabled" : ""}`}
              onClick={() => scrollCompanies("right")}
              aria-label="Scroll right"
              disabled={!canScrollRight}
            >
              <HiOutlineArrowRight />
            </button>
          )}
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
                            getProductImageUrl(product.images?.[0])
                          }

                          alt={
                            product.name
                          }

                          onError={onImageError}

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
                              {" "}{t("common.currency")}
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