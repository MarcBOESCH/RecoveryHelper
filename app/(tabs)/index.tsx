import {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {Calendar} from "@/components/calendar";
import {getLocalDateString} from "@/utils/date"
import {calculateStreak} from "@/utils/streak";

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
        <ThemedView style={styles.screen}>
            <ScrollView>

                <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title">RecoveryHelper</ThemedText>
                </ThemedView>

                <ThemedView style={styles.streakContainer}>
                    <ThemedText style={styles.streakText}>🔥 {currentStreak} {(currentStreak === 1) ? 'Day' : 'Days'}</ThemedText>
                </ThemedView>

                <Calendar completedDates={completedDates} todayString={todayString}></Calendar>

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
                        <ThemedText
                            style={styles.buttonText}>{completedToday ? 'Awesome!' : 'Did you make it?'}
                        </ThemedText>
                    </Pressable>
                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },

    titleContainer: {
        marginTop: 100,
        paddingBottom: 20,
        alignItems: 'center',
        gap: 8,
    },

    streakContainer: {
        marginTop: 10,
        gap: 8,
        marginBottom: 8,
        alignItems: 'center',
    },
    streakText: {
        marginBottom: 20,
        fontSize: 40,
        lineHeight: 50,
        fontWeight: 'bold',
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
