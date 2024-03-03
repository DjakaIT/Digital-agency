# Digital-agency

A project which fetches data from a endpoint api of an digital agency, and showcases data in a react project component.Here, as it was requested, back logic is more important, and design requirements were narrowed down to "just make it responsive, that's all that is asked, considering front - end part.". So, that is what is done here. Still, there is improvements on the logic side, failed to route to the "succesfully reserved" page, other routes work with the new createBrowserRouter, also, filters on the page need to be added. I've used another approach and got close, but code turned into spaggheti syntax, so for now I'll leave it. I will come back to it. The alternative code is below


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function DataFetch() {
  const [apartments, setApartments] = useState([]);
  const [isExpanded, setIsExpanded] = useState({});
  const [selectedDates, setSelectedDates] = useState(null);
  const [selectedGuests, setSelectedGuests] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchApartments() {
      try {
        const res = await fetch(
          "https://api.adriatic.hr/test/accommodation",
          { signal: controller.signal }
        );
        const data = await res.json();
        setApartments(data);
        setIsExpanded(Object.fromEntries(data.map(apartment => [apartment.id, false])));
      } catch (error) {
        console.error("Error fetching apartment data:", error);
      }
    }

    fetchApartments();

    return () => {
      controller.abort();
    };
  }, []);

  function priceListMinMax(apartment) {
    const prices = apartment.pricelistInEuros.map(
      (priceEntry) => priceEntry.pricePerNight
    );
    return `${Math.min(...prices)}€ - ${Math.max(...prices)}€`;
  }

  function expandContent(apartmentId) {
    setIsExpanded((prevExpanded) => ({
      ...prevExpanded,
      [apartmentId]: !prevExpanded[apartmentId],
    }));
  }

  function handleDateChange(date) {
    setSelectedDates(date);
  }

  function handleGuestChange(event) {
    setSelectedGuests(parseInt(event.target.value));
  }

  function toggleAmenity(amenity) {
    setSelectedAmenities((prevAmenities) => {
      if (prevAmenities.includes(amenity)) {
        return prevAmenities.filter((selected) => selected !== amenity);
      } else {
        return [...prevAmenities, amenity];
      }
    });
  }

  const filteredApartments = apartments.filter((apartment) => {
    const datesAvailable = selectedDates
      ? apartment.availableDates.includes(selectedDates)
      : true;

    const capacityAvailable = apartment.capacity >= selectedGuests;

    const amenitiesAvailable = selectedAmenities.every((amenity) =>
      apartment.amenities[amenity]
    );

    return datesAvailable && capacityAvailable && amenitiesAvailable;
  });

  return (
    <div className="pageDiv">
      <div>
        <label htmlFor="dates">Odaberite datume boravka:</label>
        <input
          type="date"
          id="dates"
          onChange={(e) => handleDateChange(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="guests">Odaberite broj gostiju:</label>
        <select id="guests" onChange={handleGuestChange}>
          {[...Array(10)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>
      <div>
        {Object.keys(apartments[0]?.amenities || {}).map((amenity) => (
          <div key={amenity}>
            <input
              type="checkbox"
              id={amenity}
              checked={selectedAmenities.includes(amenity)}
              onChange={() => toggleAmenity(amenity)}
            />
            <label htmlFor={amenity}>{amenity}</label>
          </div>
        ))}
      </div>
      {filteredApartments.length === 0 && <div>Nema dostupnih apartmana.</div>}
      {filteredApartments.map((apartment) => (
        <div key={apartment.id} className="apartment">
          <div className="info">
            <h2>{apartment.title}</h2>
            <img src={apartment.image} alt="apartment image" />
            <p>Capacity: {apartment.capacity}</p>
            <p>Distance to beach: {apartment.beachDistanceInMeters} meters</p>
            <button
              className="showcaseBtn"
              onClick={() => expandContent(apartment.id)}
            >
              Showcase more
            </button>
            {isExpanded[apartment.id] && (
              <>
                <ul className="amenities">
                  <h3>Amenities:</h3>
                  {Object.entries(apartment.amenities).map(([amenity, available]) => (
                    <li key={amenity}>
                      {amenity}: {available ? "✅" : "❌"}
                    </li>
                  ))}
                </ul>
                <h3>Pricelist and dates:</h3>
                <p>Prices: {priceListMinMax(apartment)}</p>
                <p>Available dates: {apartment.availableDates.intervalStart}</p>
                <button>Rezerviraj</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

