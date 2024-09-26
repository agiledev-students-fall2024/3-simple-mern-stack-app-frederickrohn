import { useState, useEffect } from 'react';
import axios from 'axios';
import './AboutUs.css';
import loadingIcon from './loading.gif'

/**
 * A React component that holds the About Us page.
 * Fetches title, path to an image, and 2 paragraphs of text content from the backend (back-end/app.js), and displays it
 * @param {*} param0 an object holding any props passed to this component from its parent component.
 * @returns The contents of this component, in JSX form.
 */

//set the initial states of the page
const AboutUs = props => {
  const [aboutUs, setAboutUs] = useState(null); //this will store fetched data
  const [error, setError] = useState(''); //store error if it comes in
  const [loaded, setLoaded] = useState(false); //for checks if the content has loaded

  // the main function of this file
  //sets up loading/displaying data when component loads
  useEffect(() => {
    // Fetch data from /about-us route in backend
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/about-us`)
      .then(response => { //try to get the data from back-end
        setAboutUs(response.data); // Save the data into the state
      })
      .catch(err => { //case when: error occurs -> catch and set error
        const errMsg = JSON.stringify(err); //turn error to string
        setError(errMsg);
      }).finally(() => { //set loaded to true either way
        setLoaded(true)
      });
  }, []);

  //logic to handle loading/errors/content display happens here
  return (
    <div className="AboutUs">
        {!loaded && (<div><img src={loadingIcon} alt="loading" /></div>)}

        {error && (<p className="error">{error}</p>)}

        {loaded && !error && (
            <div className="AboutUsContent">
                <h1>{aboutUs.title}</h1>
                <img src={aboutUs.imageURL} alt="Fred Crumbs Photo" className="about-img" />
                <p>{aboutUs.description1}</p>
                <p>{aboutUs.description2}</p></div>)}
            </div>
  );
};

//make this component available to import, not sure if this is actually needed for this file but it's in Messages.js
export default AboutUs;
