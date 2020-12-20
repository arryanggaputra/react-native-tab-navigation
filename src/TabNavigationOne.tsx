import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  ImageSourcePropType,
  Text,
  Alert,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

interface IMenuItem {
  backgroundColor: string;
  tintColor: string;
  icon: ImageSourcePropType;
  label: string;
}
type IOnChangeMenu = {index: number} & IMenuItem;

interface ITabBar {
  defaultIndex?: number;
  onChange: (menuData: IOnChangeMenu) => void;
  menus?: IMenuItem[];
}

interface ITabButton {
  icon: ImageSourcePropType;
  label: string;
  isActive?: boolean;
  tintColorValues?: any;
  opacityValues?: any;
  translateValues?: any;
}

const TabButton: React.SFC<ITabButton> = (props) => {
  return (
    <View
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
      }}>
      <Animated.Image
        source={props.icon}
        style={{
          width: wp(5),
          height: wp(5),
          tintColor: props.tintColorValues,
        }}
      />
      <Animated.View
        style={{
          width: props.isActive ? 'auto' : '0%',
          transform: [
            {
              translateX: props.translateValues,
            },
          ],
          opacity: props.opacityValues,
        }}>
        <Animated.Text style={{color: props.tintColorValues}}>
          {props.label}
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const TabBar: React.SFC<ITabBar> = React.memo((props) => {
  const [tabActive, setTabActive] = useState(props.defaultIndex || 0);
  const [prevTabActive, setPrevTabActive] = useState<undefined | number>(
    undefined,
  );
  const isFirstRun = useRef(true);
  const [animatedValues, setAnimatedValues] = useState<Animated.Value[]>([]);

  useEffect(() => {
    let _animatedValues = [...animatedValues];
    props.menus?.map((item, index) => {
      _animatedValues[index] = new Animated.Value(tabActive === index ? 4 : 2);
    });
    setAnimatedValues(_animatedValues);
  }, []);

  const startAnimation = (index: number, value: number) => {
    Animated.timing(animatedValues[index], {
      toValue: value,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (props.menus) {
      onTabPress(tabActive, props.menus[tabActive]);
    }
    if (animatedValues.length === props.menus?.length) {
      startAnimation(tabActive, 4);
    }
  }, [tabActive]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    startAnimation(prevTabActive || 0, 2);
  }, [prevTabActive]);

  const onTabPress = (index: number, item: IMenuItem) => {
    props.onChange({...{index: index}, ...item});
  };

  return (
    <View
      style={{
        height: wp(20),
        shadowColor: '#000',
        backgroundColor: 'white',
      }}>
      <View
        style={{
          margin: wp(5),
          borderRadius: wp(10),
          overflow: 'hidden',
          flexDirection: 'row',
          backgroundColor: 'white',
          flex: 1,
        }}>
        {animatedValues.length > 0 &&
          props.menus?.map((item, index) => {
            const tintColorValues = animatedValues[index].interpolate({
              inputRange: [2, 4],
              outputRange: ['black', item.tintColor],
            });

            const bgColorValues = animatedValues[index].interpolate({
              inputRange: [2, 4],
              outputRange: ['white', item.backgroundColor],
            });

            const opacityValues = animatedValues[index].interpolate({
              inputRange: [2, 4],
              outputRange: [0, 1],
            });

            const translateValues = animatedValues[index].interpolate({
              inputRange: [2, 4],
              outputRange: [50, wp(2)],
            });

            let buttonProps: ITabButton = {
              label: item.label,
              icon: item.icon,
              isActive: tabActive === index,
              tintColorValues,
              opacityValues,
              translateValues,
            };

            return (
              <Animated.View
                key={index.toString()}
                style={{
                  borderRadius: wp(10),
                  flex: animatedValues[index],
                  backgroundColor: bgColorValues,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (tabActive === index) return;
                    setTabActive((prevState) => {
                      setPrevTabActive(prevState);
                      return index;
                    });
                  }}
                  style={{flex: 1}}>
                  <TabButton {...buttonProps}></TabButton>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
      </View>
    </View>
  );
});

const TabNavigationOne = () => {
  const [bgColor, setBgColor] = useState('');
  const [tabIndex, setTabIndex] = useState(0);

  const onChange = (data: IOnChangeMenu) => {
    setBgColor(data.tintColor);
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: bgColor}}></View>
      <TabBar
        onChange={onChange}
        defaultIndex={tabIndex}
        menus={[
          {
            backgroundColor: 'rgb(223,215,243)',
            tintColor: 'rgb(91,55,183)',
            icon: require('../assets/Images/home.png'),
            label: 'Home',
          },
          {
            backgroundColor: 'rgb(247, 215, 239)',
            tintColor: 'rgb(183, 56, 146)',
            icon: require('../assets/Images/heart.png'),
            label: 'Likes',
          },
          {
            backgroundColor: '#rgb(251,239,211)',
            tintColor: 'rgb(230,169,26)',
            icon: require('../assets/Images/search.png'),
            label: 'Discover',
          },
          {
            backgroundColor: 'rgb(208,235,239)',
            tintColor: 'rgb(17,147,170)',
            icon: require('../assets/Images/user.png'),
            label: 'Profile',
          },
        ]}></TabBar>
    </SafeAreaView>
  );
};

export default TabNavigationOne;
