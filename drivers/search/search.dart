import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:kitakits/models/users/users_model.dart';
import 'package:kitakits/pages/map/create/map_page_create_service.dart';
import 'package:kitakits/plugins/events/models/events_model.dart';
import 'package:kitakits/plugins/google/gmap/gmap_controller.dart';
import 'package:kitakits/plugins/google/gmap/services/place_service.dart';
import 'package:kitakits/plugins/plugins.dart';
import 'package:kitakits/plugins/search/search_storage.dart';
import 'package:kitakits/plugins/search/services/search_service.dart';
import 'package:kitakits/plugins/travels/services/travels_service.dart';
import 'package:kitakits/widgets/panel/panel_widget_service.dart';

class Search<T> extends Plugins {
  final RxString onShow = ''.obs;
  final RxString onFilledUpKeyword = ''.obs;

  late GetStorage storage = GetStorage();

  late SearchService searchService = Get.find();
  late SearchStorage searchStorage = Get.find();
  late TravelsService travelsService = Get.find();
  late UsersModel usersModel = Get.find();
  late PanelWidgetService panelWidgetService = Get.find();
  late MapPageCreateService mapPageCreateService = Get.find();
  late GmapController gmapController = Get.find();
  late PlaceService placeService = Get.find();
  late EventsModel eventsModel = Get.find();

}
