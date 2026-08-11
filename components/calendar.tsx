import {useState} from "react";

import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import {Pressable, StyleSheet} from "react-native";
import {getLocalDateString} from "@/utils/date";

const WEEKDAYS: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


type CalendarProps = {
    completedDates: string[];
    todayString: string;
    selectedDate: string;
    onSelectDate: (date: string) => void;
}

export function Calendar({completedDates, todayString, selectedDate, onSelectDate}: CalendarProps) {
    const [displayedCalendarDate, setDisplayedCalendarDate] = useState<Date>(new Date());
    const displayedCalendarMonth: number = displayedCalendarDate.getMonth();
    const displayedCalendarYear: number = displayedCalendarDate.getFullYear();

    const daysInCurrentMonth: (number | null)[] = getDaysInCurrentMonth(displayedCalendarDate);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    function showPreviousMonth(): void {
        const newDate = new Date(displayedCalendarYear, displayedCalendarMonth - 1, 1);

        setDisplayedCalendarDate(newDate);
    }

    function showNextMonth(): void {
        const newDate = new Date(displayedCalendarYear, displayedCalendarMonth + 1, 1);

        setDisplayedCalendarDate(newDate);
    }

    return (
        <ThemedView>
            <ThemedView style={styles.calendarMonthYearContainer}>
                <Pressable onPress={showPreviousMonth}>
                    <ThemedText style={styles.calenderMonthYearText}>
                        ←
                    </ThemedText>
                </Pressable>

                <ThemedText style={styles.calenderMonthYearText}>
                    {MONTHS[displayedCalendarMonth]} {displayedCalendarYear}
                </ThemedText>

                <Pressable onPress={showNextMonth}>
                    <ThemedText style={styles.calenderMonthYearText}>
                        →
                    </ThemedText>
                </Pressable>
            </ThemedView>
            <ThemedView style={styles.calendarContainer}>
                {WEEKDAYS.map((day: string) => (
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

                    const isFuture: boolean = dateForDay > startOfToday;
                    const isPast: boolean = dateForDay < startOfToday;
                    const missed: boolean = isPast && !completed;

                    const isSelected: boolean = dateString === selectedDate;

                    return (
                        <ThemedView key={index} style={styles.calendarDayCell}>
                            <Pressable
                                disabled={isFuture}
                                onPress={() => onSelectDate(dateString)}
                                style={[
                                    styles.dayCircle,
                                    isFuture && styles.futureDay,
                                    missed && styles.missedDayCircle,
                                    completed && styles.completedDayCircle,
                                    isSelected && styles.selectedDayCircle,
                                ]}
                            >

                                <ThemedText
                                    style={[
                                        styles.calendarDayText,
                                        (completed || missed) && styles.markedDayText, (isToday) && styles.todayText
                                    ]}
                                >
                                    {day}
                                </ThemedText>
                            </Pressable>
                        </ThemedView>
                    );
                })}
            </ThemedView>
        </ThemedView>
    )
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
    todayText: {
        color: '#0ea5e9'
    },
    markedDayText: {
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
    selectedDayCircle: {
        borderWidth: 3,
        borderColor: '#0ea5e9'
    },
    missedDayCircle: {
        backgroundColor: '#ef4444',
    },
    futureDay: {
        opacity: 0.35,
    },
});
