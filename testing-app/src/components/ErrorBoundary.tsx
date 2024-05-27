import React from "react";

export class ErrorBoundary extends React.Component<
  {
    children?: React.ReactNode;
    fallback?: React.ReactNode;
  },
  {
    hasError: boolean;
  }
> {
  public state = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  public componentDidCatch(
    error: Error,
    errorInfo: React.ErrorInfo
  ) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <h1>{this.props.fallback ?? "_error_boundary_"}</h1>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
