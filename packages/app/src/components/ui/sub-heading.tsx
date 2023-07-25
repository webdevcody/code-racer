interface HeadingProps {
  title: string;
  description: string;
}

export const Subheading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className="mt-5">
      <h2 className="text-xxl md:text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm md:text-base text-muted-foreground">
        {description}
      </p>
      <hr className="mt-3" />
    </div>
  );
};
