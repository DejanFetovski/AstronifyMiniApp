import React, { useEffect, useState } from "react";
import axios from "axios";

interface CountryOption {
  value: string;
  label: string;
  abbreviation: string;
}

interface CountryCitySelectorProps {
  timeZoneId: string | null;
  setTimeZoneId: (timezone: string) => void;
  country: string | null;
  setCountry: (country: string) => void;
  location: string | null;
  setLocation: (location: string) => void;
}

const CountryCitySelector: React.FC<CountryCitySelectorProps> = ({
  timeZoneId,
  setTimeZoneId,
  country,
  setCountry,
  location,
  setLocation,
}) => {
  console.log("TimeZoneId >>>", timeZoneId);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    null
  );

  useEffect(() => {
    if(country !== "") {

      const select: CountryOption | undefined = countries.find(
        (item) => item.value === country
      );
      setSelectedCountry(select || null);
      setCountry(country || "");
    }
  }, [countries])
  
  const handleInputChange = (event: any) => {
    setLocation(event.target.value); // Update state with input value
  };

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      const countryOptions = response.data.map((country: any) => ({
        value: country.name.common,
        label: country.name.common,
        abbreviation: country.cca2,
      }));
      setCountries(countryOptions);
    });
  }, []);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const country: CountryOption | undefined = countries.find(
      (country) => country.value === selectedValue
    );
    setSelectedCountry(country || null);
    setCountry(country?.label || "");
  };

  useEffect(() => {
    if (selectedCountry) {
      console.log("selectedCountry >>>", selectedCountry);
      let input = document.getElementById("cityInput") as HTMLInputElement;

      if (typeof google !== "undefined") {
        const autocomplete = new google.maps.places.Autocomplete(input, {
          types: ["(cities)"],
          componentRestrictions: { country: selectedCountry.abbreviation },
          language: "en",
          fields: ["geometry", "name"] // Specify fields to avoid postal codes
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            console.log("Place: ", place);

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            // Fetch timezone information
            const timestamp = Math.floor(Date.now() / 1000);
            const timezoneApiUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=AIzaSyAnF43a8jSU4PHEwn4FBgYObdiauwOOqgI`;

            axios
              .get(timezoneApiUrl)
              .then((response) => {
                setLocation(place.name);
                setTimeZoneId(response.data.timeZoneId);

                console.log("Place: ", place.formatted_address);
                console.log("TimeZone: ", response.data.timeZoneId);
              })
              .catch((error) => {
                console.error("Error fetching timezone:", error);
              });
          }
        });
      } else {
        console.error("Google Places API is not loaded.");
      }
    }
  }, [selectedCountry]);

  return (
    <div className="flex gap-1 w-full">
      <select
        id="countries"
        className="w-full outline-none bg-[#00000075] rounded-full border-[1px] border-[#000000] text-[#FFFFFF99] cursor-pointer border-none text-[14px] leading-[22px] tracking-[-0.34px] font-light shadow-[0px_0px_0px_1px_#FFFFFF40]  py-2 px-3 h-[48px] "
        onChange={handleCountryChange}
        value={country ? country : "Choose a country"}
      >
        {/* <option selected>Choose a country</option> */}
        {countries.length > 0 ? (
          countries.map((country, index) => (
            <option key={index} defaultValue={country.value}>
              {country.value}
            </option>
          ))
        ) : (
          <option>No locations found</option>
        )}
      </select>

      <input
        id="cityInput"
        className="w-full outline-none bg-[#00000075] rounded-full border-[1px] border-[#000000] text-[#FFFFFF99] cursor-pointer border-none text-[14px] leading-[22px] tracking-[-0.34px] font-light shadow-[0px_0px_0px_1px_#FFFFFF40]  py-2 px-3 h-[48px] "
        type="text"
        placeholder="Enter city or district"
        value={location ?? location}
        onChange={handleInputChange}
      />
      {/* {timezone && <p>Timezone: {timezone}</p>} */}
    </div>
  );
};

export default CountryCitySelector;
