import "react-native-gesture-handler";
import FlashMessage from "react-native-flash-message";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import BottomBar from "../components/BottomBar";
import TopBar from "../components/TopBar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import Dashboard from "../screens/Dashboard";
import Market from "../screens/Market";
import Holdings from "../screens/Holdings";
import Settings from "../screens/Settings";
import { globalColorsLight } from "../styles/global";
import { rgbToHex } from "../utils/utils";

changeNavigationBarColor(rgbToHex(globalColorsLight.mainThird), true);

const Stack = createStackNavigator();

const horizontalAnimation = {
	gestureDirection:"horizontal",
	cardStyleInterpolator: ({ current, layouts }) => {
		return {
			cardStyle: {
				transform: [{
					translateX:current.progress.interpolate({
						inputRange:[0, 1],
						outputRange:[layouts.screen.width, 0],
					}),
				}],
			}
		};
	},
};

function navigate(name, params) {
	navigationRef.current?.navigate(name, params);
}

export default function App() {
	const navigationRef = React.createRef();
	const routeNameRef = React.createRef();

	const [active, setActive] = React.useState("Login");

	return (
		<NavigationContainer ref={navigationRef} onStateChange={() => checkState()} onReady={() =>
			(routeNameRef.current = navigationRef.current.getCurrentRoute().name)}>
			{ active !== "Login" && 
				<TopBar title={active}></TopBar>
			}
			<Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown:false }}>
				<Stack.Screen name="Login" component={Login}></Stack.Screen>
				<Stack.Screen name="Dashboard" component={Dashboard} options={horizontalAnimation}></Stack.Screen>	
				<Stack.Screen name="Market" component={Market} options={horizontalAnimation}></Stack.Screen>	
				<Stack.Screen name="Holdings" component={Holdings} options={horizontalAnimation}></Stack.Screen>	
				<Stack.Screen name="Settings" component={Settings} options={horizontalAnimation}></Stack.Screen>	
			</Stack.Navigator>
			{ active !== "Login" && 
				<BottomBar navigation={navigationRef} screen={{ active:active, setActive:setActive }}></BottomBar>
			}
			<FlashMessage position="top" hideStatusBar={true}/>
			<StatusBar style="dark"/>
		</NavigationContainer>
	);

	function checkState() {
		let currentRouteName = navigationRef.current.getCurrentRoute().name;

		setActive(currentRouteName);
	}
}