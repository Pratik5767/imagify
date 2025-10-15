import Description from "../components/Description"
import GenerateBtn from "../components/GenerateBtn"
import Header from "../components/Header"
import Steps from "../components/Steps"
import Testimonial from "../components/Testimonial"

const Home = () => {
    return (
        <div>
            <Header />
            <Steps />
            <Description />
            <Testimonial />
            <GenerateBtn />
        </div>
    )
}

export default Home