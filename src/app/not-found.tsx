export default function NotFound() {
  return (
    <main id="main" className="container not-found">
      <p className="eyebrow">404 / ROUTE NOT FOUND</p>
      <h1>This path ends here.</h1>
      <p>
        The page may have moved. The engineering work is still a good place to
        start.
      </p>
      <a className="button primary" href="/">
        Return home →
      </a>
    </main>
  );
}
