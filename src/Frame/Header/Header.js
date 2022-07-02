import style from './Header.style';
import BackgroundDecor from './BackgroundDecor';
// Importing with !fild-loader! do to this create-react-app bug: https://github.com/facebook/create-react-app/issues/11770
import logo from '!file-loader!./logo.svg'; // eslint-disable-line import/no-webpack-loader-syntax

export default function Header() {
  return (
    <header className={style.header}>
      <BackgroundDecor />
      <img className={style.logo} src={logo} alt="Snap.js" />
      <h3 className={style.subheading}>The copy-paste library</h3>
    </header>
  );
}
