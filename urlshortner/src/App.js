import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function App(){
  const [url, setUrl] = useState('');
  const [short, setShort] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('shortHistory')||'[]'));

  useEffect(() => localStorage.setItem('shortHistory',JSON.stringify(history)), [history]);

  const valid = s => {try {new URL(s);
    return true; } catch {
      return false; }};

  const handleShorten = async () => {
    setErr('');
    if (!valid(url)) return setErr('Invalid url');
    setLoading(true);
    try {
      const res = await axios.post('5Aa5bP8ei3zv1s0UiBmXGg4U4kON081PEibNNaMk1Gpmn6Gr7pJQRpZz0WTu', {url});
      const shortUrl = res.data?.short;
      if(!shortUrl) throw new Error('Try again!');
      setShort(shortUrl);
      setHistory(h => [{ long: url, short:shortUrl, at: Date.now()}, ...h]);
    } catch (e) {
      setErr(e.response?.data?.error || e.message || 'Request failed');
    } finally { setLoading(false); }
  };

  return (
    <><div style={{ maxWidth: 720, margin: '2rem auto', padding: 16 }}>
      <h2>URL Shortner</h2>
      <input> value={url}
        Onchange={e => setUrl(e.target.value)}
        placeholder="https://example.com"
        style={{ width: '100%', padding: 8 }}
      </input>
    <div style={{ marginTop: 8 }}>
        <button onClick={handleShorten}
          disabled={loading}>{loading ? ' ...' : 'Shorten'}</button>
      </div>

    {err && <div style={{color:'red', marginTop:8}}>{err}</div>}
    {short && <div style={{marginTop:8}}>Short: <a href={short} target="_blank" rel="noreferrer">{short}</a>
    <button onClick={() => navigator.clipboard.writeText(short)} 
    style={{marginLeft:8}}>Copy</button>
    </div>}

    <h3 style={{ marginTop: 16 }}>History</h3><ul>
    {history.map((h, i) => (
      <li key={i}><a href={h.short} target="_blank" rel="norefferer">{h.short}</a> - <span title={h.long}>{h.long}</span></li>
    ))}
  </ul>
  </div></>
  );
}
