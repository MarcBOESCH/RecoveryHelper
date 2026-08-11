export function getLocalDateString(date: Date): string {
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1;
    const day: number = date.getDate();

    const monthString: string = month.toString().padStart(2, '0');
    const dayString: string = day.toString().padStart(2, '0');

    return `${year}-${monthString}-${dayString}`;
}