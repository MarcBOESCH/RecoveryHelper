import {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';

export default function HomeScreen() {
    const [completedDates, setCompletedDates] = useState<string[]>([]);

    const weekdays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun'];
    const months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


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

    const [displayedCalendarDate, setDisplayedCalendarDate] = useState<Date>(today);
    const displayedCalendarMonth: number = displayedCalendarDate.getMonth();
    const displayedCalendarYear: number = displayedCalendarDate.getFullYear();

    const daysInCurrentMonth: (number | null)[] = getDaysInCurrentMonth(displayedCalendarDate);

    const currentStreak: number = calculateStreak(completedDates);
    const completedToday: boolean = completedDates.includes(todayString);


    function showPreviousMonth(): void {
        const newDate = new Date(displayedCalendarYear, displayedCalendarMonth - 1, 1);

        setDisplayedCalendarDate(newDate);
    }

    function showNextMonth(): void {
        const newDate = new Date(displayedCalendarYear, displayedCalendarMonth + 1, 1);

        setDisplayedCalendarDate(newDate);
    }

    return (
        <ThemedView style={styles.screen}>
            <ScrollView>
                <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title">RecoveryHelper</ThemedText>
                </ThemedView>
                <ThemedView style={styles.streakContainer}>
                    <ThemedText style={styles.streakText}>🔥 {currentStreak} {(currentStreak === 1) ? 'Day' : 'Days'}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.calendarMonthYearContainer}>
                    <Pressable onPress={showPreviousMonth}>
                        <ThemedText style={styles.calenderMonthYearText}>
                            ←
                        </ThemedText>
                    </Pressable>

                    <ThemedText style={styles.calenderMonthYearText}>
                         {months[displayedCalendarMonth]} {displayedCalendarYear}
                    </ThemedText>

                    <Pressable onPress={showNextMonth}>
                        <ThemedText style={styles.calenderMonthYearText}>
                            →
                        </ThemedText>
                    </Pressable>
                </ThemedView>
                <ThemedView style={styles.calendarContainer}>
                    {weekdays.map((day: string) => (
                        <ThemedText key={day} type="defaultSemiBold" style={styles.calendarDay}>
                            {day}
                        </ThemedText>
                    ))}
                    {daysInCurrentMonth.map((day: number | null, index: number) => {
                        if (day === null) {
                            return (
                                <ThemedText key={index} style={styles.calendarDay}>
                                </ThemedText>
                            )
                        }

                        const dateForDay = new Date(displayedCalendarYear, displayedCalendarMonth, day);
                        const dateString: string = getLocalDateString(dateForDay)

                        const isToday: boolean = dateString === todayString;
                        const completed: boolean = completedDates.includes(dateString);
                        return (
                            <ThemedView key={index} style={styles.calendarDayCell}>
                                <ThemedView
                                    style={[
                                        styles.dayCircle,
                                        isToday && styles.todayCircle,
                                        completed && styles.completedDayCircle,
                                    ]}
                                >
                                    <ThemedText
                                        style={[
                                            styles.calendarDayText,
                                            completed && styles.completedDayText,
                                        ]}
                                    >
                                        {day}
                                    </ThemedText>
                                </ThemedView>
                            </ThemedView>
                        );
                    })}
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
                        <ThemedText
                            style={styles.buttonText}>{completedToday ? 'Awesome!' : 'Did you make it?'}
                        </ThemedText>
                    </Pressable>
                </ThemedView>
            </ScrollView>
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

function getDaysInCurrentMonth(date: Date): (number | null)[] {
    const month: number = date.getMonth() + 1;
    const year: number = date.getFullYear();

    const daysInMonth: number = new Date(year, month, 0).getDate();
    const firstDayOfMonth: Date = new Date(year, month - 1, 1);
    const firstWeekday: number = (firstDayOfMonth.getDay() + 6) % 7;

    const days: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    return days;
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

    calendarMonthYearContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 10,
    },
    calenderMonthYearText: {
        fontSize: 20,
        fontWeight: 700,
    },

    calendarContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
    },
    calendarDay: {
        width: '14.2857%',
        textAlign: 'center',
        opacity: 0.7,
    },
    calendarDayCell: {
        width: '14.2857%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarDayText: {
        textAlign: 'center',
    },
    completedDayText: {
        color: 'white',
        fontWeight: '600',
    },
    dayCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completedDayCircle: {
        backgroundColor: '#84cc16',
        borderWidth: 0,
    },
    todayCircle: {
        borderWidth: 2,
        borderColor: '#84cc16'
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
