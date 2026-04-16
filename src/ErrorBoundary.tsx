import { Component, ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; message: string; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#0a0e17", color: "#eae5ec", fontFamily: "Geist, sans-serif",
          gap: 16, padding: 24, textAlign: "center"
        }}>
          <div style={{ fontSize: "2rem" }}>⚠️</div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Something went wrong</h2>
          <p style={{ color: "#8892a4", fontSize: "0.9rem", maxWidth: 400 }}>{this.state.message}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 24px", background: "#5eead4", border: "none",
              borderRadius: 8, color: "#0a0e17", fontWeight: 700,
              cursor: "pointer", fontSize: "0.88rem"
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
