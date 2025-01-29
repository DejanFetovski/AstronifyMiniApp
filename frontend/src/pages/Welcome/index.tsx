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
import CountryCitySelector from "../../components/CountryCitySelector";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Welcome = () => {
  const { userInfo, setUserInfo } = useContext(AppContext);

  const [step, setStep] = useState(0);

  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");
  const [timeZoneId, setTimeZoneId] = useState<string | null>(null);

  // Profile Name
  const [pfName, setPfName] = useState("");

  // Gender
  const [genderSelection, setGenderSelection] = useState(0);

  // BirthTime
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [birthTime, setBirthTime] = useState("09:00"); // Default value within min-max range

  const navigate = useNavigate();

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
    if (!pfName || !birthDate) {
      return; // Don't proceed if validation fails
    }

    const year = birthDate.getFullYear();
    const month = String(birthDate.getMonth() + 1).padStart(2, "0"); // Add padding to month
    const day = String(birthDate.getDate()).padStart(2, "0"); // Add padding to day
    const birth = `${year}-${month}-${day}`;

    setUserInfo((prev: any) => ({
      ...prev,
      setting: {
        ...prev.setting,
        sex: genderSelection == 1 ? "male" : "female",
        pfName: pfName,
        birth: birth,
        birthTime: birthTime,
        country: country,
        location: location,
        timeZoneId: timeZoneId,
      },
    }));
  };

  const handleInputChange = (event: any) => {
    setPfName(event.target.value); // Update state with input value
  };

  const handleBgClick = () => {
    setStep(1);
  };

  const handleDateChange = (birthDate: Date | null) => {
    setBirthDate(birthDate);
  };

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
            <span>Stars cannot talk without details.....</span>
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
                selected={birthDate}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YYYY"
                onChange={handleDateChange}
                showYearDropdown
                yearDropdownItemNumber={100} // Adjust the number of years shown
                scrollableYearDropdown
                showMonthDropdown
                className="w-full outline-none bg-[#00000075] rounded-full border-[1px] border-[#000000] text-[#FFFFFF99] cursor-pointer border-none text-[14px] leading-[22px] tracking-[-0.34px] font-light shadow-[0px_0px_0px_1px_#FFFFFF40]  py-2 px-3 h-[48px] "
              />
            </div>

            {/* Location */}
            <CountryCitySelector
              timeZoneId={timeZoneId}
              setTimeZoneId={setTimeZoneId}
              country={country}
              setCountry={setCountry}
              location={location}
              setLocation={setLocation}
            />

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
                  value={birthTime}
                  onChange={handleTimeChange}
                />
              </div>
            </div>

            <div className="bg-[#00000066] border-[1px] border-black [box-shadow: 0px_0px_0px_1px_rgba(187, 167, 167, 0.15)] rounded-full grid grid-cols-2 p-1 gap-3">
              <div
                className={`${genderSelection == 0
                    ? "bg-[rgb(254,83,187)] text-white"
                    : "bg-transparent text-[#737B84BF]"
                  } flex items-center p-2 rounded-full gap-2 pr-4 text-[16.7px] leading-[22px] tracking-[-0.34px] w- `}
                onClick={() => setGenderSelection(0)}
              >
                <FemaleIcon active={genderSelection == 0 ? true : false} />
                <span>Female</span>
              </div>
              <div
                className={`${genderSelection == 1
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
