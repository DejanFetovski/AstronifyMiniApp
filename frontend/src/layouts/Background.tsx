export default function Background() {
  return (
    <>
      <div className="absolute w-[176px] h-[176px] top-[34px] left-[-5px] bg-[#fe53bb] rounded-full blur-3xl"></div>
      <div className="absolute w-[176px] h-[176px] top-[270px] right-[-80px] bg-[#03B1FB] rounded-full blur-3xl"></div>
      <div className="absolute bottom-[100px] w-full flex justify-center gap-3">
        <div className="w-[50px] h-[50px] bg-[#f841af] rounded-full blur-xl"></div>
        <div className="w-[50px] h-[50px] bg-[#43c6ff] rounded-full blur-xl"></div>
      </div>
    </>
  );
}
