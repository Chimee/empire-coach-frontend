import { WhiteLogoSvg } from "../../../svgFiles/WhiteLogoSvg"
import { Image } from "react-bootstrap"
const LoginInfo = ({title}) => {
  return (
    <>
         <div className='p-5'>
        <WhiteLogoSvg/>

        <h2 className="text-white mt-5 title">{title}</h2>
        <Image src="/images/bus-image.png" alt="image" className="bus_image" />
         </div>
    </>
  )
}

export default LoginInfo