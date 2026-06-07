import {
  useState,
} from "react";

import {
  createCompany,
} from "../../services/companyService";

const AdminAddCompanyPage =
  () => {

    const [name, setName] =
      useState("");

    const [
      description,
      setDescription,
    ] = useState("");

    const [logo, setLogo] =
      useState("");

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

          await createCompany(
            companyData
          );

          alert(
            "Company Added"
          );

          setName("");

          setDescription("");

          setLogo("");

        } catch (error) {

          console.log(
            error.response
              ?.data ||
              error.message
          );
        }
      };

    return (

      <div
        className="container"

        style={{
          paddingTop: "40px",
          paddingBottom:
            "40px",
        }}
      >

        <h1
          style={{
            marginBottom:
              "30px",
          }}
        >
          Add Company
        </h1>

        <form
          onSubmit={
            submitHandler
          }

          style={{
            maxWidth: "600px",
          }}
        >

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

              padding:
                "12px",

              marginBottom:
                "20px",

              borderRadius:
                "8px",

              border:
                "1px solid #ccc",
            }}
          />

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

              padding:
                "12px",

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

          <input
            type="text"

            placeholder="Logo URL"

            value={logo}

            onChange={(e) =>
              setLogo(
                e.target.value
              )
            }

            style={{
              width: "100%",

              padding:
                "12px",

              marginBottom:
                "20px",

              borderRadius:
                "8px",

              border:
                "1px solid #ccc",
            }}
          />

          {
            logo && (

              <img
                src={logo}

                alt="Logo Preview"

                style={{
                  width: "120px",

                  height:
                    "120px",

                  objectFit:
                    "cover",

                  borderRadius:
                    "12px",

                  marginBottom:
                    "20px",

                  border:
                    "1px solid #ddd",
                }}
              />
            )
          }

          <br />

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
            Add Company
          </button>

        </form>

      </div>
    );
  };

export default
AdminAddCompanyPage;