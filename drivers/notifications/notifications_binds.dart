import 'package:get/get.dart';
import 'package:kitakits/plugins/notifications/models/notifications_model.dart';
import 'package:kitakits/plugins/notifications/notifications_storage.dart';
import 'package:kitakits/plugins/notifications/pages/notifications_page_controller.dart';
import 'package:kitakits/plugins/notifications/services/notifications_service.dart';

class NotificationsBinds {
  NotificationsPageController notificationsPageController = NotificationsPageController();
  NotificationsService notificationsService = NotificationsService();
  NotificationsStorage notificationsStorage = NotificationsStorage();
  NotificationsModel notificationsModel = NotificationsModel();

  NotificationsBinds() {
    Get.lazyPut(() => notificationsService, fenix: true);
    Get.lazyPut(() => notificationsPageController, fenix: true);
    Get.lazyPut(() => notificationsStorage, fenix: true);
    Get.lazyPut(() => notificationsModel, fenix: true);
  }

  Future<void> getFind() async {
    notificationsPageController = Get.find();
    notificationsService = Get.find();
    notificationsStorage = Get.find();
    notificationsModel = Get.find();
  }
}
