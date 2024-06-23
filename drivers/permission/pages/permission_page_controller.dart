import 'package:kitakits/plugins/permission/pages/permission_page_event.dart';

class PermissionPageController extends PermissionPageEvent {
  final String idPermission = 'idPermission';

  PermissionPageController() {
    setInit(this);
  }

  Future<void> rebuild() async => update([idPermission]);

  @override
  Future<void> onClose() async {
    super.onClose();
  }
}
