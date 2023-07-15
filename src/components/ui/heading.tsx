type HeadingProps = ({
  title: string
  description?: string
}) | ({
  title?: string
  description: string
})

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div>
      {title && <h2 className="text-2xl md:text-4xl font-bold tracking-tight">{title}</h2>}
      {description && <p className="text-sm md:text-base text-muted-foreground">{description}</p>}
    </div>
  );
};
