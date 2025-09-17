import { Badge, Card, Stack, Text, View } from "reshaped";
import type { Account } from "../data/accounts";

interface AccountsPanelProps {
  accounts: Account[];
}

export function AccountsPanel({ accounts }: AccountsPanelProps) {
  return (
    <View padding={4} gap={4} backgroundColor="canvas" borderRadius={4} className="panel">
      <Stack gap={2} align="stretch">
        <Text variant="title-3">Accounts</Text>
        <Stack gap={3} wrap className="accounts-grid">
          {accounts.map((account) => (
            <Card key={account.number} variant="filled" padding={3} className="account-card">
              <Stack gap={1} align="stretch">
                <Text variant="title-4">{account.number}</Text>
                <Text>{account.name}</Text>
                <Stack gap={1} direction="row" wrap>
                  {Object.entries(account.dimensions).map(([name, value]) => (
                    <Badge key={name} color="primary">
                      {name}:{value}
                    </Badge>
                  ))}
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>
    </View>
  );
}
