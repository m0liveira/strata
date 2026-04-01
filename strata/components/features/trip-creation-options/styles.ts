import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        paddingBottom: '40%',
    },
    imageContainer: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        height: '38%',
    },
    image: {
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: '4%',
        marginTop: '40%',
    },
});