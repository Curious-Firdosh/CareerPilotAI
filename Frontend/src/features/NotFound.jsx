import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router for navigation
import '../styles/NotFound.scss';



const NotFound = () => {
  return (
    <div className="not-found-section">
      <div className="not-found-content">
        <div className="not-found-illustration">
        <p className="attribution">
          </p>
        </div>

        <div className="not-found-text-block">
          <h2>Oops!</h2>
          <h3>It seems you've wandered off the track.</h3>
          <p>
            The page you are looking for might have been moved, renamed,
            or doesn't exist. Don't worry; we can help you find your way.
          </p>
        </div>

        {/* Link back to home page */}
        <Link to="/" className="go-home-button">
          Get back on track
        </Link>
      </div>
    </div>
  );
};

export default NotFound;