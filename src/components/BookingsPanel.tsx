import { useMemo } from "react";
import { Button, Card, Stack, Text, View } from "reshaped";
import { accountOptions } from "../data/accounts";
import type { Booking, BookingPosition } from "../types";
import { generateId } from "../utils/id";

interface BookingsPanelProps {
  bookings: Booking[];
  onChange: (bookings: Booking[]) => void;
}

const emptyPosition = (): BookingPosition => ({
  id: generateId(),
  accountNumber: null,
  side: "debit",
  amount: ""
});

const emptyBooking = (): Booking => ({
  id: generateId(),
  date: null,
  reference: "",
  positions: [emptyPosition(), emptyPosition()]
});

function calculateBalance(booking: Booking) {
  return booking.positions.reduce((total, position) => {
    const amount = typeof position.amount === "number" ? position.amount : 0;
    return position.side === "debit" ? total + amount : total - amount;
  }, 0);
}

export function BookingsPanel({ bookings, onChange }: BookingsPanelProps) {
  const totals = useMemo(
    () => new Map(bookings.map((booking) => [booking.id, calculateBalance(booking)])),
    [bookings]
  );

  const handleBookingChange = (id: string, update: Partial<Booking>) => {
    onChange(
      bookings.map((booking) => (booking.id === id ? { ...booking, ...update } : booking))
    );
  };

  const handlePositionChange = (bookingId: string, positionId: string, update: Partial<BookingPosition>) => {
    onChange(
      bookings.map((booking) => {
        if (booking.id !== bookingId) return booking;
        return {
          ...booking,
          positions: booking.positions.map((position) =>
            position.id === positionId ? { ...position, ...update } : position
          )
        };
      })
    );
  };

  const addBooking = () => {
    onChange([...bookings, emptyBooking()]);
  };

  const removeBooking = (id: string) => {
    onChange(bookings.filter((booking) => booking.id !== id));
  };

  const addPosition = (bookingId: string) => {
    onChange(
      bookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              positions: [...booking.positions, emptyPosition()]
            }
          : booking
      )
    );
  };

  const removePosition = (bookingId: string, positionId: string) => {
    onChange(
      bookings.map((booking) => {
        if (booking.id !== bookingId) return booking;
        return {
          ...booking,
          positions: booking.positions.filter((position) => position.id !== positionId)
        };
      })
    );
  };

  return (
    <View padding={4} gap={4} backgroundColor="canvas" borderRadius={4} className="panel">
      <Stack gap={3} align="stretch">
        <Stack direction="row" justify="space-between" align="center">
          <Text variant="title-3">Bookings</Text>
          <Button onClick={addBooking} variant="solid">
            Add booking
          </Button>
        </Stack>
        <Stack gap={3}>
          {bookings.map((booking) => {
            const balance = totals.get(booking.id) ?? 0;
            const invalid = Math.abs(balance) > 0.005;
            return (
              <Card key={booking.id} padding={4} variant="filled" className={invalid ? "booking-card invalid" : "booking-card"}>
                <Stack gap={3} align="stretch">
                  <Stack direction="row" gap={3} wrap>
                    <label className="field">
                      <span className="field-label">Date</span>
                      <input
                        type="date"
                        value={booking.date ?? ""}
                        onChange={(event) =>
                          handleBookingChange(booking.id, { date: event.target.value || null })
                        }
                      />
                    </label>
                    <label className="field">
                      <span className="field-label">Reference</span>
                      <input
                        type="text"
                        placeholder="urn:invoice:1234"
                        value={booking.reference}
                        onChange={(event) =>
                          handleBookingChange(booking.id, { reference: event.target.value })
                        }
                      />
                    </label>
                    <Button variant="outline" onClick={() => removeBooking(booking.id)}>
                      Remove booking
                    </Button>
                  </Stack>
                  <Stack gap={2}>
                    {booking.positions.map((position) => (
                      <View
                        key={position.id}
                        padding={3}
                        borderRadius={3}
                        backgroundColor="surface"
                        className="position-row"
                      >
                        <Stack direction="row" gap={3} wrap align="center">
                          <label className="field">
                            <span className="field-label">Account</span>
                            <select
                              value={position.accountNumber ?? ""}
                              onChange={(event) =>
                                handlePositionChange(booking.id, position.id, {
                                  accountNumber: event.target.value || null
                                })
                              }
                            >
                              <option value="">Select account</option>
                              {accountOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="field">
                            <span className="field-label">Side</span>
                            <select
                              value={position.side}
                              onChange={(event) =>
                                handlePositionChange(booking.id, position.id, {
                                  side: event.target.value as BookingPosition["side"]
                                })
                              }
                            >
                              <option value="debit">Debit</option>
                              <option value="credit">Credit</option>
                            </select>
                          </label>
                          <label className="field">
                            <span className="field-label">Amount (€)</span>
                            <input
                              type="number"
                              step="0.01"
                              value={position.amount === "" ? "" : position.amount}
                              onChange={(event) =>
                                handlePositionChange(booking.id, position.id, {
                                  amount: event.target.value === "" ? "" : Number(event.target.value)
                                })
                              }
                            />
                          </label>
                          <Button variant="ghost" onClick={() => removePosition(booking.id, position.id)}>
                            Remove
                          </Button>
                        </Stack>
                      </View>
                    ))}
                  </Stack>
                  <Stack direction="row" justify="space-between" align="center">
                    <Button variant="outline" onClick={() => addPosition(booking.id)}>
                      Add position
                    </Button>
                    <Text weight="medium" color={invalid ? "critical" : "positive"}>
                      Balance: {balance.toFixed(2)} €
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            );
          })}
        </Stack>
      </Stack>
    </View>
  );
}
