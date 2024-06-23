import 'package:get/get.dart';
import 'package:kitakits/plugins/search/search_storage.dart';
import 'package:kitakits/plugins/search/widgets/search_widget_controller.dart';

import 'services/search_service.dart';

class SearchBinds {

  SearchWidgetController searchWidgetController = SearchWidgetController();
  SearchStorage searchStorage = SearchStorage();
  SearchService searchService = SearchService();

  SearchBinds() {
    Get.lazyPut(() => searchWidgetController, fenix: true);
    Get.lazyPut(() => searchStorage, fenix: true);
    Get.lazyPut(() => searchService, fenix: true);
  }

  Future<void> getFind() async {
    searchStorage = Get.find();
    searchService = Get.find();
    searchWidgetController = Get.find();
  }
}
