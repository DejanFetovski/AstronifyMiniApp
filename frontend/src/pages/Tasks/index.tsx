import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import BottomBar from "../../components/BottomBar";
import { motion } from "framer-motion";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [point, setPoint] = useState(0)

  const fetchTaskModel = async () => {

    const token = localStorage.getItem("authorization");
    // GetTask Model
    let response: any = await axios.get(
      `${API_BASE_URL}/api/task`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Ensure proper content type
        },
      }
    );

    if (response.status !== 200)
      return

    const basicTasksData = response.data;

    // Get User Info
    response = await axios.get(`${API_BASE_URL}/api/user/info`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });

    setPoint(response.data.data.point)

    const userTasksInfo = response.data.data.tasks;

    const tasks = userTasksInfo.map((task: any) => {
      const matchingTask = basicTasksData.find((item: any) => item.id === task.taskId);
      return {
        taskId: task.taskId,
        title: matchingTask.title,
        isAccomplish: task.isAccomplish,
        points: matchingTask.points
      };
    });

    console.log("tasks-------------------------", tasks)
    setTasks(tasks)
  }

  useEffect(() => {
    //Get Database Task
    fetchTaskModel()
  }, [])

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
        className="absolute top-0 right-0 z-0"
      ></img>
      <div className="h-full flex flex-col justify-start items-center gap-[40px] overflow-x-hidden overflow-y-scroll relative z-10">
        <div className="flex flex-col">
          <div className="flex flex-col items-center gap-[6px]">
            <span className="text-[20px] leading-[28px] text-white">
              {tasks ? tasks.length : 'No'} Tasks Available
            </span>
            <span className="text-[13px] text-[#FFFFFFB2]">
              Complete Tasks - Receive Points
            </span>
          </div>
        </div>
        <div className="relative w-full h-full">
          <div className="absolute -top-3 left-0 w-full h-[50px] bg-gradient-to-r from-[rgba(254, 83, 187, 1)] to-[rgba(3, 177, 251, 1)] blur-3xl"></div>
          <img
            src="assets/images/tasks-bg.png"
            className="absolute w-full h-full"
          ></img>
          <div className="flex justify-center">
            <img src="assets/images/medal.png" className="absolute top-3"></img>
          </div>
          <div className="relative w-full flex flex-col p-5 pt-20 gap-4 z-10">
            {tasks && tasks.map((task: any, index: any) => (
              <div key={index}>
                <div className="flex justify-between">
                  <div className="flex flex-col justify-between">
                    <span className="text-white text-[14.7px] leading-[20px]">
                      {task.title}
                    </span>
                    <span className="text-[14.7px] leading-[20px] tracking-[0.4px] text-[#FE53BB]">
                      +{task.points} Points
                    </span>
                  </div>
                  <img
                    src={!task.isAccomplish ? "assets/images/start-btn.png" : "assets/images/completed-btn.png"}
                    onClick={async () => {
                      if (task.isAccomplish)
                        return

                      const token = localStorage.getItem("authorization");
                      if (task.title === "Daily login bonus") {
                        const response = await axios.get(`${API_BASE_URL}/api/user/info`, {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                        });

                        await axios.post(
                          `${API_BASE_URL}/api/user/update_task`,
                          {
                            'point': response.data.point + task.points,
                            'taskId': index + 1,
                            'isAccomplish': !task.isAccomplish
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "application/json", // Ensure proper content type
                            },
                          }
                        );
                        navigate("/profile");
                      } else if (task.title === "Engage with AI Agent - 2 Prompts") {
                        navigate("/profile");

                      } else if (task.title === "Get your daily horoscope reading") {

                        navigate("/profile");
                      } else if (task.title === "Invite 1 friend") {

                        navigate("/invite");
                      }
                    }}
                  />
                </div>
                <div className="colorDivider"></div>
              </div>
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
