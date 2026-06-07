import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

import {
  getBanners,
  deleteBanner,
} from "../../services/bannerService";

const AdminBannersPage = () => {

  const [banners, setBanners] =
    useState([]);

  const { token } =
    useSelector(
      (state) => state.auth
    );

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const data =
            await getBanners();

          setBanners(data);

        } catch (error) {

          console.log(error);
        }
      };

    fetchData();

  }, []);

  const deleteHandler =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this banner?"
        );

      if (!confirmDelete) {
        return;
      }

      try {

        await deleteBanner(
          id,
          token
        );

        const data =
          await getBanners();

        setBanners(data);

      } catch (error) {

        console.log(error);
      }
    };

  return (
    <div>

      <h1>
        Admin Banners
      </h1>

      <br />

      <Link to="/admin/add-banner">
        Add Banner
      </Link>

      <br />
      <br />

      {banners.map((banner) => (

        <div key={banner._id}>

          <h3>
            {banner.title}
          </h3>

          <img
            src={banner.image}
            alt={banner.title}
            width="250"
          />

          <br />
          <br />

          <Link
            to={`/admin/banners/${banner._id}/edit`}
          >
            Edit
          </Link>

          <button
            onClick={() =>
              deleteHandler(
                banner._id
              )
            }
          >
            Delete
          </button>

          <hr />

        </div>
      ))}
    </div>
  );
};

export default AdminBannersPage;