import { Card, Stack, Text, View } from "reshaped";

interface ReportsPanelProps {
  placeholder?: string;
}

export function ReportsPanel({ placeholder = "Enter report predicate..." }: ReportsPanelProps) {
  return (
    <View padding={4} gap={4} backgroundColor="canvas" borderRadius={4} className="panel">
      <Stack gap={3} align="stretch">
        <Text variant="title-3">Reports</Text>
        <Card padding={4} variant="filled">
          <Stack gap={2}>
            <Text color="neutral-faded">
              Reports will allow you to define predicates for journal exploration in a future iteration.
            </Text>
            <label className="field">
              <span className="field-label">Report predicate</span>
              <textarea placeholder={placeholder} disabled rows={3} />
            </label>
          </Stack>
        </Card>
      </Stack>
    </View>
  );
}
