import 'package:get/get.dart';
import 'package:kitakits/plugins/messages/pages/messages_page.dart';

class MessagesRoutes {
  static const String messagesPage = '/plugins/messagesPage';
  static var getPage = GetPage(name: messagesPage, page: () => MessagesPage(), transition: Transition.leftToRight);
}
