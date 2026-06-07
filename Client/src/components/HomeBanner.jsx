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
  <div
    style={{
      position: "relative",
    }}
  >

    <Link
      to={
        banners[current]
          .link
      }
    >

      <img
        src={
          banners[current]
            .image
        }

        alt={
          banners[current]
            .title
        }

        width="100%"
      />

      <h2
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          color: "white",
          background:
            "rgba(0,0,0,0.5)",
          padding: "10px",
        }}
      >
        {
          banners[current]
            .title
        }
      </h2>

    </Link>

  </div>
);}

export default HomeBanner;