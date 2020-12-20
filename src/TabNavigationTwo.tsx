import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  LayoutChangeEvent,
  LayoutRectangle,
  Animated,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const TabItem = (props: {
  children?: React.ReactNode;
  index: number;
  activeIndex: number;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View>
        {React.cloneElement(props.children as React.ReactElement<any>, {
          isActive: props.index === props.activeIndex,
        })}
      </View>
    </TouchableOpacity>
  );
};

interface ITabBar {
  menus?: {component: React.ReactNode}[];
}

const FloatingView = (props: {style: any}) => {
  return (
    <Animated.View
      style={{
        ...{
          backgroundColor: '#FF6100',
          position: 'absolute',
          zIndex: 0,
        },
        ...props.style,
      }}
    />
  );
};

const TabBar: React.SFC<ITabBar> = (props) => {
  const [tabActive, setTabActive] = useState(0);
  const [dimension, setDimension] = useState<LayoutRectangle | null>(null);
  const leftPosition = useState(new Animated.Value(0))[0];

  const onLayout = (e: LayoutChangeEvent) => {
    setDimension(e.nativeEvent.layout);
  };

  const moveFLoatingView = () => {
    if (!dimension || !props.menus) return;
    Animated.timing(leftPosition, {
      toValue: (dimension?.width / props.menus?.length) * tabActive,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    moveFLoatingView();
  }, [tabActive]);

  console.log('leftPosition', leftPosition);

  return (
    <View
      style={{
        borderRadius: wp(10),
        margin: wp(5),
        height: wp(10),
        display: 'flex',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        backgroundColor: 'white',
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      }}
      onLayout={onLayout}>
      {props.menus && dimension && (
        <FloatingView
          style={{
            height: dimension.height,
            borderRadius: wp(50),
            width: dimension.width / props.menus.length,
            transform: [{translateX: leftPosition}],
          }}
        />
      )}
      {props.menus?.map((item, index) => {
        return (
          <TabItem
            onPress={() => {
              setTabActive(index);
            }}
            key={index.toString()}
            index={index}
            activeIndex={tabActive}>
            {item.component}
          </TabItem>
        );
      })}
    </View>
  );
};

const ButtonIcon = (props: {
  source: ImageSourcePropType;
  isActive?: boolean;
}) => {
  return (
    <Image
      source={props.source}
      style={{
        width: wp(5),
        height: wp(5),
        tintColor: props.isActive ? 'white' : 'gray',
      }}
    />
  );
};

const TabNavigationOne = () => {
  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <TabBar
        menus={[
          {
            component: (
              <ButtonIcon source={require('../assets/Images/home.png')} />
            ),
          },
          {
            component: (
              <ButtonIcon source={require('../assets/Images/heart.png')} />
            ),
          },
          {
            component: (
              <ButtonIcon source={require('../assets/Images/search.png')} />
            ),
          },
          {
            component: (
              <ButtonIcon source={require('../assets/Images/user.png')} />
            ),
          },
        ]}></TabBar>
    </SafeAreaView>
  );
};

export default TabNavigationOne;
