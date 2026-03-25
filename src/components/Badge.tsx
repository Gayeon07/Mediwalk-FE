interface BadgeProps {
  text: string;
}

const Badge = ({ text }: BadgeProps) => {
  return (
    <div className="px-1.5 py-0.5 text-primary bg-primary-extralight rounded-sm font-semibold text-[13px] leading-[1.4] tracking-[-0.04em]">
      {text}
    </div>
  );
};

export default Badge;
