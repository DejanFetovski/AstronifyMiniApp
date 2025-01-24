import React, { useEffect, useState } from "react";
import axios from "axios";

const timezoneMapping : { [key: string]: string } = {
  "Asia/Calcutta": "Asia/Kolkata",
  "Asia/Rangoon": "Asia/Yangon",
  "Asia/Saigon": "Asia/Ho_Chi_Minh",
  "Europe/Nicosia": "Asia/Nicosia",
  "Pacific/Truk": "Pacific/Chuuk",
  "Pacific/Ponape": "Pacific/Pohnpei",
  "Pacific/Samoa": "Pacific/Pago_Pago",
  "America/Argentina/ComodRivadavia": "America/Argentina/Catamarca",
  "America/Atka": "America/Adak",
  "America/Buenos_Aires": "America/Argentina/Buenos_Aires",
  "America/Catamarca": "America/Argentina/Catamarca",
  "America/Cordoba": "America/Argentina/Cordoba",
  "America/Ensenada": "America/Tijuana",
  "America/Fort_Wayne": "America/Indiana/Indianapolis",
  "America/Indianapolis": "America/Indiana/Indianapolis",
  "America/Jujuy": "America/Argentina/Jujuy",
  "America/Knox_IN": "America/Indiana/Knox",
  "America/Louisville": "America/Kentucky/Louisville",
  "America/Mendoza": "America/Argentina/Mendoza",
  "America/Porto_Acre": "America/Rio_Branco",
  "America/Rosario": "America/Argentina/Cordoba",
  "America/Santa_Isabel": "America/Tijuana",
  "America/Shiprock": "America/Denver",
  "Antarctica/South_Pole": "Antarctica/McMurdo",
  "Asia/Chongqing": "Asia/Shanghai",
  "Asia/Chungking": "Asia/Shanghai",
  "Asia/Kashgar": "Asia/Urumqi",
  "Asia/Ujung_Pandang": "Asia/Makassar",
  "Asia/Ulan_Bator": "Asia/Ulaanbaatar",
  "Atlantic/Faeroe": "Atlantic/Faroe",
  "Atlantic/Jan_Mayen": "Europe/Oslo",
  "Australia/ACT": "Australia/Sydney",
  "Australia/Canberra": "Australia/Sydney",
  "Australia/LHI": "Australia/Lord_Howe",
  "Australia/NSW": "Australia/Sydney",
  "Australia/North": "Australia/Darwin",
  "Australia/Queensland": "Australia/Brisbane",
  "Australia/South": "Australia/Adelaide",
  "Australia/Tasmania": "Australia/Hobart",
  "Australia/Victoria": "Australia/Melbourne",
  "Australia/West": "Australia/Perth",
  "Australia/Yancowinna": "Australia/Broken_Hill",
  "Brazil/Acre": "America/Rio_Branco",
  "Brazil/DeNoronha": "America/Noronha",
  "Brazil/East": "America/Sao_Paulo",
  "Brazil/West": "America/Manaus",
  "Canada/Atlantic": "America/Halifax",
  "Canada/Central": "America/Winnipeg",
  "Canada/Eastern": "America/Toronto",
  "Canada/Mountain": "America/Edmonton",
  "Canada/Newfoundland": "America/St_Johns",
  "Canada/Pacific": "America/Vancouver",
  "Canada/Saskatchewan": "America/Regina",
  "Canada/Yukon": "America/Whitehorse",
  "Chile/Continental": "America/Santiago",
  "Chile/EasterIsland": "Pacific/Easter",
  "Cuba": "America/Havana",
  "Egypt": "Africa/Cairo",
  "Eire": "Europe/Dublin",
  "Europe/Belfast": "Europe/London",
  "Europe/Tiraspol": "Europe/Chisinau",
  "GB": "Europe/London",
  "GB-Eire": "Europe/London",
  "Greenwich": "Etc/GMT",
  "Hongkong": "Asia/Hong_Kong",
  "Iceland": "Atlantic/Reykjavik",
  "Iran": "Asia/Tehran",
  "Israel": "Asia/Jerusalem",
  "Jamaica": "America/Jamaica",
  "Japan": "Asia/Tokyo",
  "Kwajalein": "Pacific/Kwajalein",
  "Libya": "Africa/Tripoli",
  "Mexico/BajaNorte": "America/Tijuana",
  "Mexico/BajaSur": "America/Mazatlan",
  "Mexico/General": "America/Mexico_City",
  "NZ": "Pacific/Auckland",
  "NZ-CHAT": "Pacific/Chatham",
  "Navajo": "America/Denver",
  "PRC": "Asia/Shanghai",
  "Pacific/Johnston": "Pacific/Honolulu",
  "Pacific/Yap": "Pacific/Chuuk",
  "Poland": "Europe/Warsaw",
  "Portugal": "Europe/Lisbon",
  "ROC": "Asia/Taipei",
  "ROK": "Asia/Seoul",
  "Singapore": "Asia/Singapore",
  "Turkey": "Europe/Istanbul",
  "UCT": "Etc/UTC",
  "US/Alaska": "America/Anchorage",
  "US/Aleutian": "America/Adak",
  "US/Arizona": "America/Phoenix",
  "US/Central": "America/Chicago",
  "US/East-Indiana": "America/Indiana/Indianapolis",
  "US/Eastern": "America/New_York",
  "US/Hawaii": "Pacific/Honolulu",
  "US/Indiana-Starke": "America/Indiana/Knox",
  "US/Michigan": "America/Detroit",
  "US/Mountain": "America/Denver",
  "US/Pacific": "America/Los_Angeles",
  "US/Samoa": "Pacific/Pago_Pago",
  "W-SU": "Europe/Moscow",
};

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
    if (country !== "") {
      const select: CountryOption | undefined = countries.find(
        (item) => item.value === country
      );
      setSelectedCountry(select || null);
      setCountry(country || "");
    }
  }, [countries]);

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

      // Sort the country options by label
      countryOptions.sort((a: { label: string }, b: { label: string }) => {
        return a.label.localeCompare(b.label);
      });

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
          fields: ["geometry", "name"], // Specify fields to avoid postal codes
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            console.log("Place: ", place);

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            console.log("Place lat ", place.geometry.location.lat());
            // Fetch timezone information
            const timestamp = Math.floor(Date.now() / 1000);
            const timezoneApiUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=AIzaSyAnF43a8jSU4PHEwn4FBgYObdiauwOOqgI`;

            axios
              .get(timezoneApiUrl)
              .then((response) => {
                setLocation(place.name || "Unknown Location");
                const timezoneId = response.data.timeZoneId
                const updatedTimezoneId = timezoneMapping[timezoneId as string] || timezoneId;

                setTimeZoneId(updatedTimezoneId);

                console.log("Place: ", place.formatted_address);
                console.log("TimeZone: ", updatedTimezoneId);
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
