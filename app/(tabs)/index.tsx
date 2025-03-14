import {StyleSheet, Text, TextInput, View} from 'react-native';
import CustomButton1 from "@/components/customK/CustomButton1";
import {useFonts} from "expo-font";

export default function HomeScreen() {

    let[fontsLoaded] = useFonts({
        'JetBrainsMono-Medium' : require('@/assets/fonts/JetBrainsMono-Medium.ttf'),
    })

  return (
    <View style={styles.Screen}>
        <View style={styles.TextContainer}>
            <Text style={styles.TitleText}>
                Welcome to DropX
            </Text>
            <Text style={styles.InfoText}>
                Interactive courier app, please log in with your given credentials in order to continue.
            </Text>
        </View>

        <View style={styles.LoginForm}>

            <View style={styles.Credentials}>
                <TextInput placeholder="Username" style={styles.LabelField}/>
                <TextInput placeholder="Password" secureTextEntry={true} style={styles.LabelField}/>
            </View>

            <CustomButton1 text={"Log In"} onPress={() => console.log('clicked')} style={{width:'50%',height:'15%',marginTop:'10%'}}/>

        </View>
    </View>
  );
}

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
        width: '100%',
        height: '60%',
        alignItems: 'center',
        marginTop: '5%',
        justifyContent: 'space-evenly',
    },
    LabelField: {
        fontSize: 18,
        backgroundColor: 'white',
        borderRadius: 30,
        width: '70%',
        textAlign: 'center',
        borderWidth: 1,
    },

});
