export default function Header() {
  // import.meta.env.BASE_URL automatically matches the `base` set in
  // vite.config.js — "/" in dev, "/ReactLabs/" in production. Assets in
  // public/ are plain strings Vite doesn't rewrite on its own, so this
  // is the correct way to reference them when base isn't "/".
  const photoUrl = `${import.meta.env.BASE_URL}photo.jpg`;

  return (
    <header className="header">
      <img
        className="header__photo"
        src={photoUrl}
        alt="Portrait of Zhantore Orazymbetov"
      />
      <h1 className="header__name">Zhantore Orazymbetov</h1>
      <p className="header__tagline">
        Information Systems student · Full-stack developer · Programming instructor
      </p>
    </header>
  );
}