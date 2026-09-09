export default function Picture({ photo, size, alt, className, loading }) {
  const src = photo.sources?.[size];
  if (!src) {
    return <img src={photo.originalUrl} alt={alt} className={className} loading={loading} />;
  }
  return (
    <picture>
      <source srcSet={src.webp} type="image/webp" />
      <img src={src.jpg} alt={alt} className={className} loading={loading} />
    </picture>
  );
}
