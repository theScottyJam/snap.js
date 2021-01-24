import style from './BackgroundDecor.style'

export default function BackgroundDecor() {
  return (<>
    <div className={style.square1} />
    <div className={style.square2} />
    <div className={style.dotted} />
    <div className={style.squiggle} />
    <div className={style.dottedLine} />
  </>)
}