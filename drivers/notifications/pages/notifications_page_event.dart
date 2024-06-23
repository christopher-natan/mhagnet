import 'package:kitakits/plugins/notifications/notifications.dart';
import 'package:kitakits/plugins/notifications/pages/notifications_page_controller.dart';

class NotificationsPageEvent extends Notifications {
  late NotificationsPageController _controller;
  String name = '::NotificationsPageEvent';

  Future<void> setInit(NotificationsPageController controller) async {
    _controller = controller;
    setPluginName(name);
  }

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();
    await _withNotificationsModel();

  }

  Future<void> _withNotificationsModel() async {
    await on(notificationsModel.onDeleted, () async {
      pr(name, 'notificationsModel.onDeleted');
      await _controller.rebuild();
    });

    await on(notificationsModel.onUpdated, () async {
      pr(name, 'notificationsModel.onUpdated');
      await _controller.rebuild();
    });
  }

  Future<void> onPressedDelete(String notificationId) async {
    notificationsModel.notificationIdToDelete = notificationId;
    await set(dialogService.onDeleteNotification);
  }
}
