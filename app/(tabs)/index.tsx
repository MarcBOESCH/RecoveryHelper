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
    const [selectedDate, setSelectedDate] = useState<string>(todayString);

    const currentStreak: number = calculateStreak(completedDates);
    const completedSelectedDate: boolean = completedDates.includes(selectedDate);

    async function completeDate(date: string): Promise<void> {
        if (!completedDates.includes(date)) {
            const updatedDates: string[] = [...completedDates, date];

            setCompletedDates(updatedDates);
            await AsyncStorage.setItem('completedDates', JSON.stringify(updatedDates));

        }
    }

    async function removeCompletedDate(date: string): Promise<void> {
        if (completedDates.includes(date)) {
            const updatedDates: string[] = completedDates.filter(completedDate => completedDate !== date);
            setCompletedDates(updatedDates);
            await AsyncStorage.setItem('completedDates', JSON.stringify(updatedDates));
        }
    }

    return (
        <ThemedView style={styles.screen}>
            <ScrollView>

                <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title">RecoveryHelper</ThemedText>
                </ThemedView>

                <ThemedView style={styles.streakContainer}>
                    <ThemedText
                        style={styles.streakText}>🔥 {currentStreak} {(currentStreak === 1) ? 'Day' : 'Days'}</ThemedText>
                </ThemedView>

                <Calendar completedDates={completedDates} todayString={todayString}
                          onSelectDate={setSelectedDate} selectedDate={selectedDate}></Calendar>

                <ThemedView style={styles.markDatesContainer}>
                    <ThemedText style={styles.markDatesText}>
                        {completedSelectedDate ? 'Awesome!' : 'Did you make it?'}
                    </ThemedText>

                    <ThemedView style={styles.markDatesButtonContainer}>
                        <Pressable disabled={!completedSelectedDate}
                                   style={[styles.markButton, styles.buttonRed, !completedSelectedDate && styles.disabledButton]}
                                   onPress={() => removeCompletedDate(selectedDate)}
                        >
                            <ThemedText style={styles.buttonText}>
                                No
                            </ThemedText>
                        </Pressable>
                        <Pressable disabled={completedSelectedDate}
                                   style={[styles.markButton, styles.buttonGreen, completedSelectedDate && styles.disabledButton]}
                                   onPress={() => completeDate(selectedDate)}
                        >
                            <ThemedText style={styles.buttonText}>
                                Yes
                            </ThemedText>
                        </Pressable>
                    </ThemedView>
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

    markDatesContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    markDatesButtonContainer: {
        flexDirection: 'row',
        gap: 15,
    },
    markDatesText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },

    markButton: {
        width: '20%',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    buttonRed: {
        backgroundColor: '#ef4444',
    },
    buttonGreen: {
        backgroundColor: '#84cc16',
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: '600',
    },
});
