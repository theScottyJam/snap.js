import Header from './Header'

export default function Frame({ children }) {
  return (<div>
    <Header />
    <div>{children}</div>
  </div>)
}