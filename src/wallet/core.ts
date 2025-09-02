import { Core } from "@walletconnect/core";

const PROJECT_ID = import.meta.env.VITE_REOWN_PROJECT_ID;

// if (!PROJECT_ID) {
//   throw new Error("VITE_REOWN_PROJECT_ID is not set");
// }

export const walletConnectCore = new Core({
  // console.log("Initialising Core");
  projectId: PROJECT_ID,
});
