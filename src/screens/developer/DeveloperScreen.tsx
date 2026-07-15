import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme, type Theme } from '@theme';
import { useSettingsStore } from '@stores';
import { Screen, AppText, Card, Button } from '@components';
import { IS_DEV, APP_NAME, APP_VERSION, FEATURES } from '@env';
import { checkPermission, requestPermission } from '@services/permissions';

const RECORD_AUDIO = 'android.permission.RECORD_AUDIO';

function DeveloperScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const themeOverride = useSettingsStore(state => state.themeOverride);
  const [micGranted, setMicGranted] = useState<boolean | null>(null);

  const refreshMicPermission = useCallback(() => {
    checkPermission(RECORD_AUDIO).then(setMicGranted);
  }, []);

  // Refreshes on focus, matching DiagnosticsScreen's pattern (ADR-027) —
  // no polling. Status only; the actual request is a manual button below,
  // since no engine needs this permission yet (see ADR-031).
  useFocusEffect(
    useCallback(() => {
      refreshMicPermission();
    }, [refreshMicPermission]),
  );

  const handleRequestMic = useCallback(() => {
    requestPermission(RECORD_AUDIO).then(setMicGranted);
  }, []);

  return (
    <Screen center={false}>
      <View style={styles.content}>
        <AppText variant="titleLarge" style={styles.heading}>
          Developer
        </AppText>

        <Card>
          <AppText variant="titleMedium" color={theme.colors.textSecondary}>
            Build Info
          </AppText>
          <InfoRow label="App" value={APP_NAME} />
          <InfoRow label="Version" value={APP_VERSION} />
          <InfoRow
            label="Environment"
            value={IS_DEV ? 'Development' : 'Production'}
          />
        </Card>

        <Card>
          <AppText variant="titleMedium" color={theme.colors.textSecondary}>
            Theme
          </AppText>
          <InfoRow label="Resolved Mode" value={theme.mode} />
          <InfoRow label="Override" value={themeOverride} />
        </Card>

        <Card>
          <AppText variant="titleMedium" color={theme.colors.textSecondary}>
            Feature Flags
          </AppText>
          {Object.entries(FEATURES).map(([key, value]) => (
            <InfoRow
              key={key}
              label={key}
              value={value ? 'Enabled' : 'Disabled'}
            />
          ))}
        </Card>

        <Card>
          <AppText variant="titleMedium" color={theme.colors.textSecondary}>
            Permissions
          </AppText>
          <InfoRow
            label="Microphone"
            value={
              micGranted == null ? 'Unknown' : micGranted ? 'Granted' : 'Denied'
            }
          />
          <Button
            label="Request Microphone"
            onPress={handleRequestMic}
            testID="request-microphone"
          />
        </Card>
      </View>
    </Screen>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  const theme = useTheme();
  const styles = useMemo(() => createRowStyles(theme), [theme]);

  return (
    <View style={styles.row}>
      <AppText variant="bodyMedium" color={theme.colors.textSecondary}>
        {label}
      </AppText>
      <AppText variant="bodyMedium">{value}</AppText>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    content: {
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },
    heading: {
      fontWeight: '600',
    },
  });
}

function createRowStyles(theme: Theme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.xs,
    },
  });
}

export default DeveloperScreen;
