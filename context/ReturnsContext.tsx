import { createContext, ReactNode, useContext, useState } from "react";

type ReturnRecord = {
  rma_id: string;
  barcode: string;
  status: "approved" | "declined";
  reason?: string;
  operator: string;
  timestamp: number;
};

type ReturnsContextType = {
  operator: string | null;
  recentReturns: ReturnRecord[];
  login: (name: string) => void;
  addReturn: (record: Omit<ReturnRecord, "timestamp">) => void;
};

const ReturnsContext = createContext<ReturnsContextType | null>(null);

export function ReturnsProvider({ children }: { children: ReactNode }) {
  const [operator, setOperator] = useState<string | null>(null);
  const [recentReturns, setRecentReturns] = useState<ReturnRecord[]>([]);

  function login(name: string) {
    setOperator(name);
  }

  function addReturn(record: Omit<ReturnRecord, "timestamp">) {
    setRecentReturns((prev) => [
      { ...record, timestamp: Date.now() },
      ...prev,
    ]);
  }

  return (
    <ReturnsContext.Provider
      value={{ operator, recentReturns, login, addReturn }}
    >
      {children}
    </ReturnsContext.Provider>
  );
}

export function useReturns() {
  const ctx = useContext(ReturnsContext);
  if (!ctx) throw new Error("useReturns must be used inside ReturnsProvider");
  return ctx;
}
