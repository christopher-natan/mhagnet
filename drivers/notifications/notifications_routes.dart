import 'package:get/get.dart';
import 'package:kitakits/plugins/notifications/pages/notifications_page.dart';

class NotificationsRoutes {
  static const String notificationsPage = '/plugins/notificationsPage';
  static var getPage = GetPage(name: notificationsPage, page: () => NotificationsPage(), transition: Transition.leftToRight);
}
