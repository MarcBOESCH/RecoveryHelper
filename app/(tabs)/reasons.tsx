import {useEffect, useState} from "react";
import {loadReasons, saveReasons} from "@/utils/storage";
import {ThemedView} from "@/components/themed-view";
import {ThemedText} from "@/components/themed-text";
import {Pressable, TextInput, StyleSheet, ScrollView} from "react-native";


export default function ReasonScreen() {
    const [reasons, setReasons] = useState<string[]>([]);
    const [newReason, setNewReason] = useState<string>('');


    useEffect(() => {
        async function getData(): Promise<void> {

            const storedReasons = await loadReasons();

            setReasons(storedReasons);
        }

        getData();
    }, []);


    async function addReason(): Promise<void> {
        const trimmedReason: string = newReason.trim();

        if (trimmedReason !== '') {
            const updatedReasons: string[] = [...reasons, trimmedReason]

            setReasons(updatedReasons);
            await saveReasons(updatedReasons)

            setNewReason('');
        }
    }

    return (
        <ThemedView style={styles.screen}>
            <ScrollView>
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

    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },

    reasonContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 12,
        marginTop: 100,
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

})
