import 'package:get/get.dart';
import 'package:kitakits/models/friends/friends_model.dart';
import 'package:kitakits/models/users/users_model.dart';
import 'package:kitakits/plugins/events/models/events_model.dart';
import 'package:kitakits/plugins/google/gmap/gmap_controller.dart';
import 'package:kitakits/plugins/guest/services/guest_service.dart';
import 'package:kitakits/plugins/plugins.dart';
import 'package:kitakits/plugins/travels/services/travels_service.dart';
import 'package:kitakits/widgets/navigation/chat/chat_widget_service.dart';
import 'package:kitakits/widgets/navigation/location/location_widget_service.dart';
import 'package:kitakits/widgets/navigation/navigation_widget_service.dart';

class Guest<T> extends Plugins {
  late GuestService guestService = Get.find();
  late GmapController gmapController = Get.find();
  late UsersModel usersModel = Get.find();
  late FriendsModel friendsModel = Get.find();
  late EventsModel eventsModel = Get.find();
  late NavigationWidgetService navigationWidgetService = Get.find();
  late ChatWidgetService chatWidgetService = Get.find();
  late LocationWidgetService locationWidgetService = Get.find();
  late TravelsService travelsService = Get.find();
}
