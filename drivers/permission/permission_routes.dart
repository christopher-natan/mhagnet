import 'package:get/get.dart';
import 'package:kitakits/plugins/permission/pages/permission_page.dart';

class PermissionRoutes {
  static const String permissionPage = '/plugins/permissionPage';
  static var getPage = GetPage(name: permissionPage, page: () => PermissionPage(), transition: Transition.leftToRight);
}
