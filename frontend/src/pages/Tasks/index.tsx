import { useNavigate } from "react-router-dom";
import BottomBar from "../../components/BottomBar";
import { motion } from "framer-motion";

const Tasks = () => {
  const navigate = useNavigate();
  const tasks = [
    {
      title: "Daily login bonus",
      points: 500,
    },
    {
      title: "Engage with AI Agent - 2 Prompts",
      points: 1200,
    },
    {
      title: "Get your daily horoscope reading",
      points: 750,
    },
    {
      title: "Invite 1 friend",
      points: 1200,
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative h-screen px-6 pt-[60px] pb-[130px]"
    >
      <img
        src="assets/images/diagram.png"
        className="absolute top-0 right-0"
      ></img>
      <div className="h-full flex flex-col justify-start items-center gap-[40px] overflow-x-hidden overflow-y-scroll">
        <div className="flex flex-col">
          <div className="flex flex-col items-center gap-[6px]">
            <span className="text-[20px] leading-[28px] text-white">
              4 Tasks Available
            </span>
            <span className="text-[13px] text-[#FFFFFFB2]">
              Complete Tasks - Receive Points
            </span>
          </div>
        </div>
        <div className="relative max-w-[400px]">
          <div className="absolute -top-3 left-0 w-full h-[50px] bg-gradient-to-r from-[rgba(254, 83, 187, 1)] to-[rgba(3, 177, 251, 1)] blur-3xl"></div>
          <img
            src="assets/images/tasks-bg.png"
            className="absolute w-full h-full"
          ></img>
          <div className="flex justify-center">
            <img src="assets/images/medal.png" className="absolute top-3"></img>
          </div>
          <div className="relative w-full flex flex-col p-5 pt-20 gap-4 z-10">
            {tasks.map((task, index) => (
              <>
                <div className="flex justify-between" key={index}>
                  <div className="flex flex-col justify-between">
                    <span className="text-white text-[14.7px] leading-[20px]">
                      {task.title}
                    </span>
                    <span className="text-[14.7px] leading-[20px] tracking-[0.4px] text-[#FE53BB]">
                      +{task.points} Points
                    </span>
                  </div>
                  <img
                    src="assets/images/start-btn.png"
                    onClick={() => {
                      navigate("/horoscope");
                    }}
                  ></img>
                </div>
                <div className="colorDivider"></div>
              </>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <BottomBar />
      </div>
    </motion.div>
  );
};

export default Tasks;
