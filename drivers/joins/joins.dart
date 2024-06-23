import 'package:get/get.dart';
import 'package:kitakits/models/activities/activities_model.dart';
import 'package:kitakits/models/friends/friends_model.dart';
import 'package:kitakits/models/users/users_model.dart';
import 'package:kitakits/pages/map/create/map_page_create_service.dart';
import 'package:kitakits/plugins/dialog/services/dialog_service.dart';
import 'package:kitakits/plugins/events/models/events_model.dart';
import 'package:kitakits/plugins/joins/joins_storage.dart';
import 'package:kitakits/plugins/joins/models/joins_model.dart';
import 'package:kitakits/plugins/joins/services/joins_service.dart';
import 'package:kitakits/plugins/location/services/location_service.dart';
import 'package:kitakits/plugins/plugins.dart';
import 'package:kitakits/plugins/travels/services/travels_service.dart';
import 'package:kitakits/services/collection/collection_service.dart';
import 'package:kitakits/widgets/pager/join/join_element_service.dart';

class Joins<T> extends Plugins {
  final JoinsStorage eventsStorage = Get.find();
  late JoinsService joinsService = Get.find();
  late TravelsService travelsService = Get.find();
  late JoinsModel joinsModel = Get.find();
  late UsersModel usersModel = Get.find();
  late EventsModel eventsModel = Get.find();
  late CollectionService collectionService = Get.find();
  late LocationService locationService = Get.find();
  late TravelsService destinationService = Get.find();
  late JoinElementService joinElementService = Get.find();
  late FriendsModel friendsModel = Get.find();
  late DialogService dialogService = Get.find();
  late ActivitiesModel activitiesModel = Get.find();
  late MapPageCreateService mapPageCreateService = Get.find();
}
