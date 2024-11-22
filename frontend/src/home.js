import "./home.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [name, setName] = useState("");
  const [Streak, setStreak] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTimeout, setTooltipTimeout] = useState(null);
  const [showTooltipS, setShowTooltipS] = useState(false);
  const [tooltipTimeoutS, setTooltipTimeoutS] = useState(null);
  useEffect(() => {
    // Fetch username
    axios
      .get("http://localhost:8081/home")
      .then((res) => {
        if (res.data.valid) {
          setName(res.data.Username);
        } else {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));

    // Fetch country list from Restcountries API
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((res) => {
        setCountries(res.data);
        setLoadingCountries(false);
      })
      .catch((err) => {
        setError("Failed to fetch country list");
        setLoadingCountries(false);
      });
  }, []);

  axios
    .get("http://localhost:8081/streak") // Replace with your actual streak API endpoint
    .then((res) => {
      if (res.data.success) {
        setStreak(res.data.streak); // Assuming the API response includes a "streak" field
      } else {
        console.log("Failed to fetch streak");
      }
    })
    .catch((err) => console.log("Error fetching streak:", err));

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleMouseEnter = () => {
    // Set a timeout for 2 seconds before showing the tooltip
    const timeout = setTimeout(() => {
      setShowTooltip(true);
    }, 2000); // 2000ms = 2 seconds

    setTooltipTimeout(timeout);
  };

  const handleMouseLeave = () => {
    // Clear the timeout when mouse leaves the button
    clearTimeout(tooltipTimeout);
    setShowTooltip(false);
  };

  const handleMouseEnterS = () => {
    // Set a timeout for 2 seconds before showing the tooltip
    const timeout = setTimeout(() => {
      setShowTooltipS(true);
    }, 2000); // 2000ms = 2 seconds

    setTooltipTimeoutS(timeout);
  };

  const handleMouseLeaveS = () => {
    // Clear the timeout when mouse leaves the button
    clearTimeout(tooltipTimeoutS);
    setShowTooltipS(false);
  };

  const quit = () => {
    axios
      .post("http://localhost:8081/logout") // Replace with your actual logout endpoint
      .then(() => {
        navigate("/"); // Redirect to login page after logout
      })
      .catch((err) => console.error("Logout failed:", err));
  };

  const openGame = () => {
    navigate("/game");
  };

  const openSpecialmode = () => {
    navigate("/specialmode");
  };

  // Handler to set the selected country
  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    const country = countries.find((c) => c.name.common === countryName);
    setSelectedCountry(country);
  };

  return (
    <div className="containe">
      <header className="header">
        {/* Country Selection */}
        <div className="country-selector">
          <label htmlFor="country" className="country-label">
            Select Country:
          </label>
          <select
            id="country"
            className="country-dropdown"
            onChange={handleCountryChange}
            disabled={loadingCountries}
          >
            {loadingCountries ? (
              <option>Loading countries...</option>
            ) : error ? (
              <option>{error}</option>
            ) : (
              countries.map((country) => (
                <option key={country.cca3} value={country.name.common}>
                  {country.name.common}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Username and Streak */}
        <div className="username">Username: {name}</div>
        <div className="streak">
          <span role="img" aria-label="streak">
            🔥
          </span>
          {Streak}
        </div>
      </header>

      {selectedCountry && (
        <main className="country-info">
          <h5>
            <strong>Region:</strong> {selectedCountry.region}
          </h5>
        </main>
      )}

      <main className="main-content">
        <button
          className="button play"
          onClick={openGame}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Play
          {showTooltip && (
            <div className="fixed inset-0 flex justify-center items-center">
              <div className="bg-black p-6 text-center">
                <p>
                  <strong>How to Play:</strong>
                </p>
                <p>You get 5 chances to guess the 5-letter word.</p>
                <p>If the color shows 🟢 the letter is in the correct place.</p>
                <p>If the color is ⚪ the letter is not in the word.</p>
                <p>
                  If the color is 🟡 the letter is in the word but in the wrong
                  position.
                </p>
              </div>
            </div>
          )}
        </button>
        <button
          className="button special"
          onClick={openSpecialmode}
          onMouseEnter={handleMouseEnterS}
          onMouseLeave={handleMouseLeaveS}
        >
          <span role="img" aria-label="streak">
            🌟
          </span>
          Special Mode
          {showTooltipS && (
          <div className="fixed inset-0 flex justify-center items-center">
              <div className="bg-black p-6 text-center">
                <p>
                  <strong>How to Play:</strong>
                </p>
                <p>
                  In this special mode, you should guess the correct number
                  instead of the banana shown in the question. Once you think
                  you know the number, submit your answer to see if you're
                  correct!
                </p>
              </div>
            </div>
          )}
        </button>
        <button className="button quit" onClick={quit}>
          Quit
        </button>
      </main>
    </div>
  );
};

export default Home;
