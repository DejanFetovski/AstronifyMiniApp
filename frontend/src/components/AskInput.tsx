// import PlusIcon from "../svgs/PlusIcon";

interface Props {
  text: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
}
const AskInput = ({ text, onChange, onSendMessage }: Props) => {
  const handleSendMessage = () => {
    console.log("handleSendMessage");
    onSendMessage();
  };
  return (
    <div className="askInput bg-gradient-to-r from-[#9B54DD] to-[#3C94D7F2] flex items-center px-4 rounded-full justify-between">
      <div className="flex gap-2 items-center flex-grow">
        {/* <PlusIcon /> */}
        <input
          className="text-[14.7px] leading-[43px] traking-[0.4px] text-white outline-none bg-transparent gap-[10px] w-full"
          placeholder="Ask me anything!"
          onChange={(event) => {
            onChange(event.target.value);
          }}
          value={text}
        ></input>
      </div>
      <img
        src="assets/images/telegram-1.png"
        onClick={() => handleSendMessage()}
      ></img>
    </div>
  );
};

export default AskInput;
