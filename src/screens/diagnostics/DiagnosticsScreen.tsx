import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme, type Theme } from '@theme';
import { Screen, AppText, Button } from '@components';
import { logger, type LogEntry } from '@logger';

function DiagnosticsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [entries, setEntries] = useState<LogEntry[]>([]);

  const refresh = useCallback(() => {
    setEntries([...logger.getEntries()].reverse());
  }, []);

  // Refreshes whenever this screen gains focus (e.g. navigating back to
  // it) instead of polling — ENGINEERING_PRINCIPLES.md prefers
  // callbacks/listeners over polling for battery reasons.
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const handleClear = useCallback(() => {
    logger.clear();
    refresh();
  }, [refresh]);

  return (
    <Screen center={false}>
      <View style={styles.header}>
        <AppText variant="titleLarge" style={styles.title}>
          Diagnostics
        </AppText>
        <View style={styles.actions}>
          <Button label="Refresh" onPress={refresh} testID="refresh-logs" />
          <Button label="Clear" onPress={handleClear} testID="clear-logs" />
        </View>
      </View>

      {entries.length === 0 ? (
        <AppText
          variant="bodyMedium"
          color={theme.colors.textSecondary}
          style={styles.empty}
        >
          No log entries yet.
        </AppText>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item }) => <LogRow entry={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </Screen>
  );
}

interface LogRowProps {
  entry: LogEntry;
}

function LogRow({ entry }: LogRowProps) {
  const theme = useTheme();
  const styles = useMemo(() => createRowStyles(theme), [theme]);

  const color =
    entry.level === 'error'
      ? theme.colors.error
      : entry.level === 'warn'
      ? theme.colors.secondary
      : theme.colors.text;

  return (
    <View style={styles.row}>
      <AppText variant="labelSmall" color={theme.colors.textSecondary}>
        {new Date(entry.timestamp).toLocaleTimeString()} · {entry.tag}
      </AppText>
      <AppText variant="bodyMedium" color={color}>
        {entry.message}
      </AppText>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    header: {
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    title: {
      fontWeight: '600',
    },
    actions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    empty: {
      padding: theme.spacing.md,
    },
    list: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },
  });
}

function createRowStyles(theme: Theme) {
  return StyleSheet.create({
    row: {
      paddingVertical: theme.spacing.xs,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.outline,
    },
  });
}

export default DiagnosticsScreen;
