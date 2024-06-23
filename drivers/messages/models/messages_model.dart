import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:kitakits/configs.dart';
import 'package:kitakits/plugins/messages/messages_storage.dart';
import 'package:kitakits/plugins/messages/models/messages_model_event.dart';
import 'package:kitakits/storages.dart';
import 'package:kitakits/utils/app_util.dart';
import 'package:kitakits/utils/map_util.dart';

class Messages {
  static String tableName = 'messages';
  final String chatId;
  final String userId;
  final String friendId;
  final String message;
  final bool isLiked;
  int? created;

  Messages({required this.chatId, required this.userId, required this.friendId, required this.message, this.created, required this.isLiked});

  Messages.fromJson(dynamic json)
      : chatId = json['chatId'],
        userId = json['userId'],
        friendId = json['friendId'],
        message = json['message'],
        isLiked = json['isLiked'],
        created = json['created'];

  dynamic toJson() => {'chatId': chatId, 'userId': userId, 'friendId': friendId, 'message': message, 'isLiked': isLiked, 'created': created};
  static Messages toInit() => Messages(chatId: '', userId: '', message: '', friendId: '', isLiked: false);

  static List<Messages> resultsToList(QuerySnapshot<Object?> snapshot) {
    List<Messages> list = [];
    snapshot.docs.toList().forEach((element) {
      var data = element.data();
      list.add(Messages.fromJson(data));
    });
    return list;
  }
}

class MessagesModel extends MessagesModelEvent {
  late DocumentReference<Object?> reference;
  StreamSubscription<dynamic>? subscribeChat = MapUtil.initStreamSubscription();
  List<Messages> list = [];
  int _totalNewMessages = 0;

  MessagesModel() {
    setInit(this);
  }

  Future<void> fetch() async {
    CollectionReference<Object?>? chatReference = collectionService.listChat(user: usersModel.data);
    Future<void> andThen(QuerySnapshot<Object?> snapshot) async {
      list = Messages.resultsToList(snapshot);
      AppUtil.sortListByCreated(list);
      await _listen();
      if (list.isEmpty) return;
      return await set(onFetched);
    }

    await chatReference
        .get()
        .then((snapshot) async => andThen(snapshot))
        .timeout(Configs.firestoreTimeoutInSeconds)
        .onError((error, stackTrace) async => await setError(onError, error, stackTrace: stackTrace));
  }

  Future<void> _listen() async {
    CollectionReference<Object?>? chatReference = collectionService.listChat(user: usersModel.data);
    subscribeChat = chatReference.snapshots().listen((data) async {
      list = Messages.resultsToList(data);
      if (list.isNotEmpty) {
        await _countNewMessages();
        AppUtil.sortListByCreated(list);
        set(onNewMessage);
      }
    });
    subscribeChat?.onError((error) async => await setError(onError, error));
  }

  Future<void> send({required String chatMessage}) async {
    Messages message = Messages(
        chatId: 'chat-${AppUtil.getUuid()}',
        userId: usersModel.data.userId,
        friendId: friendsModel.data.userId,
        message: chatMessage.trim(),
        isLiked: false,
        created: AppUtil.getCurrentTimestamp());
    DocumentReference<Object?>? reference = collectionService.specificChat(user: usersModel.data, chatId: message.chatId);
    Future<void> andThen() async {
      set(onSent);
    }

    Future<void> andError() async {
      set(onNotSent);
    }

    return await runTransactionSet(reference: reference, document: message.toJson(), callback: () => andThen(), callbackOnError: () => andError());
  }

  Future<void> _countNewMessages() async {
    List<Messages> friendMessages = [];
    Future<void> sortDescending() async {
      friendMessages = list.where((friend) => friend.userId != usersModel.data.userId).toList();
      AppUtil.sortListByCreated(friendMessages); /* sort descending by created */
    }

    if (isWindowOpen) {
      await sortDescending();
      if (friendMessages.isNotEmpty) storage.write(MessagesStorage.unreadLastCreated, friendMessages.first.created);
      return;
    }

    if (list.isEmpty) return;
    await sortDescending();
    int unreadLastCreated = storage.read(MessagesStorage.unreadLastCreated);
    friendMessages = friendMessages.where((element) => element.created! > unreadLastCreated).toList();
    _totalNewMessages = friendMessages.length;
  }

  Future<void> runTransactionSet(
      {DocumentReference<Object?>? reference, required Map<String, dynamic> document, required Function callback, required Function callbackOnError}) async {
    return await FirebaseFirestore.instance
        .runTransaction((transaction) async => transaction.set(reference!, document))
        .then((snapshot) async => await callback())
        .timeout(Configs.firestoreTimeoutInSeconds)
        .onError((error, stackTrace) async => await callbackOnError());
  }

  Future<void> updateLiked(Messages data) async {
    DocumentReference<Object?>? chat = collectionService.specificChat(user: usersModel.data, chatId: data.chatId);
    Map<String, Object?> isLiked = {'isLiked': !data.isLiked};
    await chat.update(isLiked).onError((error, stackTrace) async => await setError(onError, error));
    await set(onSavedLike);
  }

  int getTotalNewMessages() => _totalNewMessages;
  Future<void> setWindowStatus({required bool isOpen}) async => isWindowOpen = isOpen;
  Future<void> resetTotal() async {
    _totalNewMessages = 0;
    await setWindowStatus(isOpen: true);
  }
}
