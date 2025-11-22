import React, {useEffect, useRef} from "react";
import {View, StyleSheet, Animated, Image} from "react-native";

export default function SplashScreen({navigation}) {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(()=>{
    Animated.timing(fade, { toValue:1, duration:1400, useNativeDriver:true }).start();
    const t = setTimeout(()=> navigation.replace("Start"), 2200);
    return ()=> clearTimeout(t);
  },[]);

  return (
    <View style={styles.container}>
      <Animated.View style={{opacity:fade}}>
        <Image source={require("../../assets/images/logo_fly.png")} style={styles.logo}/>
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:"#4B2FB3",justifyContent:"center",alignItems:"center"},
  logo:{width:150,height:150, resizeMode:"contain"}
});
