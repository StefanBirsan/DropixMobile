import {StyleSheet, Text, View} from 'react-native';
import CustomButton1 from "@/components/customK/CustomButton1";

export default function MainScreen() {
    return (
        <View style={styles.Screen}>
            <View style={styles.Header}>
                <Text style={styles.WelcomeText}>Welcome, (user)!</Text>
            </View>

            <View style={styles.Body}>
                <CustomButton1 text={"Scan QR Code"} onPress={() => console.log('clicked')} style={{width:'70%',height:'20%'}}/>
                <CustomButton1 text={"Check Packages"} onPress={() => console.log('clicked')} style={{width:'70%',height:'20%'}}/>
            </View>

            <View style={styles.Footer}>
                <CustomButton1 text={"Log Out"} onPress={() => console.log('clicked')} style={{width:'50%',height:'30%'}}/>
            </View>
        </View>
    )
}
    const styles = StyleSheet.create({
        Screen: {
            height: '100%',
            backgroundColor: "#F9F6E6",
        },
        Header: {
            height: '10%',
            backgroundColor: "#8D77AB",
            paddingTop: 20,
            alignItems: 'center',
            borderBottomLeftRadius:15,
            borderBottomRightRadius:15,
        },
        WelcomeText: {
            fontSize: 30,
            color: 'white',
            textShadowColor: 'black',
            textShadowOffset: {width:1, height: 1},
            textShadowRadius: 4,
        },
        Body: {
            flex: 3,
            alignItems: "center",
            justifyContent: "space-evenly",
        },
        Footer: {
            flex: 1,
            height: '20%',
            alignItems: "center",
            justifyContent: "space-evenly",
        }
    });