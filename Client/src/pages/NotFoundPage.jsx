import { useNavigate } from "react-router-dom";
import { HiOutlineHome, HiOutlineSearch } from 'react-icons/hi';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

const handleGoBack = () => {
  if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate("/");
  }
};
  return (
    <div className="bb-not-found">
      <div className="bb-not-found__background" aria-hidden="true">
        <div className="bb-not-found__blob bb-not-found__blob--1"></div>
        <div className="bb-not-found__blob bb-not-found__blob--2"></div>
      </div>

      <div className="bb-not-found__card">
        <div className="bb-not-found__badge">
          <HiOutlineSearch className="bb-not-found__badge-icon" />
          404 error
        </div>

        <div className="bb-not-found__hero">
          <div className="bb-not-found__icon-wrap" aria-hidden="true">
            <HiOutlineHome className="bb-not-found__icon" />
          </div>
        </div>

        <h1 className="bb-not-found__title">Oops! The page you're looking for doesn't exist.</h1>
        <p className="bb-not-found__description">
          The route you tried to open may have moved, been removed, or never existed. Let’s get you back to the BlueeBoard experience.
        </p>

        <div className="bb-not-found__actions">
          <button
            type="button"
            className="bb-not-found__button"
            onClick={handleGoBack}
          >
            <HiOutlineHome className="bb-not-found__button-icon" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;