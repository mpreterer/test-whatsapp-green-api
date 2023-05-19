import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Chat } from "../../types/Chat";
import { formattedPhoneWithPlus } from "../../shared/helpers/formattedPhone";
import { GreenApiAPI } from "../../GreenAPI";
import { SizeNumber } from "../../shared/constants/SizeNumber";
import "./ChatList.scss";

type Props = {
  id: string;
  tokenApi: string;
  onClick: (event: string) => void;
};

const ChatList: FC<Props> = ({ id, tokenApi, onClick }) => {
  const [contact, setContact] = useState("");
  const [chats, setChats] = useState([]);
  const [listChats, setListChats] = useState([]);
  const [number, setNumber] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);

  useEffect(() => {
    getChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getChats = async () => {
    const response = await GreenApiAPI.getChats(id, tokenApi);
    setChats(response);
    setListChats(response);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idInstance");
  };

  const searchContact = (inputPhone: string) => {
    setContact(inputPhone);
    if (!listChats) return;

    const filteredNumbers = listChats.filter((phoneNumber: Chat) => {
      return formattedPhoneWithPlus(phoneNumber.id).includes(inputPhone);
    });

    setChats(filteredNumbers);
  };

  const handleAddedCompanion = async () => {
    const response = await GreenApiAPI.checkPhone(id, tokenApi, number);
    if (response.existsWhatsapp) {
      const newChat: Chat = { id: number };
      const searchChat = listChats.filter((phoneNumber: Chat) => {
        return formattedPhoneWithPlus(phoneNumber.id).includes(number);
      });

      if (searchChat.length === 0) {
        const newContacts: any = [newChat, ...chats];
        setChats(newContacts);
      } else {
        alert("Чат с этим номером уже создан");
      }
    }
  };

  const handleSetNumber = (number: string) => {
    setNumber(number);
    if (number.length === SizeNumber) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  };

  return (
    <div className="chat-list">
      <div className="chat-list__add-companion">
        <input
          className="chat-list__input"
          type="text"
          placeholder="Введите номер собеседника без +"
          maxLength={SizeNumber}
          value={number}
          onChange={(e) => handleSetNumber(e.target.value)}
        ></input>
        <button
          className="chat-list__btn-add-companion"
          onClick={handleAddedCompanion}
          disabled={btnDisabled}
        >
          +
        </button>
      </div>
      <input
        className="chat-list__search-number"
        type="text"
        placeholder="Поиск номера"
        maxLength={SizeNumber}
        value={contact}
        onChange={(e) => searchContact(e.target.value)}
      ></input>
      {chats.length > 0 ? (
        chats.map((item: Chat) =>
          !item.archive ? (
            <div
              className="chat-list__list-item"
              onClick={() => onClick(item.id)}
              key={item.id}
            >
              <div className="chat-list__avatar" />
              <span className="chat-list__name">
                {formattedPhoneWithPlus(item.id)}
              </span>
            </div>
          ) : (
            ""
          )
        )
      ) : (
        <p style={{ marginBottom: "30px" }}>Список чатов пуст</p>
      )}
      <Link to="/" onClick={handleSignOut} className="chat-list__exit">
        Выйти
      </Link>
    </div>
  );
};

export default ChatList;
