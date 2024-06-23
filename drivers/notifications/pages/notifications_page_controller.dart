import 'package:kitakits/plugins/notifications/pages/notifications_page_event.dart';

class NotificationsPageController extends NotificationsPageEvent {
  final String idNotifications = 'idNotifications';

  NotificationsPageController() {
    setInit(this);
  }

  @override
  Future<void> onReady() async {}
  Future<void> rebuild() async => update([idNotifications]);
}
