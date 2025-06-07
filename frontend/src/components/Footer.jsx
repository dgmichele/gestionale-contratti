import styles from '../asset/css/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} Bich Immobiliare. Tutti i diritti riservati.</p>
    </footer>
  );
}
