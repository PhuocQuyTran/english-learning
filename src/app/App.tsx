
import { AppProviders } from "@/app/AppProviders";
import { AppRoutes } from "@/routes";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <AppProviders>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontSize: "14px",
            },
          }}
        />
        <AppRoutes />
      </AppProviders>
  );
}
