import AskInput from "../../components/AskInput";
import BackIcon from "../../svgs/BackIcon";

const Agent = () => {
  return (
    <div className="relative min-h-screen flex flex-col justify-end gap-[40px] px-6 pt-[30px] pb-[28px]">
      <img
        src="assets/images/diagram.png"
        className="absolute top-0 right-0"
      ></img>
      <div className="absolute top-10 left-8">
        <BackIcon />
      </div>

      <AskInput />
    </div>
  );
};

export default Agent;
