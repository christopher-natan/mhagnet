import 'package:get/get.dart';
import 'package:kitakits/plugins/permission/pages/permission_page_controller.dart';
import 'package:kitakits/plugins/permission/permission_storage.dart';

class PermissionBinds {
  PermissionPageController permissionPageController = PermissionPageController();
  PermissionStorage permissionStorage = PermissionStorage();

  PermissionBinds() {
    Get.lazyPut(() => permissionPageController, fenix: true);
    Get.lazyPut(() => permissionStorage, fenix: true);
  }

  Future<void> getFind() async {
    permissionPageController = Get.find();
    permissionStorage = Get.find();
  }
}
