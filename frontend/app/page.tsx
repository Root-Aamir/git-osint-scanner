"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [commits, setCommits] = useState<any[]>([]);
  const [repoName, setRepoName] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Nayi states Scanner ke liye
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/repos/1/logs")
      .then((res) => res.json())
      .then((data) => {
        if (data.commits) {
          setRepoName(data.repo);
          setCommits(data.commits);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  // Scan API call karne ka function
  const handleScan = () => {
    setIsScanning(true);
    fetch("http://127.0.0.1:8000/api/repos/1/scan")
      .then((res) => res.json())
      .then((data) => {
        setScanResult(data);
        setIsScanning(false);
      })
      .catch((err) => {
        console.error("Scan Error:", err);
        setIsScanning(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-400 mb-2">Git OSINT Dashboard</h1>
            <p className="text-gray-400">Monitoring Repository: <span className="text-green-400 font-mono">{repoName || "Loading..."}</span></p>
          </div>
          
          {/* Security Scan Button */}
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isScanning ? "Scanning Code..." : "🛡️ Run Security Scan"}
          </button>
        </div>

        {/* Security Alert Box */}
        {scanResult && (
          <div className={`mb-8 p-6 rounded-lg border ${scanResult.status === 'Vulnerable' ? 'bg-red-900/30 border-red-500' : 'bg-green-900/30 border-green-500'}`}>
            <h2 className={`text-2xl font-bold mb-2 ${scanResult.status === 'Vulnerable' ? 'text-red-400' : 'text-green-400'}`}>
              {scanResult.status === 'Vulnerable' ? '🚨 Vulnerability Detected!' : '✅ Clean Codebase'}
            </h2>
            <p className="text-gray-300 mb-4">{scanResult.message}</p>
            
            {scanResult.raw_evidence && scanResult.raw_evidence.length > 0 && (
              <div className="bg-gray-950 p-4 rounded font-mono text-sm text-red-300 overflow-x-auto">
                <p className="text-gray-500 mb-2">// Leaked Files Found:</p>
                {scanResult.raw_evidence.map((line: string, i: number) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Recent Commits</h2>
          
          {loading ? (
            <p className="text-gray-400 animate-pulse">Loading repository data...</p>
          ) : commits.length > 0 ? (
            <div className="space-y-4">
              {commits.map((commit, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-100">{commit.message}</span>
                    <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded font-mono">{commit.hash.substring(0, 7)}</span>
                  </div>
                  <div className="text-sm text-gray-400 flex justify-between">
                    <span>By: <span className="text-blue-300">{commit.author}</span></span>
                    <span>{commit.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-400">No commits found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
