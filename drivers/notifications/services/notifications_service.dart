import 'package:awesome_notifications/awesome_notifications.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:kitakits/plugins/notifications/services/notifications_service_event.dart';
import 'package:kitakits/routes.dart';
import 'package:kitakits/strings.dart';

class NotificationsService extends NotificationsServiceEvent {
  static initialize() {
    AwesomeNotifications().initialize(
        '',
        [
          NotificationChannel(
              channelGroupKey: 'kitakits_group_key',
              channelKey: 'kitakits_key',
              channelName: 'Kitakits Notifications',
              channelDescription: 'Kitakits',
              defaultColor: Colors.black45,
              ledColor: Colors.white)
        ],
        channelGroups: [NotificationChannelGroup(channelGroupKey: 'kitakits_group_key', channelGroupName: 'Kitakits Notifications')],
        debug: false);
  }

  NotificationsService() {
    setInit(this);
    _setListeners();
  }

  Future<void> _setListeners() async {
    AwesomeNotifications().setListeners(
        onActionReceivedMethod: NotificationsServiceEvent.onActionReceivedMethod,
        onNotificationCreatedMethod: NotificationsServiceEvent.onNotificationCreatedMethod,
        onNotificationDisplayedMethod: NotificationsServiceEvent.onNotificationDisplayedMethod,
        onDismissActionReceivedMethod: NotificationsServiceEvent.onDismissActionReceivedMethod);
  }
  Future<void> onActionReceivedMethod(ReceivedAction ra) async => Get.toNamed(Routes.splashPage);
  Future<void> onNotificationCreatedMethod(ReceivedNotification rn) async {}
  Future<void> onNotificationDisplayedMethod(ReceivedNotification rn) async {}
  Future<void> onDismissActionReceivedMethod(ReceivedNotification rn) async {}

  Future<void> notifyWelcome() async  {
      String content = Strings.msgNotificationsWelcome;
      String title = Strings.title(content);
      String msg = Strings.msg(content).replaceAll(Strings.keyUserName, usersModel.data.name);
      await _notify(id: 8, title: title,  msg: msg);
  }
  Future<void> notifyUpgrade() async {
    String content = Strings.msgNotificationsUpdate;
    String title = Strings.title(content);
    String msg = Strings.msg(content);
    await _notify(id: 9, title: title,  msg: msg);
  }
  Future<void> notifyEventCreated() async {
    String content = Strings.msgNotificationsEventCreated;
    String title = Strings.title(content);
    String msg = Strings.msg(content).replaceAll(Strings.keyConsumedCredits, creditsService.getCreditsToConsume().toString());
    await _notify(id: 10, title: title,  msg: msg);
  }

  Future<void> notifyAddedCredits() async {
    String content = Strings.msgNotificationsCreditsAdded;
    String title = Strings.title(content);
    String msg = Strings.msg(content);
    await _notify(id: 11, title: title,  msg: msg);
  }

  Future<void> notifyFriendJoined() async {
    String content = Strings.msgNotificationsFriendJoined;
    String title = Strings.title(content);
    String msg = Strings.msg(content).replaceAll(Strings.keyFriendName, friendsModel.data.name);
    await _notify(id: 12, title: title,  msg: msg);
  }

  Future<void> notifyFriendLeft() async {
    String content = Strings.msgNotificationsFriendLeft;
    String title = Strings.title(content);
    String msg = Strings.msg(content).replaceAll(Strings.keyFriendName, friendsModel.data.name);
    await _notify(id: 13, title: title,  msg: msg);
  }

  Future<void> notifyUserJoined() async {
    String content = Strings.msgNotificationsUserJoined;
    String title = Strings.title(content);
    String msg = Strings.msg(content).replaceAll(Strings.keyFriendName, friendsModel.data.name);
    await _notify(id: 14, title: title,  msg: msg);
  }

  Future<void> _notify({required int id, required String title, required String msg}) async {
    AwesomeNotifications().createNotification(
        content: NotificationContent(
      id: id,
      channelKey: 'kitakits_key',
      actionType: ActionType.Default,
      title: title,
      body: msg,
    ));
    await notificationsModel.addData(title: title, content: msg);
  }
}
