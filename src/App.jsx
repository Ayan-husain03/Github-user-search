import { useState, useEffect } from "react";
import useDebounce from "./hooks/debounce";

function App() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debouncedQuery = useDebounce(query, 600);

  useEffect(() => {
    if (debouncedQuery) {
      setLoading(true);
      setError("");

      fetch(`https://api.github.com/search/users?q=${debouncedQuery}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch users");
          return res.json();
        })
        .then((data) => {
          setUsers(data.items || []);
        })
        .catch((err) => {
          setError(err.message);
          setUsers([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setUsers([]);
    }
  }, [debouncedQuery]);

  return (
    <div className="container">
      <h2>🔍 GitHub User Search</h2>
      <input
        type="text"
        placeholder="Search GitHub Users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-card">
            <img src={user.avatar_url} alt={user.login} />
            <div>
              <strong>{user.login}</strong>
              <a href={user.html_url} target="_blank" rel="noreferrer">
                View Profile
              </a>
            </div>
          </li>
        ))}
      </ul>

      {!loading && !users.length && debouncedQuery && (
        <p className="no-result">No users found for "{debouncedQuery}"</p>
      )}
    </div>
  );
}

export default App;
