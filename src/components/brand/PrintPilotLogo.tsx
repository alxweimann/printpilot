import printPilotLogo from "../../assets/logo/printpilot-logo.png";

type PrintPilotLogoVariant = "app" | "print" | "compact";

type PrintPilotLogoProps = {
  className?: string;
  alt?: string;
  variant?: PrintPilotLogoVariant;
};

export function PrintPilotLogo({
  className = "",
  alt = "PrintPilot",
  variant = "app",
}: PrintPilotLogoProps) {
  const classNames = [
    "pp-printpilot-logo",
    `pp-printpilot-logo--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <img className={classNames} src={printPilotLogo} alt={alt} />;
}
