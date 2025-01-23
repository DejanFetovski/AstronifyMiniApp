import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomBar from "../../components/BottomBar";
import TaskIcon from "../../svgs/TaskIcon";
import WalletIcon from "../../svgs/WalletIcon";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../main";
import GradientBorder from "../../components/GradientBorder";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface GeoData {
  place_name: string;
  latitude: string;
  longitude: string;
  country_code: string;
  timezone_id: string;
}

interface PlanetData {
  name: string;
  fullDegree: number;
  normDegree: number;
  speed: number;
  isRetro: string;
  sign: string;
  house: number;
}

function getZodiacSign(day: number, month: number) {
  const zodiacSigns = [
    {
      name: "Capricorn",
      start: { day: 22, month: 12 },
      end: { day: 19, month: 1 },
    },
    {
      name: "Aquarius",
      start: { day: 20, month: 1 },
      end: { day: 18, month: 2 },
    },
    {
      name: "Pisces",
      start: { day: 19, month: 2 },
      end: { day: 20, month: 3 },
    },
    { name: "Aries", start: { day: 21, month: 3 }, end: { day: 19, month: 4 } },
    {
      name: "Taurus",
      start: { day: 20, month: 4 },
      end: { day: 20, month: 5 },
    },
    {
      name: "Gemini",
      start: { day: 21, month: 5 },
      end: { day: 20, month: 6 },
    },
    {
      name: "Cancer",
      start: { day: 21, month: 6 },
      end: { day: 22, month: 7 },
    },
    { name: "Leo", start: { day: 23, month: 7 }, end: { day: 22, month: 8 } },
    { name: "Virgo", start: { day: 23, month: 8 }, end: { day: 22, month: 9 } },
    {
      name: "Libra",
      start: { day: 23, month: 9 },
      end: { day: 22, month: 10 },
    },
    {
      name: "Scorpio",
      start: { day: 23, month: 10 },
      end: { day: 21, month: 11 },
    },
    {
      name: "Sagittarius",
      start: { day: 22, month: 11 },
      end: { day: 21, month: 12 },
    },
  ];

  for (const sign of zodiacSigns) {
    if (
      (month === sign.start.month && day >= sign.start.day) ||
      (month === sign.end.month && day <= sign.end.day)
    ) {
      return sign.name;
    }
  }
  return "Unknown"; // In case the input doesn't match
}

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AppContext); // Get userInfo from context
  const [logo, setLogo] = useState("");
  const [zodiac, setZodiac] = useState("");
  const [avatar, setAvatar] = useState("");
  const [sunSign, setSunSign] = useState("");
  const [moonSign, setMoonSign] = useState("");
  const [risingSign, setRisingSign] = useState("");
  const [element, setElement] = useState("");
  const [luckyNo, setLuckyNo] = useState("");
  const [chineseZod, setChineseZod] = useState("");
  const [description, setDescription] = useState<string>("");
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const characterLimit = 100; // Set your character limit here

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClickWallet = () => {
    navigate("/wallet");
  };

  const handleClickTasks = () => {
    navigate("/tasks");
  };

  useEffect(() => {
    // if(userInfo == null || userInfo.setting == null)
    console.log("UserInfo has been updated >>>>>>>>>>>>", userInfo);
    const date = new Date(userInfo?.setting.birth);

    const year = date.getUTCFullYear(); // Get the year
    const month = date.getUTCMonth() + 1; // Get the month (0-based, so add 1)
    const day = date.getUTCDate(); // Get the day of the month

    const zodiac = getZodiacSign(day, month);
    setLogo(`assets/astronify/${zodiac.toLowerCase()}.png`);
    setZodiac(zodiac);
    setAvatar(userInfo?.avatar);

    const place = userInfo?.setting?.location.split(",")[0].trim();

    console.log(">>>>>>>>>>>>place>>>>>>>>>>>>", place);

    fetchGeoDetails(place)
      .then((geoDetails) => {
        if (geoDetails == null) return null;

        console.log("Filter Condition =>", place, userInfo.setting.timeZoneId);
        const geoData = geoDetails.filter(
          (geoDetail: any) =>
            geoDetail.place_name === place &&
            geoDetail.timezone_id.toLowerCase() ==
              userInfo.setting.timeZoneId.toLowerCase()
        );

        console.log("================matching Geo data", geoData[0]);
        setGeoData(geoData[0]);
      })
      .catch((err) => console.log(err));
    //
  }, [userInfo]);

  useEffect(() => {
    const place = userInfo?.setting?.location.split(",")[0].trim();
    console.log(">>>>>>>>>>>>place>>>>>>>>>>>>", place);

    fetchPlanetData(geoData)
      .then((planetData) => {
        const sunData = planetData.find(
          (planet: PlanetData) => planet.name === "Sun"
        );
        const moonData = planetData.find(
          (planet: PlanetData) => planet.name === "Moon"
        );
        const risingData = planetData.find(
          (planet: PlanetData) => planet.name === "Ascendant"
        );

        setSunSign(sunData.sign);
        setMoonSign(moonData.sign);
        setRisingSign(risingData.sign);
      })
      .catch((err) => console.log(err));

    // Get Element
    // fetchElements(geoData)
    //   .then((elements) => {})
    //   .catch((err) => console.log(err));
    if (
      zodiac.toLowerCase() === "aries" ||
      zodiac.toLowerCase() === "leo" ||
      zodiac.toLowerCase() === "sagittarius"
    ) {
      setElement("Fire");
    } else if (
      zodiac.toLowerCase() === "taurus" ||
      zodiac.toLowerCase() === "virgo" ||
      zodiac.toLowerCase() === "capricorn"
    ) {
      setElement("Earth");
    } else if (
      zodiac.toLowerCase() === "gemini" ||
      zodiac.toLowerCase() === "libra" ||
      zodiac.toLowerCase() === "aquarius"
    ) {
      setElement("Air");
    } else if (
      zodiac.toLowerCase() === "cancer" ||
      zodiac.toLowerCase() === "scorpio" ||
      zodiac.toLowerCase() === "pisces"
    ) {
      setElement("Water");
    }

    // Get Lucky Number
    fetchLucky()
      .then((res) => {
        setLuckyNo(res.destiny_number || 1);
      })
      .catch((err) => console.log(err));
  }, [geoData]);

  useEffect(() => {
    fetchChineseZod()
      .then((res) => {
        setChineseZod(res.name);
      })
      .catch((err) => console.log(err));
  }, [userInfo]);

  useEffect(() => {
    if (zodiac != "") {
      fetchDescription()
        .then((res) => {
          let descriptions: string[] = [];
          if (res.prediction != null) {
            descriptions.push(res.prediction["personal_life"]);
            descriptions.push(res.prediction["profession"]);
            descriptions.push(res.prediction["health"]);
            descriptions.push(res.prediction["emotions"]);
            descriptions.push(res.prediction["travel"]);
            descriptions.push(res.prediction["luck"]);
          }

          setDescription(
            descriptions[Math.floor(Math.random() * descriptions.length)]
          );
        })
        .catch((err) => console.log(err));
    }
  }, [zodiac]);
  const editProfile = () => {
    navigate("/profileedit"); // Navigate to the profile page
  };

  const fetchGeoDetails = async (place: string) => {
    console.log("[fetchGeoDetail] is called");
    // lat, lon
    const data = {
      place: place,
      maxRows: 7,
    };

    const token = localStorage.getItem("authorization");
    console.log("[fetchGeoDetail - data]>>>>>>>>>", data);

    const response: any = await axios.post(
      `${API_BASE_URL}/api/astronology/get_details`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Ensure proper content type
        },
      }
    );

    if (response.status == 200) {
      console.log("GEO_DETAILS >>>>> ", response.data.data.geonames);
      return response.data.data.geonames;
    } else {
      console.log("fetchGeoDetails failed");
      return null;
    }
  };

  const fetchPlanetData = async (geoData: GeoData) => {
    console.log("------------fetchPlametData-----------------");

    if (geoData == null) return;

    const birth = new Date(userInfo.setting.birth);
    const birthTime = userInfo?.setting.birthTime;
    const [hour, min] = birthTime.split(":");

    console.log("GeoData: ", geoData);
    const data = {
      day: birth.getDate(),
      month: birth.getMonth() + 1,
      year: birth.getFullYear(),
      hour: parseInt(hour),
      min: parseInt(min),
      lat: parseFloat(geoData.latitude),
      lon: parseFloat(geoData.longitude),
      tzone: 4,
    };

    const token = localStorage.getItem("authorization");
    console.log(`api/astrology/planets/tropical - Data : `, data);
    try {
      const response: any = await axios.post(
        `${API_BASE_URL}/api/astronology/planets/tropical`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure proper content type
          },
        }
      );

      if (response.status == 200) {
        console.log("Planet Data >>>>>>>>>>>>>", response.data.data);
        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Planet Data Error>>>>>>>>>", error);
    }
  };

  const fetchLucky = async () => {
    const birth = new Date(userInfo.setting.birth);

    const data = {
      day: birth.getDate(),
      month: birth.getMonth() + 1,
      year: birth.getFullYear(),
      name: userInfo?.setting.pfName,
    };

    try {
      const token = localStorage.getItem("authorization");
      console.log(`api/astrology/numero_table - Data : `, data);

      const response: any = await axios.post(
        `${API_BASE_URL}/api/astronology/numero_table`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure proper content type
          },
        }
      );

      if (response.status == 200) {
        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchChineseZod = async () => {
    const birth = new Date(userInfo.setting.birth);

    const data = {
      day: birth.getDate(),
      month: birth.getMonth() + 1,
      year: birth.getFullYear()
    };

    const token = localStorage.getItem("authorization");
    console.log(`api/astrology/chinese_zodiac - Data : `, data);
    try {
      const response: any = await axios.post(
        `${API_BASE_URL}/api/astronology/chinese_zodiac`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure proper content type
          },
        }
      );

      if (response.status == 200) {
        console.log("Planet Data >>>>>>>>>>>>>", response.data.data);
        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Planet Data Error>>>>>>>>>", error);
    }
  };

  const fetchDescription = async () => {
    const data = {
      zodiac: zodiac,
    };
    const token = localStorage.getItem("authorization");
    console.log(`api/sun_sign_prediction/daily - Data : `, data);
    try {
      const response: any = await axios.post(
        `${API_BASE_URL}/api/astronology/sun_sign_prediction/daily`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure proper content type
          },
        }
      );

      if (response.status == 200) {
        console.log("sun_sign_prediction >>>>>>>>>>>>>", response.data.data);
        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("sun_sign_prediction Error>>>>>>>>>", error);
    }
  };

  const fetchElements = async (geoData: GeoData) => {
    const birth = new Date(userInfo.setting.birth);
    const birthTime = userInfo?.setting.birthTime;
    const [hour, min] = birthTime.split(":");

    const data = {
      day: birth.getDate(),
      month: birth.getMonth(),
      year: birth.getFullYear(),
      hour: parseInt(hour),
      min: parseInt(min),
      lat: parseFloat(geoData.latitude),
      lon: parseFloat(geoData.longitude),
      tzone: 4,
    };

    const token = localStorage.getItem("authorization");

    const response: any = await axios.post(
      `${API_BASE_URL}/api/astronology/natal_chart_interpretation`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Ensure proper content type
        },
      }
    );

    if (response.status == 200) {
      return response.data.data;
    } else {
      return null;
    }
  };
  // Format the birthdate for display (e.g., "February 19, 1989")
  const formattedBirthdate = new Date(
    userInfo.setting.birth
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="horoscope relative h-screen justify-start px-6 py-[30px] pb-[130px]"
    >
      <img
        src="assets/images/diagram.png"
        className="absolute top-0 right-0 z-0"
      ></img>
      <div className="flex flex-col gap-[20px] h-full overflow-x-hidden overflow-y-scroll relative z-10">
        <h1 className="text-[24px] leading-[43px] tracking-[0.4px] text-white">
          Daily Horoscope
        </h1>

        <div className="flex items-center gap-2">
          <img src={avatar} className="rounded-full w-[55px] h-[55px]"></img>
          <div className="flex flex-col gap-2">
            <span className="text-[16px] leading-[21.8px] text-white">
              {userInfo.setting.pfName || "Undefined"}{" "}
            </span>
            <span className="text-[12px] leading-[16.3px] text-[#FFFFFF99]">
              {formattedBirthdate}
              {/*  Display the formatted birthdate */}
            </span>
          </div>
          <div>
            <button
              className="rounded-full w-[55px] h-[55px] scale-50 relative"
              onClick={editProfile}
            >
              <img
                src="assets/images/editbox.png"
                className="rounded-full w-[55px] h-[55px] scale-75"
              ></img>
              <img
                src="assets/images/edit.png"
                className="absolute top-0 center rounded-full w-[55px] h-[55px] scale-75"
              ></img>
            </button>
          </div>
        </div>

        <div>
          <span className="text-white text-[14px] leading-[24px] block max-h-[72px] overflow-hidden">
            {isExpanded ? description : description.slice(0, characterLimit)}
            {description.length > characterLimit && !isExpanded && "..."}
          </span>
          {description.length > characterLimit && (
            <span
              className="text-[13px] leading-[17.7px] underline text-[#03B1FB] pl-2 cursor-pointer"
              onClick={toggleExpand}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </span>
          )}
        </div>

        <div className="w-full flex justify-center">
          <div className="astronify flex justify-center items-center relative">
            <img src={logo} className="w-[115px] h-auto mr-1"></img>
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between">
              <div className="w-full flex justify-between items-center px-8">
                <GradientBorder className="" borderWidth={1}>
                  <div className="flex flex-col px-3 py-1 gap-[6px] items-center w-[110px] h-[54px]">
                    <span className="text-white text-[10px] leading-[18px] font-semibold">
                      SUN SIGN
                    </span>
                    <div className="flex gap-[4px] items-center">
                      <span className="text-white text-[10px] leading-[16px]">
                        {sunSign || " "}
                      </span>
                      <svg
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.4406 12.4033V4.94913C12.6989 4.48598 13.8411 3.76908 14.7913 2.84599C14.9248 2.71675 14.9998 2.54149 14.9998 2.35874C14.9998 2.17599 14.9248 2.00073 14.7913 1.87149C14.6558 1.74604 14.4756 1.67603 14.2881 1.67603C14.1006 1.67603 13.9203 1.74604 13.7848 1.87149C12.2493 3.35459 10.1688 4.1875 7.99986 4.1875C5.83086 4.1875 3.75043 3.35459 2.21495 1.87149C2.07943 1.74604 1.89916 1.67603 1.71166 1.67603C1.52416 1.67603 1.34388 1.74604 1.20837 1.87149C1.07491 2.00073 0.999939 2.17599 0.999939 2.35874C0.999939 2.54149 1.07491 2.71675 1.20837 2.84599C2.15866 3.76908 3.30084 4.48598 4.55914 4.94913V12.4033C3.30084 12.8664 2.15866 13.5833 1.20837 14.5064C1.07491 14.6357 0.999939 14.8109 0.999939 14.9937C0.999939 15.1764 1.07491 15.3517 1.20837 15.4809C1.34399 15.6062 1.52423 15.676 1.71166 15.676C1.89909 15.676 2.07932 15.6062 2.21495 15.4809C3.75043 13.9978 5.83086 13.1649 7.99986 13.1649C10.1688 13.1649 12.2493 13.9978 13.7848 15.4809C13.919 15.6065 14.0988 15.6759 14.2855 15.6743C14.4721 15.6728 14.6507 15.6003 14.7827 15.4725C14.9147 15.3447 14.9895 15.1719 14.9911 14.9912C14.9928 14.8105 14.921 14.6364 14.7913 14.5064C13.8411 13.5833 12.6989 12.8664 11.4406 12.4033ZM10.0168 5.35735V11.9948C8.68689 11.7225 7.31282 11.7225 5.98289 11.9948V5.35735C7.31278 5.63003 8.68693 5.63003 10.0168 5.35735Z"
                          fill="#03B1FB"
                        />
                      </svg>
                    </div>
                  </div>
                </GradientBorder>
                <GradientBorder className="" borderWidth={1}>
                  <div className="flex flex-col px-3 py-1 gap-[6px] items-center w-[110px] h-[54px]">
                    <span className="text-white text-[10px] leading-[18px] font-semibold">
                      ELEMENT
                    </span>
                    <div className="flex gap-[4px] items-center">
                      <span className="text-white text-[10px] leading-[16px]">
                        {element}
                      </span>
                      <svg
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.3333 15.8427C11.5824 15.8409 10.8628 15.5419 10.3318 15.0109C9.80085 14.4799 9.50177 13.7603 9.50001 13.0094V12.676C9.50001 12.4027 9.72668 12.176 10 12.176C10.2733 12.176 10.5 12.4027 10.5 12.676V13.0094C10.5 14.0227 11.32 14.8427 12.3333 14.8427C13.3467 14.8427 14.1667 14.0227 14.1667 13.0094C14.1667 11.996 13.3467 11.176 12.3333 11.176H1.33334C1.06001 11.176 0.833344 10.9494 0.833344 10.676C0.833344 10.4027 1.06001 10.176 1.33334 10.176H12.3333C13.8933 10.176 15.1667 11.4494 15.1667 13.0094C15.1667 14.5694 13.8933 15.8427 12.3333 15.8427ZM12.3333 9.17602H1.33334C1.06001 9.17602 0.833344 8.94935 0.833344 8.67602C0.833344 8.40269 1.06001 8.17602 1.33334 8.17602H12.3333C13.3467 8.17602 14.1667 7.35602 14.1667 6.34269C14.1667 5.32935 13.3467 4.50935 12.3333 4.50935C11.32 4.50935 10.5 5.32935 10.5 6.34269V6.67602C10.5 6.94935 10.2733 7.17602 10 7.17602C9.72668 7.17602 9.50001 6.94935 9.50001 6.67602V6.34269C9.50001 4.78269 10.7733 3.50935 12.3333 3.50935C13.8933 3.50935 15.1667 4.78269 15.1667 6.34269C15.1667 7.90269 13.8933 9.17602 12.3333 9.17602Z"
                          fill="#03B1FB"
                        />
                        <path
                          d="M6.20668 7.17602H1.33334C1.06001 7.17602 0.833344 6.94936 0.833344 6.67602C0.833344 6.40269 1.06001 6.17602 1.33334 6.17602H6.20668C6.92001 6.17602 7.50001 5.59602 7.50001 4.88269C7.50001 4.16936 6.92001 3.58936 6.20668 3.58936C5.49334 3.58936 4.91334 4.16936 4.91334 4.88269V5.13602C4.91334 5.20168 4.90041 5.2667 4.87528 5.32736C4.85016 5.38803 4.81333 5.44315 4.7669 5.48958C4.72047 5.53601 4.66535 5.57284 4.60469 5.59796C4.54402 5.62309 4.479 5.63602 4.41334 5.63602C4.34768 5.63602 4.28266 5.62309 4.222 5.59796C4.16134 5.57284 4.10622 5.53601 4.05979 5.48958C4.01336 5.44315 3.97653 5.38803 3.9514 5.32736C3.92628 5.2667 3.91334 5.20168 3.91334 5.13602V4.88269C3.91334 4.42911 4.04785 3.98572 4.29984 3.60858C4.55183 3.23145 4.91 2.9375 5.32906 2.76393C5.74811 2.59035 6.20922 2.54493 6.65408 2.63342C7.09895 2.72191 7.50758 2.94033 7.82831 3.26106C8.14904 3.58179 8.36746 3.99042 8.45595 4.43528C8.54443 4.88015 8.49902 5.34126 8.32544 5.76031C8.15186 6.17936 7.85792 6.53753 7.48078 6.78953C7.10365 7.04152 6.66026 7.17602 6.20668 7.17602Z"
                          fill="#03B1FB"
                        />
                      </svg>
                    </div>
                  </div>
                </GradientBorder>
              </div>
              <div className="w-full flex justify-between items-center">
                <GradientBorder className="" borderWidth={1}>
                  <div className="flex flex-col px-6 py-1 gap-[6px] items-center justify-center w-[110px] h-[54px]">
                    <span className="text-white text-[10px] leading-[10px] font-semibold">
                      MOON SIGN
                    </span>
                    <div className="flex gap-[4px] items-center">
                      <span className="text-white text-[10px] leading-[16px]">
                        {moonSign}
                      </span>
                      <svg
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.7166 9.16187C14.4051 8.7892 14.0156 8.48949 13.5756 8.28394C13.1356 8.07839 12.6557 7.97202 12.1701 7.97234C11.6844 7.97266 11.2047 8.07966 10.765 8.28579C10.3252 8.49191 9.93609 8.79213 9.62514 9.16521C9.31419 9.53828 9.08899 9.97511 8.96546 10.4448C8.84193 10.9145 8.82309 11.4056 8.91028 11.8834C8.99746 12.3612 9.18854 12.814 9.47 13.2098C9.75146 13.6056 10.1164 13.9347 10.5391 14.1739C9.1836 14.5406 7.75145 14.5116 6.4119 14.0903C5.07235 13.6691 3.88139 12.8731 2.97975 11.7966C2.88607 11.6849 2.76139 11.6036 2.62146 11.5628C2.48153 11.522 2.33265 11.5236 2.19365 11.5674C2.05464 11.6113 1.93175 11.6953 1.84053 11.809C1.74931 11.9227 1.69385 12.0608 1.68117 12.206C1.67241 12.3024 1.68291 12.3996 1.71204 12.4919C1.74118 12.5842 1.78838 12.6698 1.85089 12.7437C2.59542 13.635 3.50933 14.3697 4.53973 14.9054C5.57013 15.4411 6.69654 15.7671 7.85378 15.8645C8.11773 15.8876 8.38054 15.8991 8.64221 15.8989C10.7154 15.9016 12.7226 15.1699 14.3076 13.8335C14.9805 13.2677 15.4014 12.458 15.4781 11.5822C15.5547 10.7064 15.2809 9.836 14.7166 9.16187ZM12.1766 13.1355C11.8123 13.1355 11.4561 13.0274 11.1532 12.825C10.8503 12.6226 10.6142 12.3349 10.4747 11.9983C10.3353 11.6617 10.2988 11.2913 10.3699 10.934C10.441 10.5766 10.6164 10.2484 10.8741 9.99075C11.1317 9.73312 11.4599 9.55768 11.8173 9.4866C12.1746 9.41552 12.545 9.452 12.8816 9.59143C13.2182 9.73085 13.5059 9.96696 13.7083 10.2699C13.9107 10.5728 14.0188 10.929 14.0188 11.2933C14.0183 11.7817 13.824 12.25 13.4787 12.5953C13.1333 12.9407 12.665 13.1349 12.1766 13.1355ZM3.8313 9.81938C4.46208 9.81838 5.07948 9.63748 5.61106 9.29792C6.14263 8.95835 6.56632 8.4742 6.83241 7.9023C7.09849 7.33039 7.19593 6.69445 7.11329 6.06911C7.03064 5.44378 6.77135 4.85498 6.36583 4.37183C6.11261 4.06965 5.8068 3.81576 5.46318 3.62246C6.81872 3.25575 8.2509 3.28477 9.59046 3.70609C10.93 4.12741 12.121 4.92342 13.0225 6.00003C13.1162 6.1117 13.2409 6.19307 13.3808 6.23387C13.5208 6.27466 13.6696 6.27304 13.8086 6.22921C13.9477 6.18539 14.0705 6.10132 14.1618 5.98764C14.253 5.87396 14.3084 5.73579 14.3211 5.59059C14.3299 5.49419 14.3194 5.39702 14.2903 5.30472C14.2611 5.21242 14.2139 5.12683 14.1514 5.05293C12.6426 3.25873 10.4837 2.13633 8.14828 1.93202C5.81291 1.72771 3.49187 2.45817 1.69443 3.96313C1.19208 4.38466 0.826002 4.94569 0.642488 5.57527C0.458975 6.20485 0.466266 6.87471 0.66344 7.50015C0.860615 8.12559 1.23882 8.67851 1.75022 9.08901C2.26163 9.49951 2.88328 9.74915 3.53656 9.80637C3.6353 9.81504 3.73355 9.81938 3.8313 9.81938ZM1.98352 6.5033C1.98352 6.13896 2.09156 5.78281 2.29398 5.47987C2.49639 5.17693 2.78409 4.94082 3.1207 4.8014C3.4573 4.66197 3.8277 4.62549 4.18503 4.69657C4.54237 4.76765 4.87061 4.94309 5.12823 5.20072C5.38586 5.45835 5.56131 5.78658 5.63239 6.14392C5.70347 6.50126 5.66699 6.87165 5.52756 7.20826C5.38813 7.54486 5.15202 7.83256 4.84908 8.03498C4.54615 8.23739 4.18999 8.34543 3.82565 8.34543C3.33725 8.34491 2.869 8.15066 2.52364 7.80531C2.17829 7.45996 1.98404 6.99171 1.98352 6.5033Z"
                          fill="#03B1FB"
                        />
                      </svg>
                    </div>
                  </div>
                </GradientBorder>
                <GradientBorder className="" borderWidth={1}>
                  <div className="flex flex-col px-6 py-1 justify-center items-center w-[110px] h-[54px]">
                    <span className="text-white text-[10px] leading-[18px] font-semibold">
                      LUCKY NO.
                    </span>
                    <span className="text-[16px] leading-[27px] text-[#03B1FB] font-bold">
                      {luckyNo}
                    </span>
                  </div>
                </GradientBorder>
              </div>
              <div className="w-full flex justify-between items-center px-8">
                <GradientBorder className="" borderWidth={1}>
                  <div className="flex flex-col px-6 py-1 justify-center tems-center w-[110px] h-[54px]">
                    <span className="text-white text-[10px] leading-[16px] font-semibold">
                      RISING SIGN
                    </span>
                    <div className="flex gap-[4px] items-center">
                      <span className="text-white text-[10px] leading-[16px]">
                        {risingSign}
                      </span>
                      <svg
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_2_815)">
                          <path
                            d="M2.5 8.89832H8M8 8.89832H13.5M8 8.89832V14.3983M8 8.89832V3.39832"
                            stroke="#03B1FB"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_2_815">
                            <rect
                              width="16"
                              height="16"
                              fill="white"
                              transform="translate(0 0.898315)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </GradientBorder>
                <GradientBorder className="" borderWidth={1}>
                  <div className="flex flex-col px-3 py-1 justify-center items-center w-[110px] h-[54px]">
                    <span className="text-white text-[10px] leading-[18px] font-semibold">
                      CHINESE ZOD
                    </span>
                    <span className="text-[14px] leading-[18px] text-[#03B1FB] font-bold">
                      {chineseZod}
                    </span>
                  </div>
                </GradientBorder>
              </div>
            </div>
          </div>
        </div>

        <span className="text-[24px] leading-[43px] tracking-[0.4px] font-bold text-white text-center">
          {zodiac}
        </span>

        <div className="divider border-[1px] border-[#8B8B8B80] opacity-40 px-[20px]"></div>

        <div className="grid grid-cols-2 text-white gap-[17px]">
          <div
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[rgba(134,134,134,0.5)] to-[rgba(88,88,88,0.5)] border border-[#77777766] rounded-[20px] py-[14px] backdrop-blur-[42px] hover:opacity-50"
            onClick={handleClickTasks}
          >
            <div>
              <TaskIcon />
            </div>
            <span>Tasks</span>
          </div>
          <div
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[rgba(134,134,134,0.5)] to-[rgba(88,88,88,0.5)] border border-[#77777766] rounded-[20px] py-[14px] cursor-not-allowed" /*backdrop-blur-[42px] hover:opacity-50 */
            // onClick={handleClickWallet}
          >
            <div>
              <WalletIcon />
            </div>
            <span>Wallet</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <BottomBar />
      </div>
    </motion.div>
  );
};

export default Profile;
