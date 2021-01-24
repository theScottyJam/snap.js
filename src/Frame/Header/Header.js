import style from './Header.style'
import BackgroundDecor from './BackgroundDecor'
import logo from './logo.svg'

export default function Header() {
  return (
    <header className={style.header}>
      <BackgroundDecor />
      <img className={style.logo} src={logo} alt="Snap.js" />
      <h3 className={style.subheading}>The copy-paste library</h3>
    </header>
  )
}