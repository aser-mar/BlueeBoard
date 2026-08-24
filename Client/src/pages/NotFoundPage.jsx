import { useNavigate } from "react-router-dom";
import { HiOutlineHome, HiOutlineSearch } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const { t } = useTranslation();
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
          {t("errors.404")}
        </div>

        <div className="bb-not-found__hero">
          <div className="bb-not-found__icon-wrap" aria-hidden="true">
            <HiOutlineHome className="bb-not-found__icon" />
          </div>
        </div>

        <h1 className="bb-not-found__title">{t("errors.pageNotFound")}</h1>
        <p className="bb-not-found__description">
          {t("errors.pageNotFoundDesc")}
        </p>

        <div className="bb-not-found__actions">
          <button
            type="button"
            className="bb-not-found__button"
            onClick={handleGoBack}
          >
            <HiOutlineHome className="bb-not-found__button-icon" />
            {t("errors.goBack")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;