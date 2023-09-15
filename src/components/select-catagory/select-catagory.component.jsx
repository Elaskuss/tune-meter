import { useEffect } from "react";
import { useState } from "react";
import { getDoc, updateDoc } from "../../config/firebase/realtime_database";
import { useContext } from "react";
import { PlayerContext } from "../../context/player.context";
import { CatagoryButton, CatagoryContainer, ChooseCatagory, Select, SelectCatagoryButton } from "./select-catagory.style";

const SelectCatagory = () => {
  const { player } = useContext(PlayerContext);
  const [selectedCatagory, setSelectedCatagory] = useState("Top 100");
  const [toggle, setToggle] = useState(false);

  const handleClick = () => {
    setToggle(!toggle);
  };

  const handleCatagory = (event) => {
    switch (event.target.innerHTML) {
      case "Top 100":
        updateDoc(`lobbies/${player.gameKey}`, {host: player.id, catagory: "Top 100"});
        setToggle(!toggle);
        break;
      case "Party":
         updateDoc(`lobbies/${player.gameKey}`, {host: player.id, catagory: "Party"});
         setToggle(!toggle);
        break;
      case "Rock":
         updateDoc(`lobbies/${player.gameKey}`, {host: player.id, catagory: "Rock"});
         setToggle(!toggle);
        break;
      case "00s":
         updateDoc(`lobbies/${player.gameKey}`, {host: player.id, catagory: "00s"});
         setToggle(!toggle);
        break;
      default:
        return;
    }
  };

  useEffect(() => {
   if(!toggle){
      const setCatagoryName = async () => {
         const lobby = await getDoc(`lobbies/${player.gameKey}`);
         console.log(lobby);
         setSelectedCatagory(lobby.catagory);
      }
      setCatagoryName();

   }
   // eslint-disable-next-line
  }, [toggle])

  return (
    <CatagoryContainer>
      {!toggle ? (
        <Select>
          <p>Selected song catagory:</p>
          <CatagoryButton onClick={handleClick}>{selectedCatagory}</CatagoryButton>
        </Select>
      ) : (
        <ChooseCatagory style={{
         height: window.innerHeight,
         width: window.innerWidth,
        }}>
          <SelectCatagoryButton onClick={handleCatagory}>Top 100</SelectCatagoryButton>
          <SelectCatagoryButton onClick={handleCatagory}>Party</SelectCatagoryButton>
          <SelectCatagoryButton onClick={handleCatagory}>Rock</SelectCatagoryButton>
          <SelectCatagoryButton onClick={handleCatagory}>00s</SelectCatagoryButton>
        </ChooseCatagory>
      )}
    </CatagoryContainer>
  );
};

export default SelectCatagory;
