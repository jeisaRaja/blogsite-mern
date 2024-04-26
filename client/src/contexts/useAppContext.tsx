import { useContext } from "react";
import { AppContext } from "./State";

export const useAppContext = ()=> useContext(AppContext)
