import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:kitakits/models/activities/activities_model.dart';
import 'package:kitakits/models/friends/friends_model.dart';
import 'package:kitakits/models/users/users_model.dart';
import 'package:kitakits/plugins/google/admob/services/admob_service.dart';
import 'package:kitakits/plugins/guest/services/guest_service.dart';
import 'package:kitakits/plugins/joins/services/joins_service.dart';
import 'package:kitakits/plugins/messages/models/messages_model.dart';
import 'package:kitakits/plugins/plugins.dart';
import 'package:kitakits/plugins/settings/models/settings_model.dart';
import 'package:kitakits/plugins/snackbar/snackbar_storage.dart';
import 'package:kitakits/plugins/travels/services/travels_service.dart';
import 'package:kitakits/widgets/navigation/navigation_widget_service.dart';

class Snackbar<T> extends Plugins {
  final GetStorage storage = GetStorage();
  late SnackbarStorage snackbarStorage = Get.find();
  late ActivitiesModel activitiesModel = Get.find();
  late UsersModel usersModel = Get.find();
  late FriendsModel friendsModel = Get.find();
  late MessagesModel messagesModel = Get.find();
  late NavigationWidgetService navigationWidgetService = Get.find();
  late SettingsModel settingsModel = Get.find();
  late AdmobService admobService = Get.find();
  late JoinsService joinsService = Get.find();
  late TravelsService travelsService = Get.find();
  late GuestService guestService = Get.find();
}
