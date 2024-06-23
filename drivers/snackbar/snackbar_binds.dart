import 'package:get/get.dart';
import 'package:kitakits/plugins/snackbar/services/snackbar_service.dart';
import 'package:kitakits/plugins/snackbar/snackbar_storage.dart';

class SnackbarBinds {
  SnackbarStorage snackbarStorage = SnackbarStorage();
  SnackbarService snackbarService = SnackbarService();

  SnackbarBinds() {
    Get.lazyPut(() => snackbarStorage, fenix: true);
    Get.lazyPut(() => snackbarService, fenix: true);
  }

  Future<void> getFind() async {
    snackbarStorage = Get.find();
    snackbarService = Get.find();
  }
}
