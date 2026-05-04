type PageHeaderProps = {
  title: string;
  description?: string;
  actionLabel?: string;
};

export function PageHeader({ title, description, actionLabel }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>

      {actionLabel ? (
        <button type="button" className="button-primary">
          {actionLabel}
        </button>
      ) : null}
    </header>
  );
}