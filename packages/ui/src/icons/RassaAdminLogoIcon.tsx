interface IconProps {
  size?: number;
  className?: string;
}

const RassaAdminLogoIcon = ({ size = 32, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <rect width="32" height="32" rx="7" fill="rgba(255,255,255,0.12)" />
    <rect x="7" y="7" width="8" height="8" rx="1.5" fill="white" />
    <rect x="17" y="7" width="8" height="8" rx="1.5" fill="rgba(255,255,255,0.55)" />
    <rect x="7" y="17" width="8" height="8" rx="1.5" fill="rgba(255,255,255,0.55)" />
    <rect x="17" y="17" width="8" height="8" rx="1.5" fill="rgba(255,255,255,0.25)" />
  </svg>
);

export default RassaAdminLogoIcon;
