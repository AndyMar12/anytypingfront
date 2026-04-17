import { useEffect } from "react";
import api from "../services/axios";

function Logs() {

  useEffect(() => {

    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();

  }, []);

  return (
    <div>
      <h1>Logs</h1>
    </div>
  );
}

export default Logs;