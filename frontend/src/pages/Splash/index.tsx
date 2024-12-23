import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";

const Splash = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/question");
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-[42px]">
      <img src="assets/images/splash.png" className="w-[354px] h-[354px]"></img>
      <div className="flex flex-col items-center max-w-[300px] gap-4">
        <h1 className="text-[35.5px] font-bold text-[#FFFFFFCC] text-center">
          Welcome to Astronify AI
        </h1>
        <h2 className="text-[16px] text-[#FFFFFFBF] text-center">
          Your cosmic cheat sheet for life’s chaos. Blame the stars, not
          yourself!
        </h2>
        <ActionButton
          className="w-[167px] h-[40px] flex justify-center items-center"
          onClick={handleClick}
        >
          {<span className="text-[14px] text-white">Next</span>}
        </ActionButton>
      </div>
    </div>
  );
};

export default Splash;
