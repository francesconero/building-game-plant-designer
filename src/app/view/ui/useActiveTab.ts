import { useLocation } from "react-router-dom";

export function useActiveTab() {
  const location = useLocation();
  const parts = location.pathname.split("/");
  return parts.pop();
}
