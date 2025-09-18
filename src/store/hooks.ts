import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDistpatch } from "./index";

export const useAppDispatch = () => {
  useDispatch<AppDistpatch>();
};

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
