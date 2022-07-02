import style from './index.style';
import Header from './Header';
import Footer from './Footer';

export default function Frame({ children }) {
  return (
    <div className={style.frame}>
      <Header />
      <div className={style.childrenContainer}>{children}</div>
      <Footer />
    </div>
  );
}
