import {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, TextInput} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {Calendar} from "@/components/calendar";
import {getLocalDateString} from "@/utils/date"
import {calculateStreak} from "@/utils/streak";
import {loadCompletedDates, saveCompletedDates} from '@/utils/storage';

export default function HomeScreen() {
    const [completedDates, setCompletedDates] = useState<string[]>([]);

    const [reasons, setReasons] = useState<string[]>([
        'I want more energy',
        'I want to feel better',
        'For my relationship',
        'Irgendwas sehr langes nur um zu Testen und noch weiter hahahahahahahahahahha'
    ]);
    const [newReason, setNewReason] = useState<string>('');

    function addReason(): void {
        const trimmedReason: string = newReason.trim();

        if (newReason.trim() !== '') {
            setReasons([...reasons, trimmedReason]);
            setNewReason('');
        }
    }

    // Load completed dates from AsyncStorage
    useEffect(() => {
        async function loadDates(): Promise<void> {
            const storedDates: string[] = await loadCompletedDates();
            setCompletedDates(storedDates);
            }

            loadDates();
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
            await saveCompletedDates(updatedDates);

        }
    }

    async function removeCompletedDate(date: string): Promise<void> {
        if (completedDates.includes(date)) {
            const updatedDates: string[] = completedDates.filter(completedDate => completedDate !== date);
            setCompletedDates(updatedDates);
            await saveCompletedDates(updatedDates);
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

                <ThemedView style={styles.reasonContainer}>
                    {reasons.map((reason: string) => (
                        <ThemedText key={reason} type="default" style={styles.reasonText}>
                            {reason}
                        </ThemedText>
                    ))}
                    <ThemedView style={styles.newReasonContainer}>
                        <TextInput value={newReason}
                                   onChangeText={setNewReason}
                                   onSubmitEditing={addReason}
                                   returnKeyType="done"
                                   placeholder="Add a reason"
                                   style={styles.newReasonInput}
                        >

                        </TextInput>
                        <Pressable
                            style={styles.newReasonButton}
                            onPress={addReason}
                        >
                            <ThemedText style={styles.newReasonButtonText}>+</ThemedText>
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
        width: 80,
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

    reasonContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 12,
        margin: 20,
        borderColor: '#84cc16',
    },
    reasonText: {
        fontWeight: '600',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },

    newReasonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    newReasonInput: {
        width: 200,
        borderWidth: 2,
        borderRadius: 6,
        borderColor: '#84cc16',
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 10,

    },
    newReasonButton: {
        width: 29,
        height: 29,
        borderWidth: 2,
        borderRadius: 6,
        borderColor: '#84cc16',
        alignItems: 'center',
    },
    newReasonButtonText: {
        color: '#84cc16',
        fontWeight: '700',
        fontSize: 20,
    },
});
