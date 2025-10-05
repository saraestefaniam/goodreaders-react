import "./footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-brand-title">GoodReaders</span>
          <span className="footer-brand-subtitle">Stories worth sharing.</span>
        </div>

        <div className="footer-contact">
          <span>Need help? Email </span>
          <a href="mailto:support@goodreaders.app">support@goodreaders.app</a>
        </div>

        <p className="footer-copy">© {currentYear} Web Dev Bootcamp XVIII · KeepCoding</p>
      </div>
    </footer>
  );
}

export default Footer;
