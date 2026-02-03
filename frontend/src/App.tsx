import { useState } from "react";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    income: number;
    expense: number;
    balance: number;
  }>(null);

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
          setLoading(true);

          // simulação de chamada à API
          setTimeout(() => {
            setResult({
              income: 3500,
              expense: -1200,
              balance: 2300,
            });
            setLoading(false);
          }, 1500);
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
          <p>Receitas: {result.income}</p>
          <p>Despesas: {result.expense}</p>
          <p>Saldo final: {result.balance}</p>
        </div>
      )}
    </div>
  );
}

export default App;
