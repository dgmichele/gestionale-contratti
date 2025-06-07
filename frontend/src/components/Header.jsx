import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from '../asset/css/Header.module.css';
import { FiUser } from 'react-icons/fi';
import logo from '../asset/images/Logo.webp'

export default function Header() {
  const { user, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null); // Riferimento al wrapper contenente icona + menu

  // Quando clicchi fuori dal menu, lo chiude
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Pulizia dell'event listener quando il componente viene rimosso
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <Link to="/"><img className={styles.logo} src={logo} alt="logo" /></Link>

      {/* Wrapper per icona + menu */}
      <div ref={menuRef} className={styles.userIconWrapper}>
        <FiUser
          className={styles.userIcon}
          onClick={() => setMenuVisible((prev) => !prev)}
        />

        <div
          className={`${styles.userMenu} ${
            menuVisible ? styles.show : styles.hide
          }`}
        >
          <p className={styles.userName}>{user?.nome}</p>
          <p className={styles.userEmail}>{user?.email}</p>
          <button className={styles.logoutButton} onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

