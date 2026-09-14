import './Loader.css'

export default function Loader() {
  return (
    <>
      <div id="overlayer"></div>
      <div className="loader">
        <div className="c-spinning-loader">
          <div className="c-spinning-loader__circle"></div>
          <img
            className="c-spinning-loader__logo"
            src="/images/consulting.png"
            alt="FALKAOH CONSULTING"
          />
        </div>
      </div>
    </>
  )
}
