import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:kitakits/models/friends/friends_model.dart';
import 'package:kitakits/models/users/users_model.dart';
import 'package:kitakits/plugins/guest/services/guest_service.dart';
import 'package:kitakits/plugins/messages/messages_storage.dart';
import 'package:kitakits/plugins/messages/models/messages_model.dart';
import 'package:kitakits/plugins/messages/services/messages_service.dart';
import 'package:kitakits/plugins/plugins.dart';
import 'package:kitakits/services/collection/collection_service.dart';
import 'package:kitakits/widgets/navigation/chat/chat_widget_service.dart';

class Messages<T> extends Plugins {
  final GetStorage storage = GetStorage();
  late MessagesService messagesService = Get.find();
  late MessagesStorage messagesStorage = Get.find();
  late MessagesModel messagesModel = Get.find();
  late UsersModel usersModel = Get.find();
  late FriendsModel friendsModel = Get.find();
  late GuestService guestService = Get.find();
  late ChatWidgetService chatWidgetService = Get.find();
  late CollectionService collectionService = Get.find();
}
