import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';

import { Fontisto } from '@expo/vector-icons';
// expo init 하면서 알아서 생긴 라이브러리
// https://icons.expo.fyi/ 아이콘 미리보기 사이트

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const API_KEY = '31c486db6d8794366cf38e61e8c7c203';

const icons = {
  Clouds: 'cloudy',
  Clear: 'day-sunny',
  Atmosphere: '',
  Snow: 'snowflake',
  Rain: 'rains',
  Drizzle: 'rain',
  Thunderstorm: 'lightning',
};

export default function App() {
  const [city, setCity] = useState('Loading..');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);


  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].region);
    // 공짜 키라서 데일리 웨더가 불가능
    //const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}`);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    // const temp = Math.round((json.main.temp) * 100) / 100;
    const temp = parseFloat(json.main.temp).toFixed(1);
    const weather = json.weather[0].main;
    const description = json.weather[0].description;
    setDays([temp, weather, description]);
  };

  useEffect(() => {
    getWeather();
  }, []);
  
  return (
    // View는 div같은 콘테이너. 항상 import해야 한다.
    <View style={styles.container}>
      {/* View는 이미 flex 콘테이너임. 모바일의 direction 기본값은 column임 */}
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.forecast}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {
          days.length === 0 ?
            <View style={styles.loading}>
              <ActivityIndicator size={'large'} color='black' />
            </View>
            :
            <View style={styles.day}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: '85%' }}>
                <Text style={styles.temp}>{days[0]}</Text>
                <Fontisto name={icons[days[1]]} size={65} color="white" />
              </View>

              <Text style={styles.weather}>{days[1]}</Text>
              <Text style={styles.description}>{days[2]}</Text>
            </View>
        }
        {/* <View style={styles.day}>
          {
            days.length === 0
              ?
              'loading...'
              :
              <>
                <Text style={styles.temp}>{days[0]}</Text>
                <Text style={styles.description}>{days[1]}</Text>
              </>
          }
        </View> */}
        <View style={styles.loading}>
          <ActivityIndicator size={'large'} color='black' />
        </View>
        <View style={styles.loading}>
          <ActivityIndicator size={'large'} color='black' />
        </View>
        <View style={styles.loading}>
          <ActivityIndicator size={'large'} color='black' />
        </View>
      </ScrollView>
      <StatusBar style='auto'></StatusBar>
    </View>
  );
}

// 몇 웹의 style은 쓸 수 없다. 
// StyleSheet.create 자동완성이 꿀임
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange'
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cityName: {
    color: 'black',
    fontSize: 50,
    fontWeight: '600'
  },
  forecast: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'flex-start',
    marginLeft: SCREEN_WIDTH / 12,
    marginRight: -SCREEN_WIDTH / 12
  },
  temp: {
    color: 'teal',
    marginTop: 20,
    fontSize: 100,
  },
  weather: {
    color: 'white',
    fontSize: 40,
  },
  description: {
    color: 'black',
    marginTop: -10,
    fontSize: 20
  },
  loading: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    paddingTop: 100
  },
});
