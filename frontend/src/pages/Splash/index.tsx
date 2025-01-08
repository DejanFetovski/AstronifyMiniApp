import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import { motion } from "framer-motion";
import { AppContext } from "../../main";

const Splash = () => {
  const { userInfo } = useContext(AppContext);

  const navigate = useNavigate();
  const handleNext = () => {

    console.log("SPLAsh - Handle NExt - userInfo", userInfo)
    if (userInfo && userInfo.isFirstLogin == true){
      navigate("/question");
    } else  {
      navigate("/profile");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col items-center justify-center gap-[42px]"
    >
      <img src="assets/images/splash.png" className="w-[354px] h-[354px]"></img>
      <div className="flex flex-col items-center max-w-[300px] gap-4">
        <p className="text-[35.5px] font-bold text-white text-center">
          Welcome to Astronify AI
        </p>
        <p className="text-[16px] text-white text-center">
          Your cosmic cheat sheet for life’s chaos. Blame the stars, not
          yourself!
        </p>
        <ActionButton
          className="gradient-bg w-[167px] h-[40px] flex justify-center items-center"
          onClick={handleNext}
        >
          {<span className="text-[14px] text-white">Next</span>}
        </ActionButton>
      </div>
    </motion.div>
  );
};

export default Splash;
