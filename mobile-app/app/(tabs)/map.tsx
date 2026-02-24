import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Text, Image, SafeAreaView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const customMapStyle = [
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

interface MarkerData {
    id: string;
    coordinate: {
        latitude: number;
        longitude: number;
    };
    title: string;
    description: string;
    type: 'lost' | 'found';
    image: string;
}

const EXAMPLE_MARKERS: MarkerData[] = [
    {
        id: '1',
        coordinate: { latitude: 50.4571, longitude: 30.5134 },
        title: 'Parrot',
        description: 'Lost parrot',
        type: 'lost',
        image: 'https://images.unsplash.com/photo-1552728089-57168a151b75?q=80&w=200&auto=format&fit=crop', // Temporary placeholder
    },
    {
        id: '2',
        coordinate: { latitude: 50.4501, longitude: 30.5234 },
        title: 'Golden Retriever',
        description: 'Lost dog',
        type: 'lost',
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=200&auto=format&fit=crop',
    },
    {
        id: '3',
        coordinate: { latitude: 50.4435, longitude: 30.5368 },
        title: 'Tabby Cat',
        description: 'Found cat',
        type: 'found',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&auto=format&fit=crop',
    },
];

const INITIAL_REGION = {
    latitude: 50.4501,
    longitude: 30.5234,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
};

export default function MapScreen() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                customMapStyle={customMapStyle}
                initialRegion={INITIAL_REGION}
                showsBuildings={false}
                showsTraffic={false}
                showsPointsOfInterest={false}
                showsIndoors={false}
                toolbarEnabled={false}
            >
                {/* User Location Indicator mock */}
                <Marker
                    coordinate={{ latitude: 50.4461, longitude: 30.5264 }}
                    anchor={{ x: 0.5, y: 0.5 }}
                >
                    <View style={styles.userLocationOuter}>
                        <View style={styles.userLocationInner} />
                    </View>
                </Marker>

                {EXAMPLE_MARKERS.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={marker.coordinate}
                        title={marker.title}
                        description={marker.description}
                        anchor={{ x: 0.5, y: 1 }}
                    >
                        <View style={styles.markerContainer}>
                            <View style={[
                                styles.markerPin,
                                { backgroundColor: marker.type === 'lost' ? '#ff4b4b' : '#34c759' }
                            ]}>
                                <Image
                                    source={{ uri: marker.image }}
                                    style={styles.markerImage}
                                />
                            </View>
                            <View style={[
                                styles.markerTriangle,
                                { borderTopColor: marker.type === 'lost' ? '#ff4b4b' : '#34c759' }
                            ]} />
                        </View>
                    </Marker>
                ))}
            </MapView>

            {/* Top Overlay */}
            <SafeAreaView style={styles.topOverlayContainer} pointerEvents="box-none">
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#8e8e93" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search area..."
                        placeholderTextColor="#8e8e93"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity>
                        <Ionicons name="mic-outline" size={20} color="#8e8e93" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContainer}
                >
                    <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
                        <Ionicons name="options-outline" size={16} color="#000" style={styles.filterIcon} />
                        <Text style={styles.filterTextActive}>Filters</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.filterChip}>
                        <Text style={styles.filterText}>Lost</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.filterChip}>
                        <Text style={styles.filterText}>Found</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.filterChip}>
                        <Text style={styles.filterText}>Species</Text>
                        <Ionicons name="chevron-down" size={14} color="#000" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>

            {/* Bottom Right Floating Buttons */}
            <View style={styles.floatingButtonsContainer} pointerEvents="box-none">
                <TouchableOpacity style={styles.floatingButton}>
                    <MaterialIcons name="my-location" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.floatingButton}>
                    <MaterialIcons name="layers" size={24} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2efe9',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    topOverlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        padding: 0, // Remove default Android padding
    },
    filtersContainer: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        gap: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    filterChipActive: {
        backgroundColor: '#f4c753', // Yellow from the design
    },
    filterIcon: {
        marginRight: 4,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
    },
    filterTextActive: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    floatingButtonsContainer: {
        position: 'absolute',
        bottom: 24, // Keep it above a potential bottom tab bar
        right: 16,
        gap: 12,
    },
    floatingButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },

    // Marker Styles
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 54, // Adjusted for triangle
    },
    markerPin: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    markerImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    markerTriangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 0,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        marginTop: 0,
    },

    // User Location Indicator
    userLocationOuter: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(66, 133, 244, 0.2)', // Light blue transparent
        alignItems: 'center',
        justifyContent: 'center',
    },
    userLocationInner: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4285F4', // Google blue
        borderWidth: 2,
        borderColor: '#ffffff',
    },
});
