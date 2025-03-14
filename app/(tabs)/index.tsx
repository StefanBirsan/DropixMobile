import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@firebase/auth';
import { app, getAuth } from '@/scripts/firebase';
import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp} from 'react-native-responsive-screen';

type AuthScreenProps = {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
    handleAuthentication: () => void;
};

type AuthenticatedScreenProps = {
    user: { name: string; email: string };
    handleAuthentication: () => void;
};

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }: AuthScreenProps) => {
    return (
        <View style={styles.Screen}>
            <View style={styles.TextContainer}>
                <Text style={styles.TitleText}>Welcome to DropX</Text>
                <Text style={styles.InfoText}>
                    Interactive courier app, please log in with your given credentials in order to continue.
                </Text>
            </View>
            <KeyboardAvoidingView behavior="padding" style={styles.LoginForm}>
                <View style={styles.LoginForm}>
                    <View style={styles.Credentials}>
                        <Text style={styles.leftText}>Email</Text>
                        <TextInput
                            style={styles.LabelField}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                        <Text style={styles.leftText}>Password</Text>
                        <TextInput
                            style={styles.LabelField}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>
                    <TouchableOpacity style={styles.LoginButton} onPress={handleAuthentication}>
                        <Text>Login</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const AuthenticatedScreen = ({ user, handleAuthentication }: AuthenticatedScreenProps) => {
    const router = useRouter();

    const navigateToScanner = () => {
        router.push('/scanner'); // Navigate to Scanner screen
    };

    return (
        <View style={styles.Screen}>
            <View style={styles.Header}>
                <Text style={styles.WelcomeText}>Welcome, {user?.email.split('@')[0]}!</Text>
            </View>

            <View style={styles.Body}>
                <TouchableOpacity style={styles.FooterText} onPress={navigateToScanner}>
                    <Text style={styles.TextFooter}>Scan QR Code</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.FooterText} onPress={() => console.log('Show Package')}>
                    <Text style={styles.TextFooter}>Show Packages</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.FooterText} onPress={() => console.log('Send Package')}>
                    <Text style={styles.TextFooter}>Send Package</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.Footer}>
                <TouchableOpacity style={styles.LoginButton} onPress={handleAuthentication}>
                    <Text style={styles.TextLogout}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function HomeScreen() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [user, setUser] = useState<any>(null);
    const [isLogin, setIsLogin] = useState<boolean>(true);

    const auth = getAuth(app);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, [auth]);

    const handleAuthentication = async () => {
        try {
            const auth = getAuth();
            if (user) {
                console.log('User logged out successfully!');
                await signOut(auth);
            } else {
                if (isLogin) {
                    await signInWithEmailAndPassword(auth, email, password);
                    console.log('User signed in successfully!');
                } else {
                    await createUserWithEmailAndPassword(auth, email, password);
                    console.log('User created successfully!');
                }
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            const e = error as Error;
            console.error('Authentication error:', e.message);
            showErrorAlert(e.message);
        }
    };

    return (
        <View style={styles.Screen}>
            {user ? (
                <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
            ) : (
                <AuthScreen
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                    handleAuthentication={handleAuthentication}
                />
            )}
        </View>
    );
}

const showErrorAlert = (errorMessage: string | string[]) => {
    let displayMessage;

    if (errorMessage.includes('auth/invalid-email')) {
        displayMessage = 'The email address is not valid. Please enter a valid email.';
    } else if (errorMessage.includes('auth/user-not-found')) {
        displayMessage = 'No user found with that email. Please sign up first.';
    } else if (errorMessage.includes('auth/wrong-password')) {
        displayMessage = 'Incorrect password. Please try again.';
    } else if (errorMessage.includes('auth/email-already-in-use')) {
        displayMessage = 'Email already used. Use a different email address.';
    } else {
        displayMessage = 'An unknown error occurred. Please try again later.';
    }

    Alert.alert('Authentication Failed', displayMessage, [{ text: 'OK' }], { cancelable: true });
};

const styles = StyleSheet.create({
    Screen: {
        height: '100%',
        width: '100%',
        backgroundColor: '#F9F6E6',
    },
    TextContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    TitleText: {
        fontSize: 33,
        fontWeight: 'bold',
        color: 'white',
        outline: 'black',
        textShadowColor: 'black',
        textShadowOffset: {width:1, height: 1},
        textShadowRadius: 4,
    },
    InfoText: {
        paddingTop: 30,
        fontSize: 18,
        textAlign: 'center',
    },
    LoginForm: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#8D77AB',
        width: '100%',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    Credentials: {
        width: wp('100%'),
        height: '60%',
        alignItems: 'center',
        marginTop: '5%',
        justifyContent: 'space-evenly',
    },
    LabelField: {
        fontSize: 35,
        backgroundColor: 'white',
        borderRadius: 30,
        width: '80%',
        textAlign: 'center',
        borderWidth: 2,
        margin: 15,
    },
    leftText:{
        color: '#FFF',
        left: '-25%',
    },
    ScreenAuthenticated: {
        height: '100%',
        width: '100%',
        backgroundColor: "#F9F6E6",
    },
    Header: {
        height: wp('25%'),
        backgroundColor: "#8D77AB",
        paddingTop: wp('11%'),
        alignItems: 'center',
        borderRadius: 20,
    },
    WelcomeText: {
        fontSize: wp('9%'),
        color: 'white',
        textShadowColor: 'black',
        textShadowOffset: {width:1, height: 1},
        textShadowRadius: 4,
    },
    Body: {
        flex: 3,
        justifyContent: 'space-evenly',
        marginTop: 30,
        width: '100%',
    },
    FooterText:{
        backgroundColor: '#6256CA',
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 12,
        width: wp('70%'),
        alignItems: 'center',
        alignSelf: 'center',
    },
    TextFooter:{
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    Footer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    LoginButton:{
        backgroundColor: '#E1EACD',
        paddingVertical: 12,
        paddingHorizontal: 20,
        fontWeight: 'bold',
        borderRadius: 10,
        alignItems: 'center',
    },
    TextLogout:{
        color: 'black',
        fontSize: 25,

    },
});

