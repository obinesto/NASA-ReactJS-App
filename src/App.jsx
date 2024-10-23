import { useEffect, useState } from "react";
import Main from "./components/Main";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";
import fallbackImage from "./assets/ssc2008-10b1.png";

const fallbackData = {
  title: "Milky Way",
  hdurl: fallbackImage,
  explanation: `Like early explorers mapping the continents of our globe, astronomers are busy charting the spiral structure of our galaxy, the Milky Way. Using infrared images from NASA's Spitzer Space Telescope, scientists have discovered that the Milky Way's elegant spiral structure is dominated by just two arms wrapping off the ends of a central bar of stars. Previously, our galaxy was thought to possess four major arms.

The annotated artist's concept illustrates the new view of the Milky Way. The galaxy's two major arms (Scutum-Centaurus and Perseus) can be seen attached to the ends of a thick central bar, while the two now-demoted minor arms (Norma and Sagittarius) are less distinct and located between the major arms.

The major arms consist of the highest densities of both young and old stars; the minor arms are primarily filled with gas and pockets of star-forming activity.

The artist's concept also includes a new spiral arm, called the "Far-3 kiloparsec arm," discovered via a radio-telescope survey of gas in the Milky Way. This arm is shorter than the two major arms and lies along the bar of the galaxy.

Our Sun lies near a small, partial arm called the Orion Arm, or Orion Spur, located between the Sagittarius and Perseus arms.
Source: NASA/JPL-Caltech/R. Hurt (SSC/Caltech) (https://science.nasa.gov/resource/the-milky-way-galaxy)`,
  date: new Date().toISOString().split("T")[0],
};

function App() {
  const NASA_API = import.meta.env.VITE_NASA_API;
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  function handleToggleModal() {
    setShowModal(!showModal);
  }

  useEffect(() => {
    async function fetchAPIData() {
      const today = new Date().toISOString().split("T")[0];
      const localKey = `apodData-${today}`;
      const cachedData = JSON.parse(localStorage.getItem(localKey));

      if (cachedData && cachedData.date === today) {
        setData(cachedData);
        console.log(`fetched from cache today: ${localKey}`);
        return;
      }

      localStorage.clear();
      try {
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${NASA_API}`
        );
        const apiData = await response.json();

        const isDataIncomplete =
          !apiData.title || !apiData.hdurl || !apiData.explanation;
        if (isDataIncomplete) {
          console.warn("API data is incomplete, using fallback data");
          setData(fallbackData);
        } else {
          localStorage.setItem(localKey, JSON.stringify(apiData));
          setData(apiData);
          console.log("fetched from API today");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setData(fallbackData);
      }
    }

    fetchAPIData();
  }, [NASA_API]);

  return (
    <>
      {data ? (
        <Main data={data} />
      ) : (
        <div className="loadingState">
          <i className="fa-solid fa-gear fa-2xl"></i>
          <h2>Loading...</h2>
        </div>
      )}
      {showModal && (
        <SideBar data={data} handleToggleModal={handleToggleModal} />
      )}
      {data && <Footer data={data} handleToggleModal={handleToggleModal} />}
    </>
  );
}

export default App;
