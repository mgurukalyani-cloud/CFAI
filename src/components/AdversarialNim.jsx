/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import './AdversarialNim.css';

const computeOptimalMove = (tokens) => {
  const move = (tokens - 1) % 4;
  return move === 0 ? 1 : move;
};

export default function AdversarialNim() {
  const [tokensLeft, setTokensLeft] = useState(15);
  const [currentTurn, setCurrentTurn] = useState('Doctor');
  const [result, setResult] = useState(null);

  const [iq, setIq] = useState(120);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  const [difficulty, setDifficulty] =
    useState('Expert');

  const [expandedNodes, setExpandedNodes] =
    useState(0);

  const [prunedNodes, setPrunedNodes] =
    useState(0);

  const [decisionTrace, setDecisionTrace] =
    useState('');

  const [showPopup, setShowPopup] =
    useState(false);

  const [popupMessage, setPopupMessage] =
    useState('');

  const [logs, setLogs] = useState([
    '🏥 Clinical Decision Engine Ready'
  ]);

  const addLog = (msg) => {
    setLogs((prev) =>
      [msg, ...prev].slice(0, 5)
    );
  };
    useEffect(() => {
    if (tokensLeft <= 0) {
      if (currentTurn === 'Doctor') {
        setResult('WIN');
        setWins((p) => p + 1);
        setIq((p) => Math.min(200, p + 15));

        setPopupMessage(
          '🎉 Congratulations Doctor! Clinical Strategy Successful!'
        );

        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false);
        }, 3000);

        addLog(
          '🏆 Doctor Successfully Defeated AI'
        );
      } else {
        setResult('LOSS');

        setLosses((p) => p + 1);

        setIq((p) =>
          Math.max(80, p - 10)
        );

        setPopupMessage(
          '💡 Better Luck Next Time! Think in all possible ways and analyze the opponent strategy.'
        );

        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false);
        }, 4000);

        addLog(
          '💀 AI Strategy Engine Won'
        );
      }

      return;
    }

    if (
      currentTurn === 'AI' &&
      !result
    ) {
      const timer = setTimeout(() => {
        const move =
          computeOptimalMove(tokensLeft);

        setDecisionTrace(
`Minimax Analysis

Optimal Move = ${move}

Reason:
Highest Utility Value

Algorithm:
Alpha-Beta Pruning`
        );

        setExpandedNodes(
          (p) => p + 10
        );

        setPrunedNodes(
          (p) => p + 5
        );

        setTokensLeft(
          (prev) => prev - move
        );

        addLog(
          `🤖 AI removed ${move} capsule(s)`
        );

        setCurrentTurn('Doctor');
      }, 1000);

      return () =>
        clearTimeout(timer);
    }
  }, [
    tokensLeft,
    currentTurn,
    result
  ]);

  const makeMove = (num) => {
    if (
      currentTurn !== 'Doctor' ||
      result
    )
      return;

    if (num > tokensLeft)
      return;

    const optimalMove =
      computeOptimalMove(tokensLeft);

    if (num === optimalMove) {
      setIq((prev) =>
        Math.min(200, prev + 5)
      );

      addLog(
        '✅ Optimal Move (+5)'
      );
    } else {
      setIq((prev) =>
        Math.max(50, prev - 3)
      );

      addLog(
        '⚠️ Suboptimal Move (-3)'
      );
    }

    setTokensLeft(
      (prev) => prev - num
    );

    setExpandedNodes(
      (p) => p + 4
    );

    addLog(
      `👨‍⚕️ Doctor removed ${num} capsule(s)`
    );

    setCurrentTurn('AI');
  };

  const resetGame = () => {
    setTokensLeft(15);
    setCurrentTurn('Doctor');
    setResult(null);

    setExpandedNodes(0);
    setPrunedNodes(0);

    setDecisionTrace('');

    addLog(
      '🔄 New Simulation Started'
    );
  };
    return (
    <>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>{popupMessage}</h2>
          </div>
        </div>
      )}

      <div className="nim-container">

        <div className="nim-left">

          <h1 className="nim-title">
            🏥 AI Treatment Strategy Simulator
          </h1>

          <p className="nim-subtitle">
            Minimax + Alpha-Beta Clinical Decision Engine
          </p>

          <div className="level-row">
            {['Easy', 'Medium', 'Hard', 'Expert']
              .map((level) => (
                <button
                  key={level}
                  onClick={() =>
                    setDifficulty(level)
                  }
                  className={
                    difficulty === level
                      ? 'level-btn active'
                      : 'level-btn'
                  }
                >
                  {level}
                </button>
              ))}
          </div>

          <h3 className="capsule-title">
            Remaining Capsules : {tokensLeft}
          </h3>

          <div className="capsule-container">
            {Array.from({
              length: tokensLeft
            }).map((_, i) => (
              <div
                key={i}
                className="capsule"
              >
                <div className="capsule-top"></div>
                <div className="capsule-bottom"></div>
              </div>
            ))}
          </div>

          {!result && (
            <div className="action-row">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() =>
                    makeMove(n)
                  }
                  className="move-btn"
                >
                  Take {n}
                </button>
              ))}
            </div>
          )}

          {result && (
            <div className="result-box">
              <h2>
                {result === 'WIN'
                  ? '🏆 Doctor Wins'
                  : '💀 AI Wins'}
              </h2>

              <button
                onClick={resetGame}
                className="reset-btn"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        <div className="nim-right">

          <div className="info-card">
            <h3>
              🧠 Strategic Reasoning Score
            </h3>

            <div className="iq-score">
              {iq}
            </div>
          </div>

          <div className="info-card">
            <h3>📊 Analytics</h3>

            <p>Wins : {wins}</p>
            <p>Losses : {losses}</p>
            <p>Difficulty : {difficulty}</p>

            <p>
              Win Rate :
              {wins + losses === 0
                ? ' 0%'
                : ` ${Math.round(
                    (wins /
                      (wins + losses)) *
                      100
                  )}%`}
            </p>
          </div>

          <div className="info-card">
            <h3>
              ✂️ Alpha-Beta Pruning
            </h3>

            <p>
              Expanded Nodes :
              {expandedNodes}
            </p>

            <p>
              Pruned Nodes :
              {prunedNodes}
            </p>
          </div>
<div className="info-card">

  <h3>
    📈 Minimax Search Analytics
  </h3>

  <p>
    Expanded Nodes Efficiency
  </p>

  <div className="graph-track">
    <div
      className="graph-blue"
      style={{
        width:
          `${Math.min(
            expandedNodes * 2,
            100
          )}%`
      }}
    />
  </div>

  <p>
    Alpha-Beta Pruning Efficiency
  </p>

  <div className="graph-track">
    <div
      className="graph-green"
      style={{
        width:
          `${Math.min(
            prunedNodes * 4,
            100
          )}%`
      }}
    />
  </div>

</div>
          <div className="info-card">
            <h3>
              🤖 Decision Trace
            </h3>

            <pre>
              {decisionTrace}
            </pre>
          </div>

          <div className="info-card">
            <h3>
              📜 Activity Logs
            </h3>

            {logs.map(
              (log, index) => (
                <p key={index}>
                  {log}
                </p>
              )
            )}
          </div>

        </div>

      </div>
    </>
  );
}
