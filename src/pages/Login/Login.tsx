import { useState, useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";

import { SCREENS } from "../../routes/endpoints";
import { GreenApiAPI } from "../../GreenAPI";
import "./Login.scss";

const Login: FC = () => {
  let navigate = useNavigate();

  const [idInstance, setIdInstance] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedIdInstance = localStorage.getItem("idInstance");
    const storedTokenInstance = localStorage.getItem("token");

    if (storedIdInstance && storedTokenInstance) {
      navigate("messenger");
    }
  }, [navigate]);

  const handleInputChange = (event: any, setValue: any) => {
    const { value } = event.target;
    setValue(value);
  };

  const handleFormSubmit = async (event: any) => {
    if (!idInstance || !token) {
      alert("Введите данные для входа");
      return;
    }

    try {
      const response = await GreenApiAPI.getStatusInstance(idInstance, token);
      if (response.statusInstance !== "online") {
        alert("Вы не авторизованы на сайт Green API");
      } else {
        localStorage.setItem("idInstance", idInstance);
        localStorage.setItem("token", token);
        navigate("messenger");
      }
    } catch (error: any) {
      alert("Возможно вы ввели неверные данные");
    }
  };

  return (
    <div className="login">
      <form
        className="login__container"
        method=""
        action={SCREENS.MESSENGER}
        name="login"
      >
        <span className="login__title">
          Введите данные для доступа к Green Api
        </span>
        <input
          type="text"
          value={idInstance}
          onChange={(event) => handleInputChange(event, setIdInstance)}
          placeholder="ID Instance"
          className="login__input"
        />
        <input
          type="text"
          value={token}
          onChange={(event) => handleInputChange(event, setToken)}
          placeholder="API Token Instance"
          className="login__input"
        />
        <button
          className="login__apply"
          type="button"
          onClick={handleFormSubmit}
        >
          Войти
        </button>
      </form>
    </div>
  );
};

export { Login };
