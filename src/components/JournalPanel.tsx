import { Badge, Card, Stack, Text, View } from "reshaped";
import type { JournalEntry } from "../types";

interface JournalPanelProps {
  entries: JournalEntry[];
}

export function JournalPanel({ entries }: JournalPanelProps) {
  return (
    <View padding={4} gap={4} backgroundColor="canvas" borderRadius={4} className="panel">
      <Stack gap={3} align="stretch">
        <Text variant="title-3">Journal</Text>
        {entries.length === 0 ? (
          <Text color="neutral-faded">No journal entries yet.</Text>
        ) : (
          <Stack gap={3}>
            {entries.map((entry) => (
              <Card key={entry.id} padding={4} variant="filled">
                <Stack gap={2} align="stretch">
                  <Stack direction="row" gap={3} wrap>
                    <Text weight="medium">{entry.date ?? "No date"}</Text>
                    <Text color="neutral-faded">{entry.reference || "No reference"}</Text>
                  </Stack>
                  <Stack gap={2}>
                    {entry.lineItems.map((lineItem) => (
                      <View key={lineItem.id} padding={3} borderRadius={3} backgroundColor="surface">
                        <Stack direction="row" justify="space-between" align="center" wrap>
                          <Stack direction="row" gap={2} wrap>
                            {Object.entries(lineItem.dimensions)
                              .filter(([key]) => key !== "accountNumber")
                              .map(([key, value]) => (
                                <Badge key={key} color="primary">
                                  {key}:{value}
                                </Badge>
                              ))}
                          </Stack>
                          <Stack direction="row" gap={2} align="center">
                            <Badge color={lineItem.side === "debit" ? "positive" : "critical"}>
                              {lineItem.side.toUpperCase()}
                            </Badge>
                            <Text weight="medium">{lineItem.amount.toFixed(2)} €</Text>
                          </Stack>
                        </Stack>
                      </View>
                    ))}
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </View>
  );
}
