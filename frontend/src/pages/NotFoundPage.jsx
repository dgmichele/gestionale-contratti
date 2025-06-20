import { Link } from 'react-router-dom';
import styles from '../asset/css/NotFoundPage.module.css';
import logo from '../asset/images/Logo.webp'
import { FaArrowRight } from "react-icons/fa";

export default function NotFoundPage() {
  return (
    <>
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/"><img className={styles.logo} src={logo} alt="logo" /></Link>
      </div>
    </header>
    <div className={styles.container}>
      <h1>404</h1>
      <p>Oops! Pagina non trovata.</p>
      <Link to="/">Torna alla Home <FaArrowRight className={styles.arrowIcon} /></Link>
    </div>
    <footer>
        <p>© {new Date().getFullYear()} Bich Immobiliare. Tutti i diritti riservati.</p>
    </footer>
    </>
  );
}
