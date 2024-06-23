import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:kitakits/plugins/dialog/services/dialog_service.dart';
import 'package:kitakits/plugins/error/services/error_service.dart';
import 'package:kitakits/plugins/location/services/location_service.dart';
import 'package:kitakits/plugins/network/services/network_service.dart';
import 'package:kitakits/plugins/permission/permission_storage.dart';
import 'package:kitakits/plugins/plugins.dart';
import 'package:kitakits/plugins/spinner/services/spinner_service.dart';

class Permission<T> extends Plugins {
  final GetStorage storage = GetStorage();
  late PermissionStorage permissionStorage = Get.find();
  late SpinnerService spinnerWidgetService = Get.find();
  late NetworkService networkService = Get.find();
  late DialogService dialogService = Get.find();
  late LocationService locationService = Get.find();
  late ErrorService errorService = Get.find();
}
