import {getLocalDateString} from "@/utils/date";

export function calculateStreak(completedDates: string[]): number {
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