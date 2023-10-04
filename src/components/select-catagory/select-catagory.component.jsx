import { useEffect } from "react";
import { useState } from "react";
import { getDoc, updateDoc } from "../../config/firebase/realtime_database";
import { useContext } from "react";
import { PlayerContext } from "../../context/player.context";
import {
  CatagoryButton,
  CatagoryContainer,
  ChooseCatagory,
  Select,
  SelectCatagoryButton,
} from "./select-catagory.style";

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
        updateDoc(`lobbies/${player.gameKey}`, {
          host: player.id,
          catagory: "Top 100",
        });
        setToggle(!toggle);
        break;
      case "Party":
        updateDoc(`lobbies/${player.gameKey}`, {
          host: player.id,
          catagory: "Party",
        });
        setToggle(!toggle);
        break;
      case "Rock":
        updateDoc(`lobbies/${player.gameKey}`, {
          host: player.id,
          catagory: "Rock",
        });
        setToggle(!toggle);
        break;
      case "K-pop":
        updateDoc(`lobbies/${player.gameKey}`, {
          host: player.id,
          catagory: "K-pop",
        });
        setToggle(!toggle);
        break;
      case "00s":
        updateDoc(`lobbies/${player.gameKey}`, {
          host: player.id,
          catagory: "00s",
        });
        setToggle(!toggle);
        break;
      case "90s":
        updateDoc(`lobbies/${player.gameKey}`, {
          host: player.id,
          catagory: "90s",
        });
        setToggle(!toggle);
        break;
      case "80s":
        updateDoc(`lobbies/${player.gameKey}`, {
          host: player.id,
          catagory: "80s",
        });
        setToggle(!toggle);
        break;
      case "Rap":
        updateDoc(`lobbies/${player.gameKey}`, {
          host: player.id,
          catagory: "Rap",
        });
        setToggle(!toggle);
        break;
      case "Country":
        updateDoc(`lobbies/${player.gameKey}`, {
          host: player.id,
          catagory: "Country",
        });
        setToggle(!toggle);
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    if (!toggle) {
      const setCatagoryName = async () => {
        const lobby = await getDoc(`lobbies/${player.gameKey}`);
        setSelectedCatagory(lobby.catagory);
      };
      setCatagoryName();
    }
    // eslint-disable-next-line
  }, [toggle]);

  return (
    <CatagoryContainer>
      {!toggle ? (
        <Select>
          <p>Selected song catagory:</p>
          <CatagoryButton onClick={handleClick}>
            {selectedCatagory}
          </CatagoryButton>
        </Select>
      ) : (
        <ChooseCatagory
          style={{
            height: document.documentElement.clientHeight,
            width: document.documentElement.clientWidth,
          }}
        >
          <SelectCatagoryButton onClick={handleCatagory}>
            Top 100
          </SelectCatagoryButton>
          <SelectCatagoryButton onClick={handleCatagory}>
            Party
          </SelectCatagoryButton>
          <SelectCatagoryButton onClick={handleCatagory}>
            Rock
          </SelectCatagoryButton>
          <SelectCatagoryButton onClick={handleCatagory}>
            Country
          </SelectCatagoryButton>
          <SelectCatagoryButton onClick={handleCatagory}>
            Rap
          </SelectCatagoryButton>
          <SelectCatagoryButton onClick={handleCatagory}>
            K-pop
          </SelectCatagoryButton>
          <SelectCatagoryButton onClick={handleCatagory}>
            00s
          </SelectCatagoryButton>
          <SelectCatagoryButton onClick={handleCatagory}>
            90s
          </SelectCatagoryButton>
          <SelectCatagoryButton onClick={handleCatagory}>
            80s
          </SelectCatagoryButton>
        </ChooseCatagory>
      )}
    </CatagoryContainer>
  );
};

export default SelectCatagory;
