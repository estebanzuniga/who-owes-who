import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:3000/api/register")
      .then(res => res.json())
      .then(data => setData(data.message));
  }, []);

  return (
    <div>
      <h1>Frontend App</h1>
      <p>Backend says: {data}</p>
    </div>
  );
}

export default App;
