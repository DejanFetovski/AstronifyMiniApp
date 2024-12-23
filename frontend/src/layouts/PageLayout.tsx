import { Outlet } from "react-router-dom";
import Background from "./Background";

export default function PageLayout() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      <div className="absolute top-0 left-0 z-0 w-full h-full bg-[#18191B]">
        <Background />
      </div>
      <div className="flex flex-col h-full min-h-screen">
        <div className="w-full flex-grow relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
