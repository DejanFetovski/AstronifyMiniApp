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
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";

const LOCATION_GET = "https://countriesnow.space/api/v0.1/countries/states";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfileEdit = () => {
  const { userInfo, setUserInfo } = useContext(AppContext);
 
  const [isLoading, setIsLoading] = useState(true)

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [pfName, setPfName] = useState("");
  const [genderSelection, setGenderSelection] = useState(0);
  const [birthTime, setBirthTime] = useState("09:00"); // Default value within min-max range
  const [locationInfo, setLocationInfo] = useState([]);

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
    fetchLocationData();
  }, []);

  // Handle time changes
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthTime(e.target.value);
    console.log("Birth Time >>> ", e.target.value);
  };

  const navigate = useNavigate();

  const userInfoChangeHandler = async () => {
    const token = localStorage.getItem("authorization");
    try {
      const response = await axios.patch(
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
    // Loading
    if (isLoading) {
      console.log("UserInfo >>>>>>>>", userInfo);
      setPfName(userInfo?.setting?.pfName);
      setBirthDate(new Date(userInfo?.setting?.birth));
      setBirthTime(userInfo?.setting?.birthTime);

      setSelectedCountry(
        userInfo?.setting?.country !== "" ? userInfo?.setting?.country : ""
      );
      setSelectedState(
        userInfo?.setting?.state !== "" ?  states[userInfo?.setting?.state] : ""
      );
      setGenderSelection(userInfo?.setting?.sex !== "male" ? 0 : 1);
    }
    // Saving
    else {
      userInfoChangeHandler();
    }
  }, [userInfo]);

  const handleNext = async () => {
    // Validation: Check if name and birth date are provided
    console.log(
      "Current States: ",
      pfName,
      birthDate,
      birthTime,
      selectedState,
      selectedCountry
    );
    
    if (
      pfName == "" ||
      birthDate == null ||
      birthTime == "" ||
      selectedCountry == ""
    ) {
      toast.warning("Please fill all of the item");
      return;
    }

    const year = birthDate.getFullYear();
    const month = String(birthDate.getMonth() + 1).padStart(2, "0"); // Add padding to month
    const day = String(birthDate.getDate()).padStart(2, "0"); // Add padding to day

    const formattedDate = `${year}-${month}-${day}`;

    setUserInfo((prev: any) => ({
      ...prev,
      setting: {
        ...prev.setting,
        sex: genderSelection == 1 ? "male" : "female",
        pfName: pfName,
        birth: formattedDate,
        birthTime: birthTime,
        country: selectedCountry,
        state: selectedState,
      },
    }));

    setIsLoading(false)
  };

  const handleInputChange = (event: any) => {
    setPfName(event.target.value); // Update state with input value
  };

  const handleDateChange = (date: Date | null) => {
    console.log("date  ", date)
    setBirthDate(date);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col items-center justify-start gap-[42px] px-10 py-10"
    >
      <img src="assets/images/suns.png"></img>
      <div className="flex flex-col gap-[18px] w-full items-start max-w-[640px]">
        {/* Profile Name */}
        <div className="flex flex-col w-full gap-1">
          <span className="text-[17px] leading-[22px] tracking-[-0.4px] text-[#FFFFFFBF]">
            Your Name
          </span>
          <div className="border-[1px] border-black bg-[#00000075] [box-shadow:0px_0px_0px_1px_rgba(255,255,255,0.25)] rounded-full py-2 px-3 h-[48px] w-full">
            <input
              className="text-[#FFFFFF99] outline-none cursor-pointer bg-transparent border-none text-[14px] leading-[22px] font-light"
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
            selected={birthDate}
            dateFormat="yyyy/MM/dd"
            placeholderText="YYYY/MM/DD"
            onChange={handleDateChange}
            showYearDropdown
            showMonthDropdown
            className="w-full outline-none bg-[#00000075] rounded-full border-[1px] border-[#000000] text-[#FFFFFF99] cursor-pointer border-none text-[14px] leading-[22px] tracking-[-0.34px] font-light shadow-[0px_0px_0px_1px_#FFFFFF40]  py-2 px-3 h-[48px] "
          />
        </div>

        {/* Location */}
        <Menu as="div" className="flex flex-col gap-1 w-full">
          <div className="flex justify-between">
            <select
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-e-lg border-s-gray-100 dark:border-s-gray-700 border-s-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleSelectedState}
            >
              {states.length > 0 ? (
                states.map((item, index) => (
                  <option key={index} value={index}>
                    {item?.name}
                  </option>
                ))
              ) : (
                <option>No State Select</option>
              )}
            </select>
          </div>
        </Menu>

        {/* Time */}
        <Menu as="div" className="flex flex-col gap-1 w-full">
          <label
            className="text-[17px] leading-[22px] tracking-[-0.4px] text-[#FFFFFFBF]"
            htmlFor="location"
          >
            Time
          </label>
          <div>
            {/* <MenuButton className="w-full flex flex-between outline-none bg-[#00000075] rounded-full border-[1px] border-[#000000] text-[#FFFFFF99] cursor-pointer border-none text-[14px] leading-[22px] tracking-[-0.34px] font-light shadow-[0px_0px_0px_1px_#FFFFFF40]  py-2 px-3 h-[48px] ">
              Time of Birth
              
            </MenuButton> */}
            <label
              htmlFor="time"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Time of Birth:
            </label>
            <div className="flex">
              {/* Time Input */}
              <input
                type="time"
                id="time"
                className="rounded-none rounded-s-lg bg-gray-50 border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block flex-1 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                min="09:00"
                max="18:00"
                value={birthTime}
                onChange={handleTimeChange}
                required
              />

              {/* Icon */}
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-s-0 border-s-0 border-gray-300 rounded-e-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1">
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  Account settings
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  Support
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  License
                </a>
              </MenuItem>
              <form action="#" method="POST">
                <MenuItem>
                  <button
                    type="submit"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </form>
            </div>
          </MenuItems>
        </Menu>

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
          >
            <span className="text-[14px] text-white">Next</span>
          </ActionButton>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileEdit;
