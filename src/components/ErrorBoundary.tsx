"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[99999] bg-black text-red-500 p-10 overflow-auto font-mono text-sm">
          <h1 className="text-2xl mb-4 font-bold">Something went wrong!</h1>
          <pre>{this.state.error?.message}</pre>
          <pre className="mt-4 opacity-50">{this.state.error?.stack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
