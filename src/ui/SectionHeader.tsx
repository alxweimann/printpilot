type SectionHeaderProps = {
  children: string;
};

export function SectionHeader({ children }: SectionHeaderProps) {
  return <div className="form-section-title">{children}</div>;
}
