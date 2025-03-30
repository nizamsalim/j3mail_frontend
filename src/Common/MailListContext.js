import { useContext, createContext, useState } from "react";

const MailListContext = createContext();

export function MailListProvider({ children }) {
  const [list, setList] = useState("inbox");
  const [placeholder, setPlaceholder] = useState(() => {
    if (window.location.href.includes("read")) {
      return false;
    }
    return true;
  });
  return (
    <MailListContext.Provider
      value={{ list, setList, placeholder, setPlaceholder }}
    >
      {children}
    </MailListContext.Provider>
  );
}

export function useMailList() {
  return useContext(MailListContext);
}
