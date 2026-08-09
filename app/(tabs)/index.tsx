import {useEffect, useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';

export default function HomeScreen() {
    const [completedDates, setCompletedDates] = useState<string[]>([]);

    // Load completed dates from AsyncStorage
    useEffect(() => {
        async function loadCompletedDates() {
            const storedDates: string | null = await AsyncStorage.getItem('completedDates');
            if (storedDates !== null) {
                const parsedDates: string[] = JSON.parse(storedDates);
                setCompletedDates(parsedDates);
            }
        }

        loadCompletedDates();
    }, []);

    const today: Date = new Date();
    const todayString: string = getLocalDateString(today);

    const currentStreak: number = calculateStreak(completedDates);
    const completedToday: boolean = completedDates.includes(todayString);

    return (
        <ThemedView>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">RecoveryHelper</ThemedText>
            </ThemedView>
            <ThemedView style={styles.streakContainer}>
                <ThemedText type="subtitle">My Streak</ThemedText>
                <ThemedText type="subtitle">🔥 {currentStreak} days</ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <Pressable style={() => [
                    styles.completeButton, completedToday && styles.completedButton]}
                           onPress={async () => {
                    if (!completedToday) {
                        const updatedDates: string[] = [...completedDates, todayString];
                        setCompletedDates(updatedDates);
                        await AsyncStorage.setItem('completedDates', JSON.stringify(updatedDates));

                    }
                }}>
                    <ThemedText style={styles.buttonText}>{completedToday ? 'Awesome!' : 'Did you make it?'}</ThemedText>
                </Pressable>
            </ThemedView>
        </ThemedView>
    );
}

function calculateStreak(completedDates: string[]): number {
    let streak: number = 0;
    let dateToCheck: Date = new Date();
    let dateToCheckString: string = getLocalDateString(dateToCheck);

    if (!completedDates.includes(dateToCheckString)) {
      dateToCheck.setDate(dateToCheck.getDate() - 1);
      dateToCheckString = getLocalDateString(dateToCheck);
    }

    while (completedDates.includes(dateToCheckString)) {
        streak++;
        dateToCheck.setDate(dateToCheck.getDate() - 1);
        dateToCheckString = getLocalDateString(dateToCheck);
    }
    return streak;
}

function getLocalDateString(date: Date): string {
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1;
    const day: number = date.getDate();

    const monthString: string = month.toString().padStart(2, '0');
    const dayString: string = day.toString().padStart(2, '0');

    return `${year}-${monthString}-${dayString}`;
}

const styles = StyleSheet.create({
    titleContainer: {
        marginTop: 100,
        alignItems: 'center',
        gap: 8,
    },
    streakContainer: {
        paddingTop: 10,
        gap: 8,
        marginBottom: 8,
        alignItems: 'center',
    },
    stepContainer: {
        paddingTop: 20,
        alignItems: 'center',
        gap: 8,
    },
    completeButton: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: '#222',
    },
    completedButton: {
        opacity: 0.6,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
});
