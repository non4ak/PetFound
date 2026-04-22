import React from 'react';
import { Image, View } from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  type MapStyleElement,
  type Region,
} from 'react-native-maps';
import { cssInterop } from 'nativewind';

cssInterop(MapView, {
  className: 'style',
});

interface MarkerData {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  description: string;
  id: string;
  image: string;
  title: string;
  type: 'found' | 'lost';
}

const CUSTOM_MAP_STYLE: MapStyleElement[] = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#f2efe9' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#b0aaa0' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#f2efe9' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#c9c3b8' }],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative.neighborhood',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#dcd8d2' }],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{ visibility: 'simplified' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#dcd8d2' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#d4d0c9' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#c9c3b8' }],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [{ color: '#e8e4dd' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#d4e4ed' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9eb8cc' }],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry',
    stylers: [{ color: '#eceae4' }],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#e8e5de' }],
  },
];

const EXAMPLE_MARKERS: readonly MarkerData[] = [
  {
    coordinate: { latitude: 50.4571, longitude: 30.5134 },
    description: 'Lost parrot',
    id: '1',
    image:
      'https://images.unsplash.com/photo-1552728089-57168a151b75?q=80&w=200&auto=format&fit=crop',
    title: 'Parrot',
    type: 'lost',
  },
  {
    coordinate: { latitude: 50.4501, longitude: 30.5234 },
    description: 'Lost dog',
    id: '2',
    image:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=200&auto=format&fit=crop',
    title: 'Golden Retriever',
    type: 'lost',
  },
  {
    coordinate: { latitude: 50.4435, longitude: 30.5368 },
    description: 'Found cat',
    id: '3',
    image:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&auto=format&fit=crop',
    title: 'Tabby Cat',
    type: 'found',
  },
];

const INITIAL_REGION: Region = {
  latitude: 50.4501,
  latitudeDelta: 0.04,
  longitude: 30.5234,
  longitudeDelta: 0.04,
};

function getMarkerBackgroundColor(type: MarkerData['type']): string {
  return type === 'lost' ? '#ff4b4b' : '#34c759';
}

export function LostPetMap() {
  return (
    <MapView
      className="flex-1"
      customMapStyle={CUSTOM_MAP_STYLE}
      initialRegion={INITIAL_REGION}
      provider={PROVIDER_GOOGLE}
      showsBuildings={false}
      showsIndoors={false}
      showsPointsOfInterest={false}
      showsTraffic={false}
      toolbarEnabled={false}
    >
      <Marker
        anchor={{ x: 0.5, y: 0.5 }}
        coordinate={{ latitude: 50.4461, longitude: 30.5264 }}
      >
        <View className="h-10 w-10 items-center justify-center rounded-full bg-[#4285F433]">
          <View className="h-3.5 w-3.5 rounded-full border-2 border-white bg-[#4285F4]" />
        </View>
      </Marker>

      {EXAMPLE_MARKERS.map((marker: MarkerData) => {
        const markerBackgroundColor: string = getMarkerBackgroundColor(marker.type);

        return (
          <Marker
            key={marker.id}
            anchor={{ x: 0.5, y: 1 }}
            coordinate={marker.coordinate}
            description={marker.description}
            title={marker.title}
          >
            <View className="h-[54px] w-11 items-center justify-center">
              <View
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{
                  backgroundColor: markerBackgroundColor,
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                }}
              >
                <Image
                  className="h-9 w-9 rounded-full"
                  source={{ uri: marker.image }}
                />
              </View>
              <View
                className="mt-0 h-0 w-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent"
                style={{
                  borderTopColor: markerBackgroundColor,
                }}
              />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}
