import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleClickProfile = () => {
    console.log("handleClickProfile");
    navigate("/profile");
  };

  const handleClickAgent = () => {
    console.log("handleClickAgent");
    navigate("/horoscope");
  };

  const handleClickInvite = () => {
    console.log("handleClickInvite");
    navigate("/invite");
  };

  useEffect(() => {
    console.log("bottombar location = ", location);
    if (location.pathname == "/profile") {
    }
  }, [location]);
  return (
    <div className="absolute bottom-[32px] flex justify-center">
      <div className="relative max-w-[321px] flex flex-col items-center justify-center">
        <img src="assets/images/bottombar.png" className="w-full"></img>
        <div className="absolute w-full h-full top-0 left-0 grid grid-cols-[123fr_75fr_123fr]">
          <button
            onClick={handleClickProfile}
            className="flex flex-col items-center justify-end pb-1"
          >
            <svg
              width="25"
              height="28"
              viewBox="0 0 25 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.7917 7C19.7917 8.85652 19.0234 10.637 17.656 11.9497C16.2885 13.2625 14.4339 14 12.5 14C10.5661 14 8.71147 13.2625 7.34401 11.9497C5.97656 10.637 5.20833 8.85652 5.20833 7C5.20833 5.14348 5.97656 3.36301 7.34401 2.05025C8.71147 0.737498 10.5661 0 12.5 0C14.4339 0 16.2885 0.737498 17.656 2.05025C19.0234 3.36301 19.7917 5.14348 19.7917 7ZM17.7083 7C17.7083 5.67392 17.1596 4.40215 16.1828 3.46447C15.2061 2.52678 13.8813 2 12.5 2C11.1187 2 9.7939 2.52678 8.81715 3.46447C7.8404 4.40215 7.29167 5.67392 7.29167 7C7.29167 8.32608 7.8404 9.59785 8.81715 10.5355C9.7939 11.4732 11.1187 12 12.5 12C13.8813 12 15.2061 11.4732 16.1828 10.5355C17.1596 9.59785 17.7083 8.32608 17.7083 7ZM3.64583 16C2.6789 16 1.75157 16.3687 1.06784 17.0251C0.384114 17.6815 0 18.5717 0 19.5V20C0 22.393 1.58646 24.417 3.83854 25.793C6.10312 27.177 9.16875 28 12.5 28C15.8312 28 18.8958 27.177 21.1615 25.793C23.4135 24.417 25 22.393 25 20V19.5C25 18.5717 24.6159 17.6815 23.9322 17.0251C23.2484 16.3687 22.3211 16 21.3542 16H3.64583ZM2.08333 19.5C2.08333 19.1022 2.24795 18.7206 2.54098 18.4393C2.834 18.158 3.23143 18 3.64583 18H21.3542C21.7686 18 22.166 18.158 22.459 18.4393C22.752 18.7206 22.9167 19.1022 22.9167 19.5V20C22.9167 21.473 21.9375 22.949 20.0427 24.106C18.1604 25.256 15.4969 26 12.5 26C9.50312 26 6.83958 25.256 4.95729 24.106C3.06146 22.95 2.08333 21.472 2.08333 20V19.5Z"
                fill={`${
                  location.pathname == "/profile" ? "#A175D2" : "white"
                }`}
              />
            </svg>
            <span
              className={`${
                location.pathname == "/profile"
                  ? "text-[#A175D2]"
                  : "text-white"
              } text-[16px] leading-[21.8px]`}
            >
              Profile
            </span>
          </button>
          <button
            onClick={handleClickAgent}
            className="flex flex-col items-center gap-1 pt-2"
          >
            <svg
              width="33"
              height="32"
              viewBox="0 0 33 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M27.8099 11.1774L27.4545 12.0066C27.399 12.1416 27.3053 12.257 27.1853 12.3381C27.0652 12.4192 26.9242 12.4625 26.7799 12.4625C26.6357 12.4625 26.4947 12.4192 26.3746 12.3381C26.2546 12.257 26.1609 12.1416 26.1053 12.0066L25.75 11.1774C25.1252 9.71053 23.981 8.53442 22.5431 7.88115L21.4467 7.38451C21.3137 7.32246 21.2011 7.22302 21.1221 7.098C21.0431 6.97297 21.0011 6.8276 21.0011 6.67911C21.0011 6.53062 21.0431 6.38525 21.1221 6.26022C21.2011 6.1352 21.3137 6.03577 21.4467 5.97371L22.4825 5.50638C23.9565 4.83449 25.1203 3.61488 25.7341 2.09878L26.0996 1.20366C26.1532 1.065 26.2469 0.945964 26.3682 0.862059C26.4896 0.778154 26.6331 0.733276 26.7799 0.733276C26.9268 0.733276 27.0703 0.778154 27.1917 0.862059C27.313 0.945964 27.4066 1.065 27.4603 1.20366L27.8258 2.09731C28.439 3.6137 29.6022 4.83384 31.076 5.50638L32.1131 5.97518C32.2457 6.03741 32.358 6.13683 32.4367 6.26169C32.5154 6.38656 32.5572 6.53165 32.5572 6.67984C32.5572 6.82803 32.5154 6.97313 32.4367 7.09799C32.358 7.22286 32.2457 7.32228 32.1131 7.38451L31.0153 7.87968C29.5777 8.53361 28.434 9.71024 27.8099 11.1774ZM26.7799 15.3849C27.7478 15.3849 28.6766 15.2237 29.5462 14.9278C29.6281 15.5578 29.669 16.1985 29.669 16.8499C29.669 24.9411 23.2018 31.4999 15.2237 31.4999C12.8509 31.5033 10.5141 30.9115 8.42145 29.7771L0.778457 31.4999L2.47722 23.7486C1.35871 21.6263 0.775124 19.2563 0.778457 16.8499C0.778457 8.75868 7.2456 2.19986 15.2237 2.19986C16.5325 2.19986 17.7993 2.37566 19.004 2.70675C18.3522 4.04709 18.0481 5.53385 18.1205 7.02654C18.1929 8.51924 18.6393 9.96857 19.4176 11.2376C20.196 12.5066 21.2805 13.5534 22.5687 14.2791C23.8569 15.0048 25.3063 15.3854 26.7799 15.3849ZM8.00109 16.8499C8.00109 18.7926 8.76204 20.6558 10.1166 22.0295C11.4711 23.4032 13.3082 24.1749 15.2237 24.1749C17.1393 24.1749 18.9764 23.4032 20.3309 22.0295C21.6854 20.6558 22.4464 18.7926 22.4464 16.8499H19.5573C19.5573 18.0155 19.1007 19.1334 18.288 19.9576C17.4753 20.7819 16.3731 21.2449 15.2237 21.2449C14.0744 21.2449 12.9721 20.7819 12.1594 19.9576C11.3467 19.1334 10.8901 18.0155 10.8901 16.8499H8.00109Z"
                fill="white"
              />
            </svg>
            <span className={`text-white text-[11px] leading-[15px]`}>
              Oracle
            </span>
          </button>
          <button
            onClick={handleClickInvite}
            className="flex flex-col items-center justify-end"
          >
            <svg
              width="33"
              height="32"
              viewBox="0 0 33 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.65714 6.30303C5.65714 5.14572 6.10416 4.03581 6.89985 3.21747C7.69554 2.39913 8.77472 1.93939 9.9 1.93939C11.0253 1.93939 12.1045 2.39913 12.9002 3.21747C13.6958 4.03581 14.1429 5.14572 14.1429 6.30303C14.1429 7.46034 13.6958 8.57025 12.9002 9.38859C12.1045 10.2069 11.0253 10.6667 9.9 10.6667C8.77472 10.6667 7.69554 10.2069 6.89985 9.38859C6.10416 8.57025 5.65714 7.46034 5.65714 6.30303ZM9.9 0C8.2746 0 6.71578 0.664067 5.56645 1.84611C4.41712 3.02816 3.77143 4.63136 3.77143 6.30303C3.77143 7.9747 4.41712 9.5779 5.56645 10.7599C6.71578 11.942 8.2746 12.6061 9.9 12.6061C11.5254 12.6061 13.0842 11.942 14.2336 10.7599C15.3829 9.5779 16.0286 7.9747 16.0286 6.30303C16.0286 4.63136 15.3829 3.02816 14.2336 1.84611C13.0842 0.664067 11.5254 0 9.9 0ZM0 18.4242C0 17.3955 0.397346 16.4089 1.10463 15.6815C1.81191 14.9541 2.77118 14.5455 3.77143 14.5455H16.0286C16.6853 14.5449 17.3307 14.7207 17.9011 15.0555C17.3781 15.5029 16.9017 15.9974 16.4717 16.5392C16.3266 16.5031 16.1779 16.4848 16.0286 16.4848H3.77143C3.27131 16.4848 2.79167 16.6892 2.43803 17.0529C2.08439 17.4166 1.88571 17.9099 1.88571 18.4242V18.5755L1.89891 18.7365C2.00124 19.6661 2.32369 20.5558 2.838 21.3275C3.75634 22.6928 5.68166 24.2424 9.9 24.2424C11.699 24.2424 13.0812 23.9612 14.1466 23.5307C14.163 24.2095 14.2384 24.8688 14.3729 25.5088C13.1547 25.9297 11.682 26.1818 9.9 26.1818C5.1612 26.1818 2.60794 24.3976 1.28606 22.431C0.590037 21.3881 0.155975 20.1841 0.0226285 18.9265C0.0118707 18.8137 0.00432469 18.7005 0 18.5872V18.4242ZM21.6857 7.75758C21.6857 6.98604 21.9837 6.2461 22.5142 5.70054C23.0446 5.15498 23.7641 4.84848 24.5143 4.84848C25.2645 4.84848 25.9839 5.15498 26.5144 5.70054C27.0448 6.2461 27.3429 6.98604 27.3429 7.75758C27.3429 8.52911 27.0448 9.26905 26.5144 9.81461C25.9839 10.3602 25.2645 10.6667 24.5143 10.6667C23.7641 10.6667 23.0446 10.3602 22.5142 9.81461C21.9837 9.26905 21.6857 8.52911 21.6857 7.75758ZM24.5143 2.90909C23.264 2.90909 22.0649 3.41991 21.1808 4.32918C20.2967 5.23845 19.8 6.47168 19.8 7.75758C19.8 9.04347 20.2967 10.2767 21.1808 11.186C22.0649 12.0952 23.264 12.6061 24.5143 12.6061C25.7646 12.6061 26.9637 12.0952 27.8478 11.186C28.7319 10.2767 29.2286 9.04347 29.2286 7.75758C29.2286 6.47168 28.7319 5.23845 27.8478 4.32918C26.9637 3.41991 25.7646 2.90909 24.5143 2.90909ZM33 23.2727C33 25.5873 32.106 27.8072 30.5146 29.4438C28.9232 31.0805 26.7648 32 24.5143 32C22.2637 32 20.1054 31.0805 18.514 29.4438C16.9226 27.8072 16.0286 25.5873 16.0286 23.2727C16.0286 20.9581 16.9226 18.7383 18.514 17.1016C20.1054 15.4649 22.2637 14.5455 24.5143 14.5455C26.7648 14.5455 28.9232 15.4649 30.5146 17.1016C32.106 18.7383 33 20.9581 33 23.2727ZM25.4571 19.3939C25.4571 19.1368 25.3578 18.8901 25.181 18.7083C25.0042 18.5264 24.7643 18.4242 24.5143 18.4242C24.2642 18.4242 24.0244 18.5264 23.8476 18.7083C23.6708 18.8901 23.5714 19.1368 23.5714 19.3939V22.303H20.7429C20.4928 22.303 20.253 22.4052 20.0762 22.587C19.8993 22.7689 19.8 23.0155 19.8 23.2727C19.8 23.5299 19.8993 23.7766 20.0762 23.9584C20.253 24.1403 20.4928 24.2424 20.7429 24.2424H23.5714V27.1515C23.5714 27.4087 23.6708 27.6553 23.8476 27.8372C24.0244 28.019 24.2642 28.1212 24.5143 28.1212C24.7643 28.1212 25.0042 28.019 25.181 27.8372C25.3578 27.6553 25.4571 27.4087 25.4571 27.1515V24.2424H28.2857C28.5358 24.2424 28.7756 24.1403 28.9524 23.9584C29.1292 23.7766 29.2286 23.5299 29.2286 23.2727C29.2286 23.0155 29.1292 22.7689 28.9524 22.587C28.7756 22.4052 28.5358 22.303 28.2857 22.303H25.4571V19.3939Z"
                fill={`${location.pathname == "/invite" ? "#A175D2" : "white"}`}
              />
            </svg>
            <span
              className={`${
                location.pathname == "/invite" ? "text-[#A175D2]" : "text-white"
              } text-[16px] leading-[21.8px]`}
            >
              Invite
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
