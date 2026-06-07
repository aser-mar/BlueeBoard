import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  getCompanyById,
  updateCompany,
} from "../../services/companyService";

const AdminEditCompanyPage =
  () => {

    const { id } =
      useParams();

    const navigate =
      useNavigate();

    const [name, setName] =
      useState("");

    const [
      description,
      setDescription,
    ] = useState("");

    const [logo, setLogo] =
      useState("");

    const [loading, setLoading] =
      useState(true);

    const [imgError,
      setImgError] =
      useState(false);

    useEffect(() => {

      const fetchCompany =
        async () => {

          try {

            setLoading(true);

            const data =
              await getCompanyById(
                id
              );

            setName(
              data.name || ""
            );

            setDescription(
              data.description ||
                ""
            );

            setLogo(
              data.logo || ""
            );

          } catch (error) {

            console.log(error);

          } finally {

            setLoading(false);
          }
        };

      fetchCompany();

    }, [id]);

    const submitHandler =
      async (e) => {

        e.preventDefault();

        try {

          const companyData =
            {
              name,
              description,
              logo,
            };

          await updateCompany(
            id,
            companyData
          );

          alert(
            "Company Updated"
          );

          navigate(
            "/admin/companies"
          );

        } catch (error) {

          console.log(error);
        }
      };

    if (loading) {

      return (
        <h2>
          Loading...
        </h2>
      );
    }

    return (

      <div
        className="container"
        style={{
          paddingTop: "40px",
          paddingBottom:
            "40px",
        }}
      >

        <h1>
          Edit Company
        </h1>

        <form
          onSubmit={
            submitHandler
          }
          style={{
            maxWidth: "600px",
          }}
        >

          {/* NAME */}
          <input
            type="text"
            placeholder="Company Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "12px",
              marginBottom:
                "20px",
              borderRadius:
                "8px",
              border:
                "1px solid #ccc",
            }}
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            rows="5"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom:
                "20px",
              borderRadius:
                "8px",
              border:
                "1px solid #ccc",
              resize:
                "none",
            }}
          />

          {/* LOGO INPUT */}
          <input
            type="text"
            placeholder="Logo URL"
            value={logo}
            onChange={(e) => {
              setLogo(
                e.target.value
              );
              setImgError(
                false
              );
            }}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom:
                "15px",
              borderRadius:
                "8px",
              border:
                "1px solid #ccc",
            }}
          />

          {/* SAFE LOGO PREVIEW */}
          {logo &&
            !imgError && (
              <img
                src={logo}
                alt="logo"
                onError={() =>
                  setImgError(
                    true
                  )
                }
                style={{
                  width:
                    "120px",
                  height:
                    "120px",
                  objectFit:
                    "cover",
                  borderRadius:
                    "50%",
                  border:
                    "1px solid #ddd",
                  marginBottom:
                    "20px",
                }}
              />
            )}

          {/* FALLBACK UI */}
          {logo &&
            imgError && (
              <div
                style={{
                  width:
                    "120px",
                  height:
                    "120px",
                  borderRadius:
                    "50%",
                  background:
                    "#eee",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  marginBottom:
                    "20px",
                }}
              >
                No Logo
              </div>
            )}

          <button
            type="submit"
            style={{
              padding:
                "12px 20px",
              border: "none",
              borderRadius:
                "8px",
              background:
                "#111",
              color: "#fff",
              cursor:
                "pointer",
            }}
          >
            Save Changes
          </button>

        </form>

      </div>
    );
  };

export default
AdminEditCompanyPage;