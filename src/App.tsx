import "reshaped/themes/reshaped.css";
import "./App.css";
import { Reshaped, Stack, View } from "reshaped";
import { useMemo } from "react";
import { AccountsPanel } from "./components/AccountsPanel";
import { BookingsPanel } from "./components/BookingsPanel";
import { ExportPanel } from "./components/ExportPanel";
import { JournalPanel } from "./components/JournalPanel";
import { QueryPanel } from "./components/QueryPanel";
import { ReportsPanel } from "./components/ReportsPanel";
import { accounts } from "./data/accounts";
import { useLocalStorageState } from "./hooks/useLocalStorage";
import type { Booking } from "./types";
import { buildJournalEntries } from "./utils/journal";
import { buildReconstructionRows } from "./utils/reconstruction";

export default function App() {
  const [bookings, setBookings] = useLocalStorageState<Booking[]>("demo:bookings", []);

  const journalEntries = useMemo(() => buildJournalEntries(bookings), [bookings]);
  const reconstructionRows = useMemo(
    () => buildReconstructionRows(journalEntries),
    [journalEntries]
  );

  return (
    <Reshaped theme="reshaped">
      <View padding={6} gap={6} className="app-shell">
        <Stack gap={6} align="stretch">
          <AccountsPanel accounts={accounts} />
          <View display="grid" gap={6} className="panels-grid">
            <BookingsPanel bookings={bookings} onChange={setBookings} />
            <JournalPanel entries={journalEntries} />
            <ExportPanel rows={reconstructionRows} />
            <ReportsPanel />
          </View>
          <QueryPanel entries={journalEntries} />
        </Stack>
      </View>
    </Reshaped>
  );
}
