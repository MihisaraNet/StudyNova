import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configure how notifications are handled when the app is in the foreground
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

const WEEKDAYS = {
  'sunday': 1,
  'monday': 2,
  'tuesday': 3,
  'wednesday': 4,
  'thursday': 5,
  'friday': 6,
  'saturday': 7
};

/**
 * Request notification permissions from the user.
 */
export const requestPermissions = async () => {
  if (Platform.OS === 'web') return true;
  
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Schedules a recurring weekly local reminder for a study session.
 */
export const scheduleStudySessionReminder = async (session) => {
  if (Platform.OS === 'web') {
    console.log(`[Mock Web Notification] Scheduled reminder for: ${session.title} (${session.dayOfWeek} at ${session.startTime})`);
    return `mock-notif-${session.id}`;
  }

  try {
    // Request permission first
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    // First cancel any existing reminder for this session
    await cancelStudySessionReminder(session.id);

    const weekdayIndex = WEEKDAYS[session.dayOfWeek.toLowerCase()];
    if (!weekdayIndex) return null;

    // Parse start time (e.g. "09:30")
    const [hourStr, minStr] = session.startTime.split(':');
    let hour = parseInt(hourStr, 10);
    let minute = parseInt(minStr, 10);

    // Subtract reminder offset
    minute -= session.reminderMinutesBefore;
    let adjustedWeekday = weekdayIndex;
    
    if (minute < 0) {
      hour -= 1;
      minute += 60;
    }
    if (hour < 0) {
      hour += 24;
      adjustedWeekday -= 1;
      if (adjustedWeekday < 1) {
        adjustedWeekday = 7;
      }
    }

    // Schedule notification via expo-notifications
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: `📚 Study Session Reminder: ${session.subjectName || 'Study Session'}`,
        body: `It's time for "${session.title}" in ${session.reminderMinutesBefore} minutes at ${session.startTime}!`,
        sound: true,
        data: { sessionId: session.id },
      },
      trigger: {
        weekday: adjustedWeekday,
        hour: hour,
        minute: minute,
        repeats: true,
      },
    });

    console.log(`[Notification] Scheduled session ${session.id} for weekday ${adjustedWeekday} at ${hour}:${minute} with ID ${identifier}`);
    return identifier;
  } catch (error) {
    console.error('Error scheduling study session reminder:', error);
    return null;
  }
};

/**
 * Cancels a scheduled local reminder for a study session.
 */
export const cancelStudySessionReminder = async (sessionId) => {
  if (Platform.OS === 'web') {
    console.log(`[Mock Web Notification] Cancelled reminder for session: ${sessionId}`);
    return;
  }

  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const matched = scheduled.find(n => n.content.data?.sessionId === sessionId);
    
    if (matched) {
      await Notifications.cancelScheduledNotificationAsync(matched.identifier);
      console.log(`[Notification] Cancelled notification: ${matched.identifier} for session ${sessionId}`);
    }
  } catch (error) {
    console.error('Error cancelling study session reminder:', error);
  }
};

/**
 * Syncs all local reminders with the database sessions list.
 */
export const syncAllReminders = async (sessions) => {
  if (Platform.OS === 'web') {
    console.log(`[Mock Web Notification] Synced ${sessions.length} reminders.`);
    return;
  }

  try {
    // Cancel all current scheduled notifications to prevent duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Re-schedule all enabled sessions
    for (const session of sessions) {
      if (session.reminderEnabled) {
        await scheduleStudySessionReminder(session);
      }
    }
    console.log(`[Notification] Synced and scheduled ${sessions.filter(s => s.reminderEnabled).length} reminders.`);
  } catch (error) {
    console.error('Error syncing all reminders:', error);
  }
};
