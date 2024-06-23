import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:kitakits/models/activities/activities_model.dart';
import 'package:kitakits/models/friends/friends_model.dart';
import 'package:kitakits/models/users/users_model.dart';
import 'package:kitakits/plugins/credits/services/credits_service.dart';
import 'package:kitakits/plugins/dialog/services/dialog_service.dart';
import 'package:kitakits/plugins/google/gmap/gmap_controller.dart';
import 'package:kitakits/plugins/joins/models/joins_model.dart';
import 'package:kitakits/plugins/notifications/models/notifications_model.dart';
import 'package:kitakits/plugins/notifications/notifications_storage.dart';
import 'package:kitakits/plugins/plugins.dart';
import 'package:kitakits/plugins/settings/models/settings_model.dart';
import 'package:kitakits/services/collection/collection_service.dart';

class Notifications<T> extends Plugins {
  final GetStorage storage = GetStorage();
  late NotificationsStorage notificationsStorage = Get.find();
  late NotificationsModel notificationsModel = Get.find();
  late DialogService dialogService = Get.find();
  late ActivitiesModel activitiesModel = Get.find();
  late CollectionService collectionService = Get.find();
  late UsersModel usersModel = Get.find();
  late FriendsModel friendsModel = Get.find();
  late CreditsService creditsService = Get.find();
  late GmapController gmapController = Get.find();
  late JoinsModel joinsModel = Get.find();
  late SettingsModel settingsModel = Get.find();
}
