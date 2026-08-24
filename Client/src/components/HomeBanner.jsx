import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getBanners,
} from "../services/bannerService";

import "./HomeBanner.css";

const HomeBanner = () => {

  const [banners, setBanners] =
    useState([]);

  const [current,
    setCurrent] =
    useState(0);

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const data =
            await getBanners();

          const activeBanners =
            data.filter(
              (banner) =>
                banner.isActive
            );

          setBanners(
            activeBanners
          );

        } catch (error) {

          console.log(error);
        }
      };

    fetchData();

  }, []);

  useEffect(() => {

    if (
      banners.length === 0
    ) {
      return;
    }

    const slider =
      setInterval(() => {

        setCurrent(
          (prev) =>
            prev ===
            banners.length - 1
              ? 0
              : prev + 1
        );

      }, 3000);

    return () =>
      clearInterval(
        slider
      );

  }, [banners]);

  if (
    banners.length === 0
  ) {
    return null;
  }

  return (

    <div className="bb-banner">

      <div className="bb-banner__viewport">

        <Link
          to={
            banners[current]
              ?.product?._id
              ? `/product/${banners[current].product._id}`
              : banners[current].link
          }
          className="bb-banner__link"
        >

          <img
            key={current}
            src={
              banners[current]
                .image?.url
            }

            alt={
              banners[current]
                .title
            }

            className="bb-banner__image"
          />

          <div className="bb-banner__overlay">
            <h2 className="bb-banner__title">
              {
                banners[current]
                  .title
              }
            </h2>
          </div>

        </Link>

      </div>

      {/* Dot Indicators */}
      {banners.length > 1 && (
        <div className="bb-banner__dots">
          {banners.map((_, index) => (
            <button
              key={index}
              className={
                `bb-banner__dot${index === current ? " bb-banner__dot--active" : ""}`
              }
              onClick={() =>
                setCurrent(index)
              }
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default HomeBanner;