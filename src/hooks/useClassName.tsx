import { createContext, useContext, useState, ReactNode } from "react";

interface ClassNameContextType {
  className: string;
  setClassName: (name: string) => void;
}

const ClassNameContext = createContext<ClassNameContextType>({
  className: "",
  setClassName: () => {},
});

export const useClassName = () => useContext(ClassNameContext);

export const ClassNameProvider = ({ children }: { children: ReactNode }) => {
  const [className, setClassName] = useState("");

  return (
    <ClassNameContext.Provider value={{ className, setClassName }}>
      {children}
    </ClassNameContext.Provider>
  );
};
