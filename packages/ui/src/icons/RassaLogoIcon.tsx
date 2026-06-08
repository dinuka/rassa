interface IconProps {
  size?: number;
  className?: string;
}

const RassaLogoIcon = ({ size = 24, className }: IconProps) => (
  <img
    src="/logo.png"
    alt="Rassa Jobs"
    width={size}
    height={size}
    className={className}
    style={{ objectFit: "contain" }}
  />
);

export default RassaLogoIcon;
