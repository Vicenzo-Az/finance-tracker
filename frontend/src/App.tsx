import { useState } from "react";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    summary: {
      income: number;
      expense: number;
    };
    balance: number;
  } | null>(null);

  return (
    <div>
      <h1>Finance Tracker</h1>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button
        disabled={!file || loading}
        onClick={() => {
          if (!file) return;

          const formData = new FormData();
          formData.append("file", file);

          setLoading(true);

          fetch("http://127.0.0.1:8000/upload", {
            method: "POST",
            body: formData,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Erro na requisição");
              }
              return response.json();
            })
            .then((data) => {
              console.warn("Resposta do backend:", data);
              setResult(data);
            })
            .catch((error) => {
              console.warn(error);
              alert("Erro ao processar o arquivo");
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      >
        {loading ? "Processando..." : "Processar"}
      </button>

      {file && (
        <p>
          Arquivo selecionado: <strong>{file.name}</strong>
        </p>
      )}

      {result && (
        <div>
          <h2>Resumo financeiro</h2>
          <p>Receitas: {result.summary.income}</p>
          <p>Despesas: {result.summary.expense}</p>
          <p>Saldo final: {result.balance}</p>
        </div>
      )}
    </div>
  );
}

export default App;
