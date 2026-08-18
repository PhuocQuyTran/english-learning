import Layout from "@/components/layouts/Layout";
import { Outlet } from "react-router-dom";
export default function PublicRoute() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
