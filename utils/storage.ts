import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadCompletedDates(): Promise<string[]> {
    const storedDates: string | null = await AsyncStorage.getItem('completedDates');
    if (storedDates !== null) {
        return JSON.parse(storedDates);
    }

    return [];
}

export async function saveCompletedDates(completedDates: string[]): Promise<void> {
    await AsyncStorage.setItem('completedDates', JSON.stringify(completedDates));
}