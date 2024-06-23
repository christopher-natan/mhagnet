import 'dart:async';

import 'package:geolocator/geolocator.dart';
import 'package:kitakits/plugins/location/location.dart' as plugin;
import 'package:kitakits/plugins/location/services/location_service.dart';
import 'package:kitakits/utils/map_util.dart';

class LocationServiceEvent extends plugin.Location {
  late LocationService _service;

  StreamSubscription<Position>? subscribeLocation;
  StreamSubscription<Position>? subscribePosition;
  StreamSubscription<ServiceStatus>? subscribeStatus;
  Position currentPosition = MapUtil.toPosition();
  ServiceStatus currentStatus = ServiceStatus.enabled;
  bool isGranted = false;
  String name = '::LocationServiceEvent';

  Future<void> setInit(LocationService service) async {
    _service = service;
    await setPluginName(name);
  }

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();
    await _withNetworkService();
    await _withCollectionService();
  }

  Future<void> _withCollectionService() async {
    await on(collectionService.onSet, () async {
      pr(name, 'collectionService.onSet');
      await _service.checkPermissionStatus();
      if (isGranted) {
        await networkService.checkConnectivity();
      }
    });
  }

  Future<void> _withNetworkService() async {
    await on(networkService.onNetworkConnected, () async {
      pr(name, 'networkService.onNetworkConnected');
      await _service.setUserPosition();
    });
  }
}
