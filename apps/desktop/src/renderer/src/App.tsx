import { welcomeMessage } from "@internium/ui";

function App(): React.JSX.Element {
  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
      }}
    >
      <p style={{ margin: 0, fontSize: 14, color: "#000000" }}>{welcomeMessage}</p>
    </main>
  );
}

export default App;
