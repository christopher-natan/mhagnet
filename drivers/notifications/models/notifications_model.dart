import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:kitakits/plugins/notifications/models/notifications_model_event.dart';
import 'package:kitakits/utils/app_util.dart';

class Notifications {
  static String tableName = 'notifications';
  String notificationId;
  String avatarColor;
  String title;
  String content;
  int type;
  int created;

  Notifications(
      {required this.avatarColor, required this.notificationId, required this.title, required this.content, required this.type, required this.created});

  Notifications.fromJson(dynamic json)
      : notificationId = json['notificationId'],
        avatarColor = json['avatarColor'],
        title = json['title'],
        content = json['content'],
        type = json['type'],
        created = json['created'];

  static List<Notifications> resultsToList(QuerySnapshot<Object?> snapshot) {
    List<Notifications> list = [];
    snapshot.docs.toList().forEach((element) {
      var data = element.data();
      list.add(Notifications.fromJson(data));
    });
    return list;
  }

  dynamic toJson() => {'avatarColor': avatarColor, 'notificationId': notificationId, 'title': title, 'content': content, 'type': type, 'created': created};
  static Notifications toInit() => Notifications(avatarColor: AppUtil.getRandomRGBO(), notificationId: '', title: '', content: '', type: 1, created: 1);
}

class NotificationsModel extends NotificationsEvent {
  List<Notifications> list = [];
  bool _isSetData = false;

  NotificationsModel() {
    setInit(this);
  }

  Future<bool> setData() async {
    CollectionReference<Object?>? reference = collectionService.listNotification(user: usersModel.data);
    if(list.isNotEmpty) return Future.value(true);
    Future<bool> andThen(QuerySnapshot<Object?> snapshot) async {
      list = Notifications.resultsToList(snapshot);
      AppUtil.sortListByCreated(list);
      _isSetData = true;
      return Future.value(true);
    }

    return await reference.get().then((snapshot) async => andThen(snapshot));
  }

  Future<void> addData({required String title, required String content, int type = 1}) async {
    String notificationId = 'notification-${AppUtil.getUuid()}';
    DocumentReference<Object?>? reference = collectionService.specificNotification(user: usersModel.data, notificationId: notificationId);
    Notifications notifications = Notifications(
        avatarColor: AppUtil.getRandomRGBO(),
        notificationId: notificationId,
        title: title,
        content: content,
        type: type,
        created: AppUtil.getCurrentTimestamp());
    Future<void> andThen() async  {
      _isSetData ? list.insert(0, notifications) : {};
      await set(onUpdated);
    };
    return await runTransactionUpdate(reference: reference, document: notifications.toJson(), callback: () => andThen());
  }

  Future<void> delete() async {
    DocumentReference<Object?>? reference = collectionService.specificNotification(user: usersModel.data, notificationId: notificationIdToDelete);
    await FirebaseFirestore.instance.runTransaction((transaction) async => transaction.delete(reference)).then((value) async  {
      await set(onDeleted);
      Future.delayed(const Duration(milliseconds: 800), ()  async {
        list = list.where((notification) => notification.notificationId != notificationIdToDelete).toList();
        await set(onDeleted);
      });
    });
  }

  Future<void> runTransactionUpdate(
      {DocumentReference<Object?>? reference, required Map<String, dynamic> document, required Function callback, Function? callbackError}) async {
    return await FirebaseFirestore.instance
        .runTransaction((transaction) async => transaction.set(reference!, document))
        .then((snapshot) async => await callback());
  }
}
