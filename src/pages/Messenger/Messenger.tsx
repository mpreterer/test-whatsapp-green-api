import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatList from "../../components/ChatList/ChatList";

import { GreenApiAPI } from "../../GreenAPI";
import { typesMessage } from "../../shared/constants/Message";
import { typesApi } from "../../shared/constants/Phone";
import { formattedPhoneWithPlus } from "../../shared/helpers/formattedPhone";
import { SCREENS } from "../../routes/endpoints";
import "./Messenger.scss";

const Messenger = () => {
  let navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [phoneCompanion, setPhoneCompanion] = useState("");
  const [companion, setCompanion] = useState(false);
  const [idInstance, setIdInstance] = useState("");
  const [token, setToken] = useState("");
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    const storedIdInstance = localStorage.getItem("idInstance");
    const storedTokenInstance = localStorage.getItem("token");

    if (storedIdInstance && storedTokenInstance) {
      setIdInstance(storedIdInstance);
      setToken(storedTokenInstance);
    } else {
      navigate(SCREENS.LOGIN);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timer;

    if (phoneCompanion !== "") {
      interval = setInterval(async () => {
        await getNotificationLoop();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [messages]);

  const handleSetCompanion = async (phone: string) => {
    const numberPhone = formattedPhoneWithPlus(phone);
    setPhoneCompanion(numberPhone);

    if (numberPhone === phoneCompanion) return;
    const responseMessages = await handleGetMessages(numberPhone);
    setMessages(responseMessages);
    setCompanion(true);
  };

  const handleSendMessage = async () => {
    try {
      await GreenApiAPI.sendMessage(
        phoneCompanion.slice(1),
        message,
        idInstance,
        token
      );
      messages.unshift({
        type: typesMessage.outgoing,
        textMessage: message,
        idMessage: Math.random().toString(4),
      });
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  //eslint-disable-next-line react-hooks/exhaustive-deps
  const getNotificationLoop = async () => {
    try {
      const response = await GreenApiAPI.getNotification(idInstance, token);
      if (response === null) return;
      if (response.body.senderData === undefined) {
        await GreenApiAPI.deleteNotification(
          idInstance,
          token,
          response.receiptId
        );
        return;
      }
      if (response.body.senderData.sender === response.body.instanceData.wid) {
        await GreenApiAPI.deleteNotification(
          idInstance,
          token,
          response.receiptId
        );
        return;
      }

      if (
        response.body.senderData.chatId.replace(
          typesApi.endingsPhonePersonal,
          ""
        ) === phoneCompanion.slice(1)
      ) {
        const newMessage = {
          type: typesMessage.incoming,
          textMessage: response.body.messageData.textMessageData.textMessage,
          idMessage: response.body.idMessage,
        };
        setMessages([newMessage, ...messages]);
      }

      await GreenApiAPI.deleteNotification(
        idInstance,
        token,
        response.receiptId
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetMessages = async (phone: any) => {
    const response = await GreenApiAPI.getMessages(
      phone.slice(1),
      idInstance,
      token
    );

    return response;
  };

  return (
    <div className="messenger">
      {idInstance && token ? (
        <ChatList
          id={idInstance}
          tokenApi={token}
          onClick={handleSetCompanion}
        />
      ) : (
        ""
      )}
      {companion === true ? (
        <div className="messenger__chat">
          <div className="messenger__companion-container">
            <div className="messenger__avatar-companion" />
            <span className="messenger__number-companion">
              {phoneCompanion}
            </span>
          </div>
          <div className="messenger__text-chat">
            {messages.length > 0
              ? messages.map((item: any) => (
                  <div
                    className="messenger__companion"
                    style={{
                      borderRadius:
                        item.type === typesMessage.outgoing
                          ? "15px 15px 0 15px"
                          : "0 15px 15px  15px",
                      marginLeft:
                        item.type === typesMessage.incoming ? "" : "auto",
                    }}
                    key={item.idMessage}
                  >
                    {item.textMessage}
                  </div>
                ))
              : ""}
          </div>
          <div className="messenger__send-message-container">
            <textarea
              className="messenger__message-area"
              value={message}
              placeholder="Введите текст"
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="messenger__send-message"
              onClick={handleSendMessage}
            ></button>
          </div>
        </div>
      ) : (
        <span className="messenger__not-companion">Выберите собеседника</span>
      )}
    </div>
  );
};

export { Messenger };
