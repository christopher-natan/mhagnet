import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:kitakits/plugins/location/location_storage.dart';
import 'package:kitakits/plugins/location/services/location_service.dart';
import 'package:kitakits/plugins/network/services/network_service.dart';
import 'package:kitakits/plugins/plugins.dart';
import 'package:kitakits/services/collection/collection_service.dart';

class Location<T> extends Plugins {
  final RxString onDisabled = ''.obs;
  final RxString onDenied = ''.obs;
  final RxString onDeniedForever = ''.obs;
  final RxString onPositionSet = ''.obs;
  final RxString onPositionChanged = ''.obs;
  final RxString onPositionStopped = ''.obs;
  final RxString onLocationChanged = ''.obs;
  final RxString onStatusChanged = ''.obs;

  late GetStorage storage = GetStorage();
  late LocationService locationService = Get.find();
  late LocationStorage locationStorage = Get.find();
  late CollectionService collectionService = Get.find();
  late NetworkService networkService = Get.find();
}
