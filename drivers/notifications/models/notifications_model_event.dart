import 'package:get/get.dart';
import 'package:kitakits/plugins/notifications/models/notifications_model.dart';
import 'package:kitakits/plugins/notifications/notifications.dart' as plugin;

class NotificationsEvent extends plugin.Notifications {
  late NotificationsModel _model;
  final RxString onUpdated = ''.obs;
  final RxString onDeleted = ''.obs;
  String notificationIdToDelete = '';
  String name = '::NotificationsEvent';

  Future<void> setInit(NotificationsModel model) async {
    _model = model;
    setPluginName(name);
  }

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();
    await _withDialogWidgetService();
    await _withGmapController();
  }

  Future<void> _withDialogWidgetService() async {
    await on(dialogService.onDeleteNotificationConfirmed, () async {
      pr(name, 'dialogService.onNotificationConfirmed');
      await _model.delete();
    });
  }

  Future<void> _withGmapController() async {
    await on(gmapController.onMapCreated, () async {
      pr(name, 'gmapController.onMapCreated');
      await _model.setData();
    });
  }
}
