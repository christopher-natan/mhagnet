import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:geolocator/geolocator.dart';
import 'package:kitakits/plugins/location/services/location_service_event.dart';

class LocationService extends LocationServiceEvent {
  LocationService() {
    setInit(this);
    startListenStatus();
  }

  Future<dynamic> setUserPosition() async {
    await checkPermissionStatus();
    if (isGranted) {
      await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.bestForNavigation, forceAndroidLocationManager: true).then((position) {
        currentPosition = position;
        set(onPositionSet);
      });
    }
  }

  Future checkPermissionStatus() async {
    bool isServiceEnabled = await Geolocator.isLocationServiceEnabled();
    LocationPermission permission = await Geolocator.checkPermission();
    if (!isServiceEnabled) return await set(onDisabled);

    isGranted = false;
    if (permission == LocationPermission.denied) return await set(onDenied);
    if (permission == LocationPermission.deniedForever) return await set(onDeniedForever);
    isGranted = true;
  }

  Future askPermission() async {
    bool isServiceEnabled;
    bool isGranted = false;
    LocationPermission permission;
    isServiceEnabled = await Geolocator.isLocationServiceEnabled();
    permission = await Geolocator.checkPermission();

    if (!isServiceEnabled) {
      return isGranted;
    }

    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return isGranted;
      }
    }
    if (permission == LocationPermission.deniedForever) {
      return isGranted;
    }
    return isGranted = true;
  }

  Future<dynamic> startListenPosition() async {
    subscribePosition = Geolocator.getPositionStream(locationSettings: _getSettings()).listen((position) async {
      currentPosition = position;
      await set(onPositionChanged);
    });
  }

  Future<dynamic> startListenLocation() async {
    subscribeLocation = Geolocator.getPositionStream(locationSettings: _getSettings()).listen((position) async {
      currentPosition = position;
      await set(onLocationChanged);
    });
  }

  Future<void> stopListenPosition() async {
    if (subscribePosition != null) {
      await subscribePosition!.cancel();
      await set(onPositionStopped);
    }
  }

  Future<void> stopListenLocation() async {
    if (subscribeLocation != null) {
      await subscribeLocation!.cancel();
    }
  }

  Future<dynamic> startListenStatus() async {
    subscribeStatus = Geolocator.getServiceStatusStream().listen((ServiceStatus status) async {
      currentStatus = status;
      await set(onStatusChanged);
    });
  }

  Future<void> stopListenStatus() async {
    subscribeStatus?.cancel();
  }

  LocationSettings _getSettings() {
    LocationSettings settings;
    if (defaultTargetPlatform == TargetPlatform.android) {
      settings = AndroidSettings(
          accuracy: LocationAccuracy.high,
          distanceFilter: 5,
          forceLocationManager: true,
          foregroundNotificationConfig: const ForegroundNotificationConfig(
            notificationText: "",
            notificationTitle: "",
            enableWakeLock: true,
          ));
    } else if (defaultTargetPlatform == TargetPlatform.iOS || defaultTargetPlatform == TargetPlatform.macOS) {
      settings = AppleSettings(
        accuracy: LocationAccuracy.high,
        activityType: ActivityType.fitness,
        distanceFilter: 100,
        pauseLocationUpdatesAutomatically: true,
        showBackgroundLocationIndicator: false,
      );
    } else {
      settings = const LocationSettings(accuracy: LocationAccuracy.high, distanceFilter: 100);
    }
    return settings;
  }

  @override
  void onClose() {}
}
