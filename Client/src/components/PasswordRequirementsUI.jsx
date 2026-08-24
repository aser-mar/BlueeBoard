const PasswordRequirementsUI = ({ requirements }) => {
  return (
    <div style={{ display: "grid", gap: "6px", marginTop: "4px" }}>
      {requirements.map((requirement) => (
        <div
          key={requirement.label}
          style={{
            fontSize: "12px",
            color: requirement.valid ? "#15803d" : "#64748b",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>{requirement.valid ? "✓" : "•"}</span>
          <span>{requirement.label}</span>
        </div>
      ))}
    </div>
  );
};

export default PasswordRequirementsUI;
