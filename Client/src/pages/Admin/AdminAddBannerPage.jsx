import {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

import {
  createBanner,
} from "../../services/bannerService";

import {
  getCompanies,
} from "../../services/companyService";

const AdminAddBannerPage = () => {

  const navigate =
    useNavigate();

  const [title, setTitle] =
    useState("");

  const [image, setImage] =
    useState("");

  const [link, setLink] =
    useState("");

  const [position,
    setPosition] =
    useState(1);

  const [company,
    setCompany] =
    useState("");

  const [companies,
    setCompanies] =
    useState([]);

  const { token } =
    useSelector(
      (state) => state.auth
    );

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

  const submitHandler =
    async (e) => {

      e.preventDefault();

      try {

        const bannerData = {
          title,
          image,
          link,
          position,
          company,
        };

        await createBanner(
          bannerData,
          token
        );

        alert(
          "Banner Added"
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
        Add Banner
      </h1>

      <form
        onSubmit={submitHandler}
      >

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

        <select
          value={company}
          onChange={(e) =>
            setCompany(
              e.target.value
            )
          }
        >

          <option value="">
            Select Company
          </option>

          {companies.map(
            (company) => (

              <option
                key={company._id}
                value={company._id}
              >
                {company.name}
              </option>
            )
          )}

        </select>

        <br />
        <br />

        <button type="submit">
          Add Banner
        </button>

      </form>
    </div>
  );
};

export default AdminAddBannerPage;