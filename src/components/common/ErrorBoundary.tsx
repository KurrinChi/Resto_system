import React from "react";
import { THEME } from "../../constants/theme";

interface State {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log to console and leave rest to devtools / telemetry
    // eslint-disable-next-line no-console
    console.error("Unhandled error caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: THEME.colors.background.primary,
            color: THEME.colors.text.primary,
            padding: 24,
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 800 }}>
            <h1 style={{ fontSize: 28, marginBottom: 12 }}>Something went wrong</h1>
            <p style={{ color: THEME.colors.text.secondary, marginBottom: 12 }}>
              The application has encountered an unexpected error. Open the browser console
              to see the error details.
            </p>
            <pre
              style={{
                background: THEME.colors.background.secondary,
                color: THEME.colors.text.primary,
                padding: 12,
                borderRadius: 8,
                overflow: "auto",
                textAlign: "left",
              }}
            >
              {this.state.error?.stack || String(this.state.error)}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
