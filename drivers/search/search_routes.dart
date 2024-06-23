import 'package:get/get.dart';
import 'package:kitakits/plugins/search/pages/search_page.dart';

class SearchRoutes {
  static const String searchPage = '/plugins/searchPage';
  static var getPage = GetPage(name: searchPage, page: () => SearchPage(), transition: Transition.leftToRight);
}
