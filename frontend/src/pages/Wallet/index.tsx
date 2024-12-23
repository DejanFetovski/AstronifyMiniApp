const Wallet = () => {
  return (
    <div className="horoscope relative min-h-screen flex flex-col justify-start gap-[42px] px-6 pt-[56px] pb-[28px]">
      <img
        src="assets/images/diagram.png"
        className="absolute top-0 right-0"
      ></img>
      <h1 className="text-[24px] leading-[43px] tracking-[0.4px] text-white">
        Connect Wallet
      </h1>
      <div className="flex flex-col gap-[36px]">
        <div></div>
        <div className="divider"></div>
        <div></div>
      </div>
    </div>
  );
};

export default Wallet;
