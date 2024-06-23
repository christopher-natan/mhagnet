import 'package:flutter/cupertino.dart';
import 'package:kitakits/plugins/messages/pages/messages_page_event.dart';
import 'package:kitakits/utils/app_util.dart';

class MessagesPageController extends MessagesPageEvent {
  final String idMessages = 'idMessages';
  final String idComposer = 'idComposer';

  MessagesPageController() {
    setInit(this);
  }

  Future<void> prepare() async {}
  bool isUser({required String userId}) {
    return usersModel.data.userId == userId;
  }

  String toAgo({required String created}) {
    return created;
  }

  Future<void> scrollDown() async {
    if(!listViewController.hasClients) return;

    listViewController.animateTo(
      listViewController.position.minScrollExtent,
      duration: const Duration(seconds: 1),
      curve: Curves.fastOutSlowIn,
    );
  }

  Map getDetails() {
    return {'icon': AppUtil.getAvatarUrl(friendsModel.data.icon!), 'name': friendsModel.data.name};
  }

  Future<void> setSending({bool isSending = false}) async {
    this.isSending = isSending;
    await rebuild();
  }

  Future<void> reset() async {
    message = '';
    isSending = false;
    guestService.friendLeft = false;
  }

  String getOnline() {
    if(friendsModel.idleService.isIdle()) return 'Unknown';
    return guestService.friendLeft ? 'Offline' : 'Online';
  }

  Future<void> rebuild() async => update([idMessages]);
}
