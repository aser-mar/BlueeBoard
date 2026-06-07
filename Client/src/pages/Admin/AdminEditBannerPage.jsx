import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

import {
  getBannerById,
  updateBanner,
} from "../../services/bannerService";

const AdminEditBannerPage = () => {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const { token } =
    useSelector(
      (state) => state.auth
    );

  const [title,
    setTitle] =
    useState("");

  const [image,
    setImage] =
    useState("");

  const [link,
    setLink] =
    useState("");

  const [position,
    setPosition] =
    useState(1);

  const [isActive,
    setIsActive] =
    useState(true);

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const data =
            await getBannerById(
              id
            );

          setTitle(
            data.title
          );

          setImage(
            data.image
          );

          setLink(
            data.link
          );

          setPosition(
            data.position
          );

          setIsActive(
            data.isActive
          );

        } catch (error) {

          console.log(error);
        }
      };

    fetchData();

  }, [id]);

  const submitHandler =
    async (e) => {

      e.preventDefault();

      try {

        const bannerData = {
          title,
          image,
          link,
          position,
          isActive,
        };

        await updateBanner(
          id,
          bannerData,
          token
        );

        alert(
          "Banner Updated"
        );

        navigate(
          "/admin/banners"
        );

      } catch (error) {

        console.log(error);
      }
    };

  return (
    <div>

      <h1>
        Edit Banner
      </h1>

      <form
        onSubmit={
          submitHandler
        }
      >

        <br />

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) =>
            setImage(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Link"
          value={link}
          onChange={(e) =>
            setLink(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Position"
          value={position}
          onChange={(e) =>
            setPosition(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <label>
          Active
        </label>

        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) =>
            setIsActive(
              e.target.checked
            )
          }
        />

        <br />
        <br />

        <button
          type="submit"
        >
          Save Changes
        </button>

      </form>

    </div>
  );
};

export default
AdminEditBannerPage;