import 'package:awesome_notifications/awesome_notifications.dart';
import 'package:get/get.dart';
import 'package:kitakits/apps.dart';
import 'package:kitakits/plugins/dialog/dialog_storage.dart';
import 'package:kitakits/plugins/notifications/notifications.dart' as plugin;
import 'package:kitakits/plugins/notifications/notifications_routes.dart';
import 'package:kitakits/plugins/notifications/services/notifications_service.dart';
import 'package:kitakits/storages.dart';

class NotificationsServiceEvent extends plugin.Notifications {
  late NotificationsService _service;
  String name = '::NotificationsServiceEvent';

  Future<void> setInit(NotificationsService service) async {
    _service = service;
    setPluginName(name);
  }

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();
    await _withJoinsModel();
    await _withUsersModel();
    await _withGmapController();
    await _withFriendsModel();
  }

  /// Use this method to detect when a new notification or a schedule is created
  @pragma("vm:entry-point")
  static Future<void> onNotificationCreatedMethod(ReceivedNotification receivedNotification) async {}

  /// Use this method to detect every time that a new notification is displayed
  @pragma("vm:entry-point")
  static Future<void> onNotificationDisplayedMethod(ReceivedNotification receivedNotification) async {}

  /// Use this method to detect if the user dismissed a notification
  @pragma("vm:entry-point")
  static Future<void> onDismissActionReceivedMethod(ReceivedAction receivedAction) async {}

  /// Use this method to detect when the user taps on a notification or action button
  @pragma("vm:entry-point")
  static Future<void> onActionReceivedMethod(ReceivedAction receivedAction) async {
    Get.toNamed(NotificationsRoutes.notificationsPage);
  }

  Future<void> _withGmapController() async {
    await on(gmapController.onMapReady, () async {
      if (storage.read(DialogStorage.firstTimeUserWithDialog) == null) {
        pr(name, 'gmapController.onMapReady');
        await _service.notifyWelcome();
      }
      if (_isNotEnable()) return false;
      if (Apps.isUpdate) await _service.notifyUpgrade();
    }, priority: 10);
  }

  Future<void> _withUsersModel() async {
    await on(usersModel.onRenewal, () async {
      pr(name, 'usersModel.onRenewal');
      if (_isNotEnable()) return false;
      await _service.notifyAddedCredits();
    });
  }

  Future<void> _withFriendsModel() async {
   await on(friendsModel.onFound, () async {
      if(usersModel.data.userId == joinsModel.data.userId) return false;
      pr(name, 'friendsModel.onFound');
      if (_isNotEnable()) return false;
      await _service.notifyUserJoined();
    });
    await on(friendsModel.onLeftEvent, () async {
      pr(name, 'friendsModel.onLeftEvent');
      await _service.notifyFriendLeft();
    });
  }

  Future<void> _withJoinsModel() async {
    await on(joinsModel.onActivated, () async {
      pr(name, 'joinsModel.onActivated');
      if (_isNotEnable()) return false;
      await _service.notifyEventCreated();
    });
  }

  bool _isNotEnable() => !settingsModel.data.isEnableNotifications;
}
