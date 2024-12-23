const BottomBar = () => {
  const handleClickProfile = () => {
    console.log("handleClickProfile");
  };

  const handleClickAgent = () => {
    console.log("handleClickAgent");
  };

  const handleClickInvite = () => {
    console.log("handleClickInvite");
  };
  return (
    <div className="absolute bottom-[32px] flex justify-center">
      <div className="relative max-w-[321px] flex flex-col items-center justify-center">
        <img src="assets/images/bottombar.png" className="w-full"></img>
        <div className="absolute w-full h-full top-0 left-0 grid grid-cols-3">
          <button onClick={handleClickProfile}></button>
          <button onClick={handleClickAgent}></button>
          <button onClick={handleClickInvite}></button>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
