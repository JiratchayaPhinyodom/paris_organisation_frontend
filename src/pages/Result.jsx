// import React from 'react'
// import Dropdown from '../components/dropdown.jsx'
import React, { useState } from "react";
import "../styles/header.css";
import Card from "../components/card";
import "../styles/button.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";

const Result = (props) => {
  const [sportResults, setSportResults] = useState([
    { medal: "Select Medal", country: "Select Country" },
    { medal: "Select Medal", country: "Select Country" },
    { medal: "Select Medal", country: "Select Country" },
  ]);
  const detail = props.sport_detail;
  const [open, setOpen] = useState(false);
  const unduplicatesport = [
    "boxing",
    "badminton",
    "tennis",
    "archery",
    "taekwondo",
  ];
  const url = `https://nongnop.azurewebsites.net/match_table/id/${detail.sport_id}`;
  const database = import.meta.env.VITE_API_RESULT;
  const method = "POST";
  const methodDB = "PUT";

  const updateSportResults = (index, sportResult) => {
    setSportResults((prevResults) => {
      const updatedResults = [...prevResults];
      updatedResults[index] = sportResult;
      return updatedResults;
    });
  };

  const deleteCard = (index) => {
    const updatedResults = [...sportResults];
    updatedResults.splice(index, 1);
    setSportResults(updatedResults);
  };

  const addCard = () => {
    // Add a new card with default values
    setSportResults((prevResults) => [
      ...prevResults,
      { medal: "Select Medal", country: "Select Country" },
    ]);
  };

  const hasDuplicateCountries = () => {
    const countrySet = new Set();
    for (const result of sportResults) {
      if (result.country !== "Select Country") {
        if (countrySet.has(result.country)) {
          return true; // Duplicate found
        }
        countrySet.add(result.country);
      }
    }
    return false; // No duplicates found
  };

  function hasAllMedals(array) {
    let hasGold = false;
    let hasSilver = false;
    let hasBronze = false;

    for (let i = 0; i < array.length; i++) {
      if (array[i].medal === "Gold") {
        hasGold = true;
      } else if (array[i].medal === "Silver") {
        hasSilver = true;
      } else if (array[i].medal === "Bronze") {
        hasBronze = true;
      }
    }

    return hasGold && hasSilver && hasBronze;
  }

  function hasMedalAndCountry(array) {
    for (let i = 0; i < sportResults.length; i++) {
      if (
        array[i].medal === "Select Medal" &&
        array[i].country === "Select Country"
      ) {
        return true;
      }
    }
  }

  function isSportTypeInList(sport_type) {
    // Check if sport_type is defined before calling toLowerCase
    return sport_type && unduplicatesport.includes(sport_type.toLowerCase());
  }

  function hasAllMedals(array) {
    let hasGold = false;
    let hasSilver = false;
    let hasBronze = false;

    for (let i = 0; i < array.length; i++) {
      if (array[i].medal === "Gold") {
        hasGold = true;
      } else if (array[i].medal === "Silver") {
        hasSilver = true;
      } else if (array[i].medal === "Bronze") {
        hasBronze = true;
      }
    }

    return hasGold && hasSilver && hasBronze;
  }
  function hasMedalAndCountry(array) {
    for (let i = 0; i < sportResults.length; i++) {
      if (
        array[i].medal === "Select Medal" &&
        array[i].country === "Select Country"
      ) {
        return true;
      }
    }
  }
  // console.log(sportResults)

  const sendData = (url, method, requestData, destination) => {
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Server responded with status: ${response.status}`);
        }
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Result is already saved!",
          color: "#2e9900",
          showConfirmButton: false,
          timer: 1900,
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            window.location.reload();
          }
        });
      })
      .catch((error) => {
        console.error(`Error sending data to the ${destination}:`, error);
      });
  };

  const sendDataToBackend = () => {
    if (hasMedalAndCountry(sportResults)) {
      Swal.fire({
        icon: "warning",
        title: "Please enter all sport results.",
        confirmButtonColor: "#ffc038",
      });
    } else if (
      isSportTypeInList(detail.sport_type) &&
      !hasAllMedals(sportResults)
    ) {
      Swal.fire({
        icon: "warning",
        title: "This sport can't have \n duplicate medals.",
        text: "The Result should contain all three medal (Gold, Silver, and Bronze).",
        confirmButtonColor: "#ffc038",
      });
    } else if (hasDuplicateCountries()) {
      Swal.fire({
        icon: "warning",
        title: "Duplicate countries found",
        text: "Are you sure you want to enter duplicate countries?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          const sport_id = { sport_id: detail.sport_id };
          const requestData = {
            result: {
              gold: sportResults
                .filter((result) => result.medal === "Gold")
                .map((result) => result.country),
              silver: sportResults
                .filter((result) => result.medal === "Silver")
                .map((result) => result.country),
              bronze: sportResults
                .filter((result) => result.medal === "Bronze")
                .map((result) => result.country),
            },
          };
          const dataWithSportID = {
            ...sport_id,
            ...requestData,
          };
          console.log(dataWithSportID);
          console.log(requestData);
          sendData(database, methodDB, dataWithSportID, "backend");
          sendData(url, method, requestData, "IOC");
        }
      });
    } else {
      const sport_id = { sport_id: detail.sport_id };
      const requestData = {
        result: {
          gold: sportResults
            .filter((result) => result.medal === "Gold")
            .map((result) => result.country),
          silver: sportResults
            .filter((result) => result.medal === "Silver")
            .map((result) => result.country),
          bronze: sportResults
            .filter((result) => result.medal === "Bronze")
            .map((result) => result.country),
        },
      };
      const dataWithSportID = {
        ...sport_id,
        ...requestData,
      };
      console.log(dataWithSportID);
      console.log(requestData);
      sendData(database, methodDB, dataWithSportID, "backend");
      sendData(url, method, requestData, "IOC");
    }
  };

  return (
    <>
      <div className="result">
        {props.sport_detail && props.sport_detail.sport_type && (
          <div className="btt-con">
            <div className="save-btt">
              <button onClick={sendDataToBackend}>Save</button>
            </div>
            <div className="add-btt">
              {!isSportTypeInList(detail.sport_type) && (
                <button onClick={addCard}>Add</button>
              )}
            </div>
            <div className="delete-btt">
              {sportResults.map(
                (result, index) =>
                  index > 2 && (
                    <button key={index} onClick={() => deleteCard(index)}>
                      Delete
                    </button>
                  )
              )}
            </div>
          </div>
        )}

        <div className="resulttable">
          <div className="dropdown1">
            {sportResults.map((result, index) => (
              <Card
                key={index}
                updateSportResults={(newResult) =>
                  updateSportResults(index, newResult)
                }
                countries={detail.participating_country}
                onDelete={() => deleteCard(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Result;
