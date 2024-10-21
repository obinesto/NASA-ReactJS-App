import { useEffect, useState } from "react";
import Main from "./components/Main";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";

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
        localStorage.setItem(localKey, JSON.stringify(apiData));
        setData(apiData);
        console.log("fetched from API today");
      } catch (error) {
        console.error("Error fetching data: ", error);
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
