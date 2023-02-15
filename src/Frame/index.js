import style from './index.style';
import Header from './Header';
import Footer from './Footer';
// import PrimaryNav from './PrimaryNav';

export default function Frame({ children, hideFooter, page, setPage }) {
  return (
    <div className={style.frame}>
      <Header />
      {/* <PrimaryNav page={page} setPage={setPage} /> */}
      <div className={style.childrenContainer}>{children}</div>
      {!hideFooter && <Footer />}
    </div>
  );
}
