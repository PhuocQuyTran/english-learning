import { createContext, type Dispatch, type SetStateAction } from "react";
import type { CommonData } from "@/types";

const CommonDataContext = createContext<{
  commonData: CommonData | null;
  handleFetchCommonData: () => Promise<void>;
  updateCommonData: Dispatch<SetStateAction<CommonData | null>>;
}>({
  commonData: null,
  handleFetchCommonData: async () => {},
  updateCommonData: () => {},
});

CommonDataContext.displayName = "CommonDataContext";

export default CommonDataContext;
