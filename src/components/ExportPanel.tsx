import { Card, Stack, Text, View } from "reshaped";
import type { ReconstructionRow } from "../types";

interface ExportPanelProps {
  rows: ReconstructionRow[];
}

export function ExportPanel({ rows }: ExportPanelProps) {
  return (
    <View padding={4} gap={4} backgroundColor="canvas" borderRadius={4} className="panel">
      <Stack gap={3} align="stretch">
        <Text variant="title-3">Export</Text>
        <Card padding={0} variant="filled">
          <div className="table-scroll">
            <table className="reconstruction-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reference</th>
                  <th>Account</th>
                  <th>Debit (€)</th>
                  <th>Credit (€)</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-row">
                      No reconstructed bookings yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.date ?? "–"}</td>
                      <td>{row.reference || "–"}</td>
                      <td>{row.accountNumber}</td>
                      <td>{row.debit?.toFixed(2) ?? ""}</td>
                      <td>{row.credit?.toFixed(2) ?? ""}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </Stack>
    </View>
  );
}
