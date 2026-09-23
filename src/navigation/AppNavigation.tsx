import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppStackParamList } from "../types/navigation";
import { Inputs } from "../screens/Inputs";
//import { ExampleScreen } from "../screens/Inputs";
import { Movements } from "../screens/Movements";
import { Goals } from "../screens/Goals";
import { CreatePerfil } from "../screens/CreatePerfil";
import { Resume } from "../screens/Resume";
import { NavigationContainer } from "@react-navigation/native";
import { LoginScreen } from "../screens/Login";

const Stack= createNativeStackNavigator <AppStackParamList>();

export function AppNavigation(){
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions ={{headerShown: false}}>
                 <Stack.Screen
                name= "Login"
                component={LoginScreen}
                />
                 <Stack.Screen
                name= "CreatePerfil"
                component={CreatePerfil}
                />
                <Stack.Screen
                name= "Inputs"
                component={Inputs}
                //component={MensajeBotton}
                />
               <Stack.Screen
                name= "Resume"
                component={Resume}
                />               
                <Stack.Screen
                name= "Goals"
                component={Goals}
                />
                <Stack.Screen
                name= "Movements"
                component={Movements}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

