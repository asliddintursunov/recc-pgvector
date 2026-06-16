import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Application error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
          <div className="rounded-lg border border-red-200 bg-white p-8 shadow-soft">
            <h1 className="text-xl font-semibold text-zinc-950">Something broke</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Refresh the page and try again. If the issue repeats, check the browser console for
              details.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
