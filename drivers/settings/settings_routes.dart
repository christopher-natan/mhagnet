import 'package:get/get.dart';
import 'package:kitakits/plugins/settings/pages/settings_page.dart';

class SettingsRoutes {
  static const String settingsPage = '/plugins/settingsPage';
  static var getPage = GetPage(name: settingsPage, page: () => SettingsPage(), transition: Transition.leftToRight);
}
