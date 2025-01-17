import { useContext, useEffect, useState } from "react";
import MaleIcon from "../../svgs/MaleIcon";
import FemaleIcon from "../../svgs/FemaleIcon";
import ActionButton from "../../components/ActionButton";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import { AppContext } from "../../main";
import axios from "axios";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const LOCATION_GET = "https://countriesnow.space/api/v0.1/countries/states";

const Welcome = () => {
  const { userInfo, setUserInfo } = useContext(AppContext);

  const [step, setStep] = useState(0);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [pfName, setPfName] = useState("");
  const [genderSelection, setGenderSelection] = useState(0);
  const [birthTime, setBirthTime] = useState("09:00"); // Default value within min-max range
  const [locationInfo, setLocationInfo] = useState([]);

  const navigate = useNavigate();

  const fetchLocationData = async () => {
    try {
      const response = await axios.get(`${LOCATION_GET}`, {
        headers: {
          "Content-Type": "application/json", // Ensure proper content type
        },
      });

      // Sum up all location
      setLocationInfo(response.data.data);
      console.log("location>>>>>>>>>>>>>>>>>", response.data.data);
    } catch (error) {
      console.error("Error fetching invite data:", error);
      setLocationInfo([]);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthTime(e.target.value);
    console.log("Birth Time >>> ", e.target.value);
  };

  const userInfoChangeHandler = async () => {
    const token = localStorage.getItem("authorization");
    userInfo.isFirstLogin = false;
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/user/info`,
        userInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure proper content type
          },
        }
      );

      if (response) {
        console.log("User info saved successfully!");
      } else {
        console.error("Error saving user info:", await response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    navigate("/profile"); // Navigate to the profile page
  };

  useEffect(() => {
    if (locationInfo?.length) {
      const countriesData: any = locationInfo.map((item) => item?.name); // Map over the array
      setCountries(countriesData); // Update state
    }
  }, [locationInfo]);

  useEffect(() => {
    if (selectedCountry == "") return;
    console.log("selectedCountry>>>>>>>>>>>", selectedCountry);

    const country = locationInfo.find((item) => item?.name === selectedCountry);
    setStates(country ? country?.states : []);
  }, [selectedCountry]);

  useEffect(() => {
    if (
      userInfo &&
      userInfo?.setting != null &&
      userInfo?.setting?.question1 != null &&
      userInfo?.setting?.question2 != null &&
      userInfo?.setting?.question3 != null &&
      userInfo?.setting?.sex != null &&
      userInfo?.setting?.pfName != "" &&
      userInfo?.setting?.birth != null
    ) {
      // Save to database when the user info is complete
      console.log("Save to Database >>>> userInfo", userInfo);
      userInfoChangeHandler();
    }
  }, [userInfo]);

  const handleNext = async () => {
    // Validation: Check if name and birth date are provided
    if (!pfName || !selectedDate) {
      return; // Don't proceed if validation fails
    }

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Add padding to month
    const day = String(selectedDate.getDate()).padStart(2, "0"); // Add padding to day
    const formattedDate = `${year}-${month}-${day}`;

    setUserInfo((prev: any) => ({
      ...prev,
      setting: {
        ...prev.setting,
        sex: genderSelection == 1 ? "male" : "female",
        pfName: pfName,
        birth: formattedDate,
      },
    }));
  };

  const handleInputChange = (event: any) => {
    setPfName(event.target.value); // Update state with input value
  };

  const handleBgClick = () => {
    setStep(1);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleSelectChange = (event: any) => {
    if (
      event.target.value == "Choose a country" ||
      event.target.value == "No locations found"
    )
      return;
    setSelectedCountry(event.target.value);
  };

  const handleSelectedState = (event: any) => {
    if (
      event.target.value == "Choose a state" ||
      event.target.value == "No State found"
    )
      return;
    setSelectedState(event.target.value);
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col items-center justify-start gap-[42px] px-10 py-10"
      onClick={handleBgClick}
    >
      {step == 0 ? (
        <>
          <img src="assets/images/stars.png" className="scale-125"></img>
          <div className="text-[36px] leading-[38px] tracking-[0.4px] font-bold text-[#EAEAEA] flex flex-col gap-[30px]">
            <span>Starts cannot talk without details.....</span>
            <span>Share yours!</span>
          </div>
        </>
      ) : (
        <>
          <img src="assets/images/suns.png"></img>
          <div className="flex flex-col gap-[18px] w-full items-start max-w-[640px]">
            {/* Profile Name */}
            <div className="flex flex-col w-full gap-1">
              <span className="text-[17px] leading-[22px] tracking-[-0.4px] text-[#FFFFFFBF]">
                Your Name
              </span>
              <div className="border-[1px] border-black bg-[#00000075] [box-shadow:0px_0px_0px_1px_rgba(255,255,255,0.25)] rounded-full py-2 px-3 h-[48px] w-full">
                <input
                  className="w-full text-[#FFFFFF99] outline-none cursor-pointer bg-transparent border-none text-[14px] leading-[22px] font-light"
                  placeholder="Enter your name here"
                  value={pfName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1 w-full">
              <label
                className="text-[17px] leading-[22px] tracking-[-0.4px] text-[#FFFFFFBF]"
                htmlFor="datepicker"
              >
                Date of birth
              </label>
              <DatePicker
                id="datepicker"
                selected={selectedDate}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YYYY"
                onChange={handleDateChange}
                showYearDropdown
                showMonthDropdown
                className="w-full outline-none bg-[#00000075] rounded-full border-[1px] border-[#000000] text-[#FFFFFF99] cursor-pointer border-none text-[14px] leading-[22px] tracking-[-0.34px] font-light shadow-[0px_0px_0px_1px_#FFFFFF40]  py-2 px-3 h-[48px] "
              />
            </div>

            {/* Location */}
            {/* <Menu as="div" className="flex flex-col gap-1 w-full"> */}
            <div className="flex flex-col gap-1 w-full">
              <label
                className="text-[17px] leading-[22px] tracking-[-0.4px] text-[#FFFFFFBF]"
                htmlFor="datepicker"
              >
                Location of birth
              </label>
              <div className="flex justify-between gap-2">
                <select
                  id="countries"
                  // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  className="w-full outline-none bg-[#00000075] rounded-full border-[1px] border-[#000000] text-[#FFFFFF99] cursor-pointer border-none text-[14px] leading-[22px] tracking-[-0.34px] font-light shadow-[0px_0px_0px_1px_#FFFFFF40]  py-2 px-3 h-[48px] "
                  onChange={handleSelectChange}
                >
                  <option selected>Choose a country</option>
                  {countries.length > 0 ? (
                    countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))
                  ) : (
                    <option>No locations found</option>
                  )}
                </select>

                <select
                  id="states"
                  place-holder="Choose a location"
                  className="w-full outline-none bg-[#00000075] rounded-full border-[1px] border-[#000000] text-[#FFFFFF99] cursor-pointer border-none text-[14px] leading-[22px] tracking-[-0.34px] font-light shadow-[0px_0px_0px_1px_#FFFFFF40]  py-2 px-3 h-[48px] "
                  onChange={handleSelectedState}
                >
                  <option selected>Choose a state</option>
                  {states.length > 0 ? (
                    states.map((item, index) => (
                      <option key={index} value={index}>
                        {item?.name}
                      </option>
                    ))
                  ) : (
                    // <option>No State Select</option>
                    <></>
                  )}
                </select>
              </div>
            </div>
            {/* </Menu> */}

            {/* Time */}
            <div className="flex flex-col gap-1 w-full">
              <label
                className="text-[17px] leading-[22px] tracking-[-0.4px] text-[#FFFFFFBF]"
                htmlFor="datepicker"
              >
                Time of Birth
              </label>
              <div className="flex">
                {/* Time Input */}
                <input
                  type="time"
                  id="time"
                  className="w-full outline-none bg-[#00000075] rounded-full border-[1px] border-[#000000] text-[#FFFFFF99] cursor-pointer border-none text-[14px] leading-[22px] tracking-[-0.34px] font-light shadow-[0px_0px_0px_1px_#FFFFFF40]  py-2 px-3 h-[48px] "
                  // min="09:00"
                  // max="18:00"
                  value={birthTime}
                  onChange={handleTimeChange}
                  // required
                />
              </div>
            </div>

            <div className="bg-[#00000066] border-[1px] border-black [box-shadow: 0px_0px_0px_1px_rgba(187, 167, 167, 0.15)] rounded-full grid grid-cols-2 p-1 gap-3">
              <div
                className={`${
                  genderSelection == 0
                    ? "bg-[rgb(254,83,187)] text-white"
                    : "bg-transparent text-[#737B84BF]"
                } flex items-center p-2 rounded-full gap-2 pr-4 text-[16.7px] leading-[22px] tracking-[-0.34px] w- `}
                onClick={() => setGenderSelection(0)}
              >
                <FemaleIcon active={genderSelection == 0 ? true : false} />
                <span>Female</span>
              </div>
              <div
                className={`${
                  genderSelection == 1
                    ? "bg-[rgb(254,83,187)] text-white"
                    : "bg-transparent text-[#737B84BF]"
                } flex items-center justify-center p-2 rounded-full gap-2 pr-4 text-[16.7px] leading-[22px] tracking-[-0.34px] `}
                onClick={() => setGenderSelection(1)}
              >
                <MaleIcon active={genderSelection == 1 ? true : false} />
                <span>Male</span>
              </div>
            </div>

            <div className="w-full flex items-center justify-center mt-4">
              <ActionButton
                className="gradient-bg w-[167px] h-[40px] flex justify-center items-center"
                onClick={handleNext}
                // disabled={!name || !selectedDate} // Disable button if validation fails
              >
                <span className="text-[14px] text-white">Next</span>
              </ActionButton>
            </div>

            <div className="text-[#ffffff] text-[14px] mt-4 text-center">
              Providing insufficient or incorrect details could result in
              inaccuracies
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Welcome;
