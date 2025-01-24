import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomBar from "../../components/BottomBar";
import TaskIcon from "../../svgs/TaskIcon";
import WalletIcon from "../../svgs/WalletIcon";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../main";
import GradientBorder from "../../components/GradientBorder";

const AstronifyImages: { [key: string]: string } = {
  aries: "/assets/astronify_symbol/aries.png",
  aquarius: "/assets/astronify_symbol/aquarius.png",
  cancer: "/assets/astronify_symbol/cancer.png",
  capricorn: "/assets/astronify_symbol/capricorn.png",
  gemini: "/assets/astronify_symbol/gemini.png",
  leo: "/assets/astronify_symbol/leo.png",
  libra: "/assets/astronify_symbol/libra.png",
  pisces: "/assets/astronify_symbol/pisces.png",
  sagittarius: "/assets/astronify_symbol/sagittarius.png",
  scorpio: "/assets/astronify_symbol/scorpio.png",
  taurus: "/assets/astronify_symbol/taurus.png",
  virgo: "/assets/astronify_symbol/virgo.png",
  water: "/assets/astronify_symbol/water.png",
  earth: "/assets/astronify_symbol/earth.png",
  air: "/assets/astronify_symbol/air.png",
  fire: "/assets/astronify_symbol/fire.png",
};

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

  // const handleClickWallet = () => {
  //   navigate("/wallet");
  // };

  const handleClickTasks = () => {
    navigate("/tasks");
  };

  useEffect(() => {
    // if(userInfo == null || userInfo.setting == null)
    console.log("UserInfo has been updated >>>>>>>>>>>>", userInfo);
    const date = new Date(userInfo?.setting.birth);

    // const year = date.getUTCFullYear(); // Get the year
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
      year: birth.getFullYear(),
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
          <span className="text-white text-[14px] leading-[24px] block max-h-[250px] overflow-hidden">
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
                      {sunSign && (
                        <img
                          src={AstronifyImages[sunSign.toLowerCase()]}
                          alt={`${sunSign} icon`}
                          width="20"
                          height="20"
                        />
                      )}
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
                      {element && (
                        <img
                          src={AstronifyImages[element.toLowerCase()]}
                          alt={`${element} icon`}
                          width="20"
                          height="20"
                        />
                      )}
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
                      {moonSign && (
                        <img
                          src={AstronifyImages[moonSign.toLowerCase()]}
                          alt={`${moonSign} icon`}
                          width="20"
                          height="20"
                        />
                      )}
                    </div>
                  </div>
                </GradientBorder>
                <GradientBorder className="" borderWidth={1}>
                  <div className="flex flex-col px-6 py-1 justify-center items-center w-[110px] h-[54px]">
                    <span className="text-white text-[10px] leading-[18px] font-semibold">
                      LUCKY NO.
                    </span>
                    <span className="text-[16px] leading-[27px] text-[#03B1FB] font-semibold">
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
                      {risingSign && (
                        <img
                          src={AstronifyImages[risingSign.toLowerCase()]}
                          alt={`${risingSign} icon`}
                          width="20"
                          height="20"
                        />
                      )}
                    </div>
                  </div>
                </GradientBorder>
                <GradientBorder className="" borderWidth={1}>
                  <div className="flex flex-col px-3 py-1 justify-center items-center w-[110px] h-[54px]">
                    <span className="text-white text-[10px] leading-[18px] font-semibold">
                      CHINESE ZOD
                    </span>
                    <span className="text-[14px] leading-[18px] text-[#03B1FB] font-semibold">
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
