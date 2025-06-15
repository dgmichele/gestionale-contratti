import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivateLayout({ children }) {
  return (
    <>
      <Header />
        <main>
          {children || <Outlet />}
        </main>
      <Footer />
    </>
  );
}
