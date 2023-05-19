import { typesApi } from "../constants/Phone";

const formattedPhoneWithPlus = (phone: string) => {
  return `+${phone.replace(typesApi.endingsPhonePersonal, "")}`;
};

const formattedPhoneWithoutPlus = (phone: string) => {
  return `${phone.replace(typesApi.endingsPhonePersonal, "")}`;
};

export { formattedPhoneWithPlus, formattedPhoneWithoutPlus };
