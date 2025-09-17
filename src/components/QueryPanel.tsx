import { useMemo, useState } from "react";
import { Badge, Card, Stack, Text, View } from "reshaped";
import type { JournalEntry } from "../types";
import { executeQuery, sumMatches } from "../utils/query";

interface QueryPanelProps {
  entries: JournalEntry[];
}

export function QueryPanel({ entries }: QueryPanelProps) {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => executeQuery(entries, query), [entries, query]);
  const totals = useMemo(() => sumMatches(matches), [matches]);

  return (
    <View padding={4} gap={4} backgroundColor="canvas" borderRadius={4} className="panel">
      <Stack gap={3} align="stretch">
        <Text variant="title-3">Journal Query</Text>
        <Card padding={4} variant="filled">
          <Stack gap={3}>
            <Text>Filter by entering predicates like <code>class:expense vat:19</code>.</Text>
            <label className="field">
              <span className="field-label">Query</span>
              <textarea
                placeholder="Enter query terms..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                rows={3}
              />
            </label>
            <Stack direction="row" gap={3} wrap>
              <Badge color="positive">Total debit: {totals.debit.toFixed(2)} €</Badge>
              <Badge color="critical">Total credit: {totals.credit.toFixed(2)} €</Badge>
              <Badge color="primary">Matches: {matches.length}</Badge>
            </Stack>
            <Stack gap={2}>
              {matches.map(({ entry, lineItem }) => (
                <Card key={`${entry.id}-${lineItem.id}`} padding={3} variant="subtle">
                  <Stack gap={1}>
                    <Text weight="medium">
                      {entry.date ?? "–"} · {entry.reference || "–"}
                    </Text>
                    <Stack direction="row" gap={2} wrap>
                      {Object.entries(lineItem.dimensions).map(([key, value]) => (
                        <Badge key={key} color="primary">
                          {key}:{value}
                        </Badge>
                      ))}
                    </Stack>
                    <Text>
                      {lineItem.side.toUpperCase()} · {lineItem.amount.toFixed(2)} €
                    </Text>
                  </Stack>
                </Card>
              ))}
              {matches.length === 0 && <Text color="neutral-faded">No matches found.</Text>}
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </View>
  );
}
