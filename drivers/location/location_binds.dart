import 'package:get/get.dart';
import 'package:kitakits/plugins/location/location_storage.dart';
import 'package:kitakits/plugins/location/services/location_service.dart';

class LocationBinds {
  LocationService locationService = LocationService();
  LocationStorage locationStorage = LocationStorage();

  LocationBinds() {
    Get.lazyPut(() => locationService, fenix: true);
    Get.lazyPut(() => locationStorage, fenix: true);
  }

  Future<void> getFind() async {
    locationService = Get.find();
    locationStorage = Get.find();
  }
}
