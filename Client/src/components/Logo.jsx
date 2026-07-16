import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

export default function Logo({
  variant = "header",
  collapsed = false,
  clickable = true,
}) {
  // Determine if tagline is shown based on variant and state
  const showTagline = variant === "login" && !collapsed;
  
  // Mapping variants to css module classes
  const variantMap = {
    header: styles.variantHeader,
    login: styles.variantLogin,
    sidebar: styles.variantSidebar,
  };
  
  const variantClass = variantMap[variant] || styles.variantHeader;
  const collapsedClass = collapsed ? styles.collapsed : "";
  
  const logoContent = (
  <>
    <svg
      className={styles.logoIcon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 72 72"
      width="64"
      height="64"
    >
      <defs>
          <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A3A5C" />
            <stop offset="100%" stopColor="#0D2240" />
          </linearGradient>

          <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2E6DB4" />
            <stop offset="100%" stopColor="#4A90D9" />
          </linearGradient>
        </defs>

        <polygon
          className={styles.hexBorder}
          points="36,4 62,19 62,53 36,68 10,53 10,19"
          fill="url(#iconGrad)"
          stroke="#2E6DB4"
          strokeWidth="1.5"
        />

        <rect className={`${styles.plank} ${styles.plank1}`} x="17" y="24" width="38" height="6" rx="1.5" fill="url(#accent)" />
        <rect className={`${styles.plank} ${styles.plank2}`} x="17" y="33" width="38" height="6" rx="1.5" fill="#fff" opacity="0.92" />
        <rect className={`${styles.plank} ${styles.plank3}`} x="17" y="42" width="38" height="6" rx="1.5" fill="url(#accent)" opacity="0.7" />

        <circle className={styles.nail} cx="21" cy="27" r="1.2" fill="#0D2240" />
        <circle className={styles.nail} cx="51" cy="27" r="1.2" fill="#0D2240" />
        <circle className={styles.nail} cx="21" cy="36" r="1.2" fill="#2E6DB4" />
        <circle className={styles.nail} cx="51" cy="36" r="1.2" fill="#2E6DB4" />
        <circle className={styles.nail} cx="21" cy="45" r="1.2" fill="#0D2240" />
        <circle className={styles.nail} cx="51" cy="45" r="1.2" fill="#0D2240" />
    </svg>

    <div className={styles.logoText}>
      <div className={styles.logoName}>
        <span className={styles.nameBluee}>Bluee</span>
        <span className={styles.nameBoard}>Board</span>
      </div>

      <div className={styles.nameBar}></div>

      {showTagline && (
        <div className={styles.logoTagline}>
          Premium Drywall Supplies
        </div>
      )}
    </div>
  </>
);

  if (!clickable) {
  return (
    <div
      className={`${styles.logoWrap} ${variantClass} ${collapsedClass}`}
      aria-label="BlueeBoard Logo"
    >
      {logoContent}
    </div>
  );
}

return (
  <Link
    to="/"
    className={`${styles.logoWrap} ${variantClass} ${collapsedClass}`}
    aria-label="BlueeBoard Home"
  >
    {logoContent}
  </Link>
);
}