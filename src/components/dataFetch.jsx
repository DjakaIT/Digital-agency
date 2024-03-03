import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function dataFetch(){

  const [apartments, setApartments] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(null);
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
          } catch (error) {
              console.error("Error fetching apartment data:", error);
          }
      }

      fetchApartments();

      return () => {
          controller.abort();
      };
  }, []);

  if (apartments.length === 0) {
      return <div>Učitavamo vaše podatke...</div>;
  }

  function priceListMinMaX(apartment){
    const prices = apartment.pricelistInEuros.map((priceEntry) => priceEntry.pricePerNight);
    return `${Math.min(...prices)}€ - ${Math.max(...prices)}€`
    
  }

  function expandContent(apartmentId){
    setIsExpanded((prevExpanded) => ({
        ...prevExpanded,
        [apartmentId]: !prevExpanded[apartmentId],
    }));
  }


  function calculatePriceByDate(){

  }
 

    return(
      <div className="pageDiv">
            {apartments.map((apartment) => (
                <div key={apartment.id} className="apartment">
                    <div className="info">
                        <h2>{apartment.title}</h2>
                        <img 
                          src={apartment.image}
                          alt="apartment image"
                        />
                        <p>Capacity: {apartment.capacity}</p> 
                        <p>Distance to beach: {apartment.beachDistanceInMeters} meters</p> 
                        <button className="showcaseBtn" onClick={() => expandContent(apartment.id)}>
                            Showcase more
                        </button>
                        {isExpanded[apartment.id] && (
                            <>
                                <ul className="amenities">
                                    <h3>Amenities:</h3>
                                    <li>Air conditioning: {apartment.amenities.airConditioning ? "✅" : "❌"}</li> 
                                    <li>Parking space: {apartment.amenities.parkingSpace ? "✅" : "❌"}</li> 
                                    <li>Pets allowed: {apartment.amenities.pets ? "✅" : "❌"}</li> 
                                    <li>Pool: {apartment.amenities.pool ? "✅" : "❌"}</li> 
                                    <li>Wi-Fi: {apartment.amenities.wifi ? "✅" : "❌"}</li>
                                    <li>TV: {apartment.amenities.tv ? "✅" : "❌"}</li> 
                                    </ul>
                                <h3>Pricelist and dates:</h3>
                                <p>Prices: {priceListMinMaX(apartment)}</p>
                                <p>Available dates: {apartment.availableDates.intervalStart}</p>
                                <Link to="/reserved"><button>Rezerviraj</button></Link> 
                            </>
                        )}
                        
                    </div>
                </div>
            ))}
            
        </div>
    );
}
    