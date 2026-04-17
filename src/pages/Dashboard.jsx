import { useAuth } from "../auth/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      <div style={styles.card}>
        <h3>Welcome</h3>
        <p>
          {user
            ? `Hello ${user.name} (${user.role})`
            : "User not loaded"}
        </p>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statBox}>
          <h4>Total Conversations</h4>
          <p>128</p>
        </div>

        <div style={styles.statBox}>
          <h4>Active Numbers</h4>
          <p>5</p>
        </div>

        <div style={styles.statBox}>
          <h4>Webhook Events</h4>
          <p>342</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },
  title: {
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: "30px",
  },
  statsContainer: {
    display: "flex",
    gap: "20px",
  },
  statBox: {
    flex: 1,
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
};

export default Dashboard;