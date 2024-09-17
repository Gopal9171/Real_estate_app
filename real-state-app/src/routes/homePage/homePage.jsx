import { useContext } from 'react';
import SearchBar from '../../components/searchBar/SearchBar';
import './homePage.scss';
import { AuthContext } from '../../context/authContext.jsx'
function HomePage() {


    const { currentUser } = useContext(AuthContext);
    console.log("gopal patidar");
    console.log( "val",currentUser);
    return (
        <div className='homePage'>
            <div className="textContainer">
                <div className='wrapper'>
                    <h1 className='title'>Find Real Estate & Get Your Dream Place </h1>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam laudantium consectetur perferendis consequatur repudiandae, obcaecati dolorem voluptatibus qui nostrum aut sequi praesentium fugit alias enim sit quaerat expedita. Voluptate, voluptas?</p>
                    <SearchBar />
                    <div className='boxes'>
                        <div className='box'>
                            <h1>16+</h1>
                            <h2>Year of Experience</h2>
                        </div>
                        <div className='box'>
                            <h1>200</h1>
                            <h2>Award Gained</h2>
                        </div>
                        <div className='box'>
                            <h1>1200+</h1>
                            <h2>Property Ready</h2>
                        </div>
                    </div>
                </div>

            </div>
            <div className="imgContainer">
                <img src="/bg.png" alt="" />
            </div>
        </div>
    )

}
export default HomePage;