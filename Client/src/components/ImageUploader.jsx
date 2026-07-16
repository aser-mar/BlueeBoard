import { useRef, useState } from "react";
import {
  uploadImage,
  deleteImage,
} from "../services/uploadService";

const ImageUploader = ({
  value,
  onUpload,
  multiple = false,
  label = "Upload Image",
}) => {

  const [uploading, setUploading] =
    useState(false);

  const inputRef = useRef(null);

  if (uploading) return;  

  const uploadHandler = async (e) => {

  const files = Array.from(e.target.files);

  if (!files.length) return;

  try {

      setUploading(true);

      // SINGLE IMAGE
      if (!multiple) {

        // delete old image first
        const image = await uploadImage(files[0]);

        if (value?.public_id) {
        await deleteImage(value.public_id);
        }

        onUpload(image);

      }

      // MULTIPLE IMAGES
      else {

        const uploadedImages =
        await Promise.all(
            files.map(uploadImage)
        );

        onUpload([
          ...(value || []),
          ...uploadedImages,
        ]);

      }

    } catch (error) {

      console.log(error);

      alert(
        "Image upload failed"
      );

    } finally {

      setUploading(false);

      if (inputRef.current) {

        inputRef.current.value = "";

      }

    }

  };

  const removeSingleImage =
    async () => {

      if (uploading) return;  

      if (!value) return;

      try {

        if (value.public_id) {

          await deleteImage(
            value.public_id
          );

        }

        onUpload(null);

      } catch (error) {

        console.log(error);

      }

    };

  const removeMultipleImage =
    async (index) => {
        if (uploading) return;
      const image =
        value[index];

      try {

        if (image.public_id) {

          await deleteImage(
            image.public_id
          );

        }

        const newImages =
          value.filter(
            (_, i) => i !== index
          );

        onUpload(
          newImages
        );

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <div>

      <label
        style={{
          display: "block",
          marginBottom: "10px",
          fontWeight: 600,
        }}
      >
        {label}
      </label>

      <input
        ref={inputRef}
        type="file"
        disabled={uploading}
        accept="image/*"
        multiple={multiple}
        onChange={uploadHandler}
      />

      {uploading && (

        <p
          style={{
            marginTop: "15px",
          }}
        >
          Uploading...
        </p>

      )}

      {!multiple &&
        value?.url && (

          <div
            style={{
              marginTop: "20px",
            }}
          >

            <img
              src={value.url}
              alt="preview"
              style={{
                width: "140px",
                borderRadius: "10px",
                display: "block",
              }}
            />

            <button
              type="button"
              disabled={uploading}
              onClick={removeSingleImage}
              style={{
                marginTop: "10px",
              }}
            >
              Remove
            </button>

          </div>

        )}

      {multiple &&
        Array.isArray(value) &&
        value.length > 0 && (

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              marginTop: "20px",
            }}
          >

            {value.map(
              (
                image,
                index
              ) => (

                <div
                  key={
                    image.public_id ||
                    index
                  }
                >

                  <img
                    src={image.url}
                    alt="preview"
                    style={{
                      width: "120px",
                      borderRadius: "10px",
                      display: "block",
                    }}
                  />

                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() =>
                      removeMultipleImage(
                        index
                      )
                    }
                    style={{
                      marginTop: "8px",
                    }}
                  >
                    Remove
                  </button>

                </div>

              )
            )}

          </div>

        )}

    </div>

  );

};

export default ImageUploader;