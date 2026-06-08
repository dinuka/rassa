interface IconProps {
  size?: number;
  className?: string;
}

const RassaAdminLogoIcon = ({ size = 32, className }: IconProps) => (
  <img
    src="/logo.png"
    alt="Rassa Jobs"
    width={size}
    height={size}
    className={className}
    style={{ objectFit: "contain" }}
  />
);

export default RassaAdminLogoIcon;
